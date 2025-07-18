import { createTranslation } from "@/i18n/server";
import { updateAffiliateBankDetails } from "@/models/affiliates-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const { id, bankDetails } = body;

    const data = {
      bank_name: bankDetails.bankName,
      bank_account_no: bankDetails.accountNumber,
      bank_account_holder_name: bankDetails.accountHolderName,
      bank_ifsc_bic_code: bankDetails.ifscBicCode,
      bank_account_type: bankDetails.accountType,
      bank_swift_code: bankDetails.swiftCode,
    }

    const result = await updateAffiliateBankDetails(id, data);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("payments.errorUpdatingBankDetails"),
      });
    }

    return commonResponse({
      data: result.data,
      status: "success",
      message: t("payments.bankDetailsUpdated"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("payments.invalidData"),
    });
  }
}
