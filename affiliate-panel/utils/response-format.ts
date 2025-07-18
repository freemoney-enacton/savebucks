import { NextResponse } from "next/server";

export function commonResponse({
  data,
  status,
  message,
}: {
  data: any;
  status: "error" | "success" | "forbidden";
  message: string;
}) {
  const _status = {
    error: 500,
    success: 200,
    forbidden: 403,
  };

  return NextResponse.json(
    {
      data,
      message,
      status,
      status_code: _status[status],
    },
    {
      status: _status[status],
    }
  );
}
