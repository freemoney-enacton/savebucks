import { db } from "../../../database/database";
import app from "../../../app";
import transformResponse from "../../../utils/transformResponse";
const columns = {
  translatable: ["name", "title", "blocks"],
  money: [],
  date: [],
};
export const fetch = async (
  lang: string,
  default_lang: string,
  purpose: string | null
) => {
  const result = await db
    .selectFrom("blocks")
    .selectAll()
    .where("status", "=", "publish")
    .$if(purpose != null, (qb) => qb.where("purpose", "=", purpose))
    .execute();

  const response = await transformResponse(
    result,
    columns,
    default_lang,
    lang,
    null
  );
  return response;
};
