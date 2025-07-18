import { createTranslation } from "@/i18n/server";
import { updateAffiliateProfile } from "@/models/affiliates-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    const body = await request.json();

    const { id, name, email, addressLine1, addressLine2 } = body;

    const updateData = {
      name,
      address: {
        address_1: addressLine1,
        address_2: addressLine2,
        country: body.country,
        state: body.state,
        city: body.city,
        pincode: body.pincode,
      },
    };

    const result = await updateAffiliateProfile(id, updateData);

    if (result.status === "error") {
      return commonResponse({
        data: result.data,
        status: "error",
        message: t("profile.errorUpdating"),
      });
    }

    return commonResponse({
      data: result.data?.id,
      status: "success",
      message: t("profile.updated"),
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: t("profile.invalidData"),
    });
  }
}
