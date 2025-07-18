import { activityConfig } from "../config/activityConfig";
import { assignBonus } from "../events/listeners/assignBonus";
import { bonusDetails } from "../modules/user-bonuses/bonuses.model";
import { sendActivitiesNotification } from "./sendUserActivities";

export async function handleBonusAndNotifications(
  user_id: number,
  bonus: any,
  referredBy?: any
) {
  // Determine if the bonus expires and calculate the expiration date if applicable
 if(bonus){
  const expiresOn = calculateExpiration(bonus.validity_days,bonus.qualifying_amount);
  // Assign the user bonus
    await assignBonus({
      user_id: user_id,
      amount: Number(bonus.amount),
      bonus_code: bonus.code,
      expires_on: expiresOn,
      referred_bonus_id: null,
    });
  
    // Send notification for the bonus
    await sendActivitiesNotification({
      user_id: user_id,
      activity_type: "bonus_earnings",
      icon: activityConfig.bonus_earnings.icon,
      title: activityConfig.bonus_earnings.title_status_assigned,
      status: "assigned",
      url: activityConfig.bonus_earnings.url,
      amount: Number(bonus.amount),
      data: JSON.stringify({
        message: "Bonus for " + (referredBy ? "Referral" : "Registration"),
      }),
    });
  }

  // Handle referral specific bonuses if referredBy is provided
  if (referredBy) {
    const referBonus = await bonusDetails("refer_bonus");
    if (referBonus) {      

    const referralExpiresOn = calculateExpiration(referBonus?.validity_days,referBonus?.qualifying_amount);

      await assignBonus({
        user_id: referredBy.id,
        amount: Number(referBonus?.amount),
        bonus_code: referBonus?.code,
        expires_on: referralExpiresOn,
        referred_bonus_id: user_id,
      });
  
      await sendActivitiesNotification({
        user_id: referredBy.id,
        activity_type: "referrals",
        icon: activityConfig.referrals.icon,
        title: activityConfig.referrals.title_create,
        status: "assigned",
        url: activityConfig.referrals.url,
        amount: Number(referBonus.amount),
        data: JSON.stringify({
          message: "Referral User Bonus",
          referred_userId: user_id,
        }),
      });
  
      await sendActivitiesNotification({
        user_id: referredBy.id,
        activity_type: "bonus_earnings",
        icon: activityConfig.bonus_earnings.icon,
        title: activityConfig.bonus_earnings.title_status_assigned,
        status: "assigned",
        url: activityConfig.bonus_earnings.url,
        amount: Number(referBonus.amount),
        data: JSON.stringify({
          message: "Referral User Bonus",
          referred_userId: user_id,
        }),
      });

    }
    }
  }

function calculateExpiration(validityDays: number, qualifyingAmt: number) {
  return validityDays === 0 || qualifyingAmt === 0
    ? null
    : new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();
}
