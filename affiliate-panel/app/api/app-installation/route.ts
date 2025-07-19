// import { db } from "@/db";
// import { appInstallEvents } from "@/db/schema";
// import { commonResponse } from "@/utils/response-format";
// import { NextRequest } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     {
//       const {
//         click_code,
//         device_type,
//         device_id,
//         install_timestamp,
//         metadata,
//       } = body;

//       const data: any = {
//         clickCode: click_code,
//         deviceType: device_type,
//         deviceId: device_id,
//         installTimestamp: install_timestamp,
//         metadata: metadata || null,
//         createdAt: new Date(),
//       };
//       const result = await db.insert(appInstallEvents).values(data).execute();

//       const insertId = (result as any).insertId ?? (result as any)[0]?.insertId;

//       return commonResponse({
//         data: insertId,
//         status: "success",
//         message: "App Install Event created successfully",
//       });
//     }
//   } catch (error) {
//     console.error("App Install Events API error:", error);
//     return commonResponse({
//       data: error,
//       status: "error",
//       message: "Failed to create App Install Event",
//     });
//   }
// }
