import { createTranslation } from "@/i18n/server";
import { getAffiliateCampaignGoalById } from "@/models/affiliate-campaign-goal-model";
import {
  getAffiliateLinkNameById,
  updateAffiliateLinkStats,
} from "@/models/affiliate-link-model";
import { getAffiliatePostbackByCampaignAndGoal } from "@/models/affiliate-postback-model";
import { getCampaignGoalByTrackingCode } from "@/models/campaign-goal-model";
import { getCampaignById } from "@/models/campaigns-model";
import {
  getClickByClickCode,
  markClickAsConverted,
} from "@/models/clicks-model";
import {
  getConversionByTransactionId,
  insertConversion,
  updateConversionStatus,
  incrementUserEarned,
} from "@/models/conversions-model";
import {
  getPendingPostbackLogs,
  updatePostbackLogStatus,
} from "@/models/postback-log-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();

  try {
    const pendingPostbackLogs = await getPendingPostbackLogs();

    if (pendingPostbackLogs.status === "error" || !pendingPostbackLogs.data) {
      console.log("Error fetching pending postback logs");
      return commonResponse({
        data: null,
        status: "error",
        message: t("conversion.failedToFetchPendingLogs"),
      });
    }

    const processedResults = [];
    const errors = [];

    for (const postbackLog of pendingPostbackLogs.data) {
      try {
        const body: any = postbackLog.rawPostbackData;
        const {
          tracking_code,
          click_code,
          transaction_id,
          status,
          user_earning,
        } = body;
        const userEarn = Number(body?.user_earning ?? 0);

        console.log(
          `Processing postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
        );
        console.log(
          "Receieved data:",
          tracking_code,
          click_code,
          transaction_id,
          status
        );
        const clickRecord = (await getClickByClickCode(click_code))?.data;

        if (!clickRecord) {
          console.log(
            `Invalid click code for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
          );
          await updatePostbackLogStatus(postbackLog.id, "failure", {
            error: t("conversion.invalidClickCode"),
          });
          errors.push({
            postbackLogId: postbackLog.id,
            error: t("conversion.invalidClickCode"),
            transactionId: transaction_id,
          });
          continue;
        }

        console.log(
          `Click record found for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`,
          clickRecord
        );

        const campaignId = body.campaign_id
          ? Number(body.campaign_id)
          : clickRecord.campaignId;

        let campaign = campaignId
          ? (await getCampaignById(campaignId))?.data
          : null;
        let campaignGoal = (await getCampaignGoalByTrackingCode(tracking_code))
          ?.data;
        let affiliateCampaignGoal = null;

        console.log(
          `Campaign and campaign goal found for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`,
          campaign,
          campaignGoal
        );

        if (!campaign || !campaignGoal) {
          console.log(
            `Invalid campaign or goal for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
          );
          await updatePostbackLogStatus(postbackLog.id, "failure", {
            error: t("conversion.invalidCampaignOrGoal"),
          });
          errors.push({
            postbackLogId: postbackLog.id,
            error: t("conversion.invalidCampaignOrGoal"),
            transactionId: transaction_id,
          });
          continue;
        }
        const goal_code = campaignGoal.id;

        affiliateCampaignGoal = (
          await getAffiliateCampaignGoalById(
            Number(goal_code),
            clickRecord.affiliateId
          )
        )?.data;

        const existingConversion = (
          await getConversionByTransactionId(transaction_id)
        )?.data;

        if (existingConversion) {
          console.log(
            `Existing conversion found for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
          );

          if (userEarn > 0) {
            await incrementUserEarned(existingConversion.id, userEarn);
            const clickGoals = (clickRecord as any).campaignGoals || [];
            const goalFromClick = clickGoals.find(
              (g: any) => g.id === Number(goal_code)
            );
            const qualification = Number(
              goalFromClick?.qualificationAmount || 0
            );
            const totalEarned =
              Number(existingConversion.userEarned || 0) + userEarn;
            if (totalEarned >= qualification) {
              await updateConversionStatus(existingConversion.id, "approved");
            }
          }

          if (existingConversion.status === "pending") {
            const updateResult = await updateConversionStatus(
              existingConversion.id,
              status
            );

            if (updateResult.status === "error") {
              console.log(
                `Failed to update conversion status for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
              );
              await updatePostbackLogStatus(postbackLog.id, "failure", {
                error: t("conversion.updateFailed"),
                transactionId: transaction_id,
              });
              errors.push({
                postbackLogId: postbackLog.id,
                error: t("conversion.updateFailed"),
                transactionId: transaction_id,
              });
              continue;
            }

            await updatePostbackLogStatus(postbackLog.id, "success", {
              transactionId: transaction_id,
            });
            processedResults.push({
              postbackLogId: postbackLog.id,
              conversionId: existingConversion.id,
              action: "updated",
              transactionId: transaction_id,
            });
          } else {
            console.log(
              `Conversion already exists and not pending for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
            );
            await updatePostbackLogStatus(postbackLog.id, "failure", {
              error: t("conversion.conversionAlreadyExists"),
              transactionId: transaction_id,
            });
            errors.push({
              postbackLogId: postbackLog.id,
              error: t("conversion.conversionNotPending"),
              transactionId: transaction_id,
            });
            continue;
          }
        } else {
          console.log(
            `Creating new conversion for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
          );
          let conversionValue = campaignGoal?.commissionAmount || "0";
          let commission = campaignGoal?.commissionAmount || "0";

          const clickGoals = (clickRecord as any).campaignGoals || [];
          const goalFromClick = clickGoals.find(
            (g: any) => g.id === Number(goal_code)
          );

          if (goalFromClick) {
            conversionValue = goalFromClick.commissionAmount;
            commission = goalFromClick.commissionAmount;
          } else if (affiliateCampaignGoal) {
            conversionValue = affiliateCampaignGoal.customCommissionRate || "0";
            commission = affiliateCampaignGoal.customCommissionRate || "0";
          }

          const qualification = Number(goalFromClick?.qualificationAmount || 0);
          const newConversion = {
            campaignGoalId: goal_code ? Number(goal_code) : 1,
            campaignId: campaignId || null,
            clickCode: clickRecord.clickCode,
            affiliateId: clickRecord.affiliateId,
            transactionId: `${transaction_id}_${goal_code}`,
            conversionValue,
            commission,
            userEarned: userEarn,
            sub1: clickRecord.sub1,
            sub2: clickRecord.sub2,
            sub3: clickRecord.sub3,
            status: goalFromClick
              ? userEarn >= qualification
                ? "approved"
                : "pending"
              : "untracked",
            postbackLogId: postbackLog.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            convertedAt: new Date(),
          };

          console.log("New Conversion", newConversion);

          const createConversion = await insertConversion(newConversion);

          if (createConversion.status === "error") {
            console.log(
              `Failed to create new conversion for postback log ID: ${postbackLog.id}, Transaction ID: ${transaction_id}`
            );
            await updatePostbackLogStatus(postbackLog.id, "failure");
            errors.push({
              postbackLogId: postbackLog.id,
              // error: t("conversion.createFailed"),
              transactionId: transaction_id,
              error: createConversion.data,
            });
            continue;
          }

          const conversionData = createConversion.data;

          await markClickAsConverted(clickRecord.clickCode);

          const updateLinkEarnings = await updateAffiliateLinkStats(
            clickRecord.affiliateLinkId,
            undefined,
            conversionData.commission
          );

          const affiliatePostback = (
            await getAffiliatePostbackByCampaignAndGoal(
              clickRecord.affiliateId,
              campaignId || 0,
              Number(goal_code)
            )
          )?.data;

          if (affiliatePostback && affiliatePostback.length > 0) {
            for (const postback of affiliatePostback) {
              const link_name =
                (await getAffiliateLinkNameById(clickRecord.affiliateLinkId))
                  ?.data || "default";
              const postbackData: any = {
                affiliate_id: clickRecord.affiliateId,
                affiliate_link_id: clickRecord.affiliateLinkId,
                campaign_id: campaignId || 0,
                link_name: link_name,
                goal_name: campaignGoal?.name,
                campaign_goal_id: goal_code ? Number(goal_code) : 1,
                conversion_id: conversionData.id,
                conversion_value: conversionData.conversionValue,
                commission_value: conversionData.commission,
                subId1: conversionData.sub1,
                subId2: conversionData.sub2,
                subId3: conversionData.sub3,
                converted_at: conversionData.convertedAt,
                transaction_id: transaction_id,
                click_code: clickRecord.clickCode,
                status: status || "pending",
              };

              try {
                let finalUrl = postback.postbackUrl;

                for (const key in postbackData) {
                  const value = postbackData[key];
                  const macro = `{${key}}`;

                  finalUrl = finalUrl.replace(
                    new RegExp(macro, "g"),
                    encodeURIComponent(String(value))
                  );
                }

                console.log("Sending postback to URL:", finalUrl);
                const response = await fetch(finalUrl, {
                  method: postback.methodType || "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body:
                    postback.methodType === "GET"
                      ? undefined
                      : JSON.stringify(postbackData),
                });

                const data = await response.json();
                console.log(
                  `Postback sent successfully for conversion ID: ${conversionData.id}, Response status: ${response.status}`
                );
              } catch (error: any) {
                console.error(
                  `Postback error for conversion ID: ${conversionData.id}`,
                  error
                );
                await updatePostbackLogStatus(postbackLog.id, "failure", {
                  error: error.message || "Postback sending failed",
                  transactionId: transaction_id,
                });
              }
            }
          } else {
            console.log(
              `No postback found for affiliate ID: ${clickRecord.affiliateId}, Campaign ID: ${clickRecord.campaignId}, Goal Code: ${goal_code}`
            );
            await updatePostbackLogStatus(postbackLog.id, "failure", {
              error: "No postback found for affiliate",
              transactionId: transaction_id,
            });
          }

          await updatePostbackLogStatus(postbackLog.id, "success", {
            transactionId: transaction_id,
          });
          processedResults.push({
            postbackLogId: postbackLog.id,
            conversionId: conversionData.id,
            action: "created",
            transactionId: transaction_id,
          });
        }
      } catch (error: any) {
        console.error(
          `Error processing postback log ID: ${postbackLog.id}`,
          error
        );
        await updatePostbackLogStatus(postbackLog.id, "failure", {
          error: error.message || "Unknown error",
          transactionId: postbackLog.transactionId,
        });
        errors.push({
          postbackLogId: postbackLog.id,
          error: error.message || "Unknown error",
          transactionId: postbackLog.transactionId,
        });
      }
    }

    const summary = {
      totalProcessed: pendingPostbackLogs.data.length,
      successful: processedResults.length,
      failed: errors.length,
      processedResults,
      errors,
    };

    console.log("Cron job processing summary:", summary);

    return commonResponse({
      data: summary,
      status: "success",
      message: `Processed ${summary.totalProcessed} postback logs. ${summary.successful} successful, ${summary.failed} failed.`,
    });
  } catch (error) {
    console.error("Cron job processing error:", error);
    return commonResponse({
      data: null,
      status: "error",
      message: t("conversion.cronJobFailed"),
    });
  }
}
