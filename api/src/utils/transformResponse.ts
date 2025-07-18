import crypto from "crypto";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  let day = ("0" + date.getDate()).slice(-2); // Ensure two digits
  let month = ("0" + (date.getMonth() + 1)).slice(-2); // Ensure two digits
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
function transformData(
  item: any,
  modelConfig: any,
  default_lang: string,
  lang: string,
  currency: any
): any {
  const parseValue = (value: any, lang: string, default_lang: string) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed == "object") {
        return parsed[lang] || parsed[default_lang] || null;
      } else {
        return parsed || null;
      }
      // If parsed is an object and contains the lang key, return it, otherwise return the parsed value or null
    } catch (e) {
      // If parsing fails, return the original value if it's a string or number, otherwise null
      return typeof value === "string" || typeof value === "number"
        ? value
        : null;
    }
  };
  currency = JSON.parse(currency);
  return Object.entries(item).reduce((newItem: any, [key, value]: any) => {
    // if (!modelConfig.hidden.includes(key)) {
    // Translate fields
    if (modelConfig.translatable?.includes(key)) {
      if (value == null) {
        newItem[key] = null;
      } else if (typeof value === "string" || typeof value === "number") {
        newItem[key] = parseValue(value, lang, default_lang);
      } else {
        newItem[key] = value[lang] || value[default_lang] || null;
      }
    }
    // Format money fields
    else if (modelConfig?.money?.includes(key)) {
      newItem[key] = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency?.val,
      }).format(value);
    }
    // Format date fields
    else if (modelConfig?.date?.includes(key)) {
      newItem[key] = formatDate(value);
    }
    // Copy other fields as-is
    else {
      newItem[key] = value;
    }
    return newItem;
  }, {});
}

async function transformResponse(
  data: any,
  modelConfig: any,
  default_lang: string,
  lang: string,
  currency: any | null
): Promise<any> {
  if (Array.isArray(data)) {
    return data.map((item) =>
      transformData(item, modelConfig, default_lang, lang, currency)
    );
  } else {
    return transformData(data, modelConfig, default_lang, lang, currency);
  }
}
export default transformResponse;

export const currencyTransform = (
  currency: any,
  data: any,
  method: "prefix" | "suffix"
) => {
  if (method == "prefix") {
    return `${currency}${data}`;
  } else {
    return `${data}${currency}`;
  }
};
export function generateHash(combinedData: any, method: any) {
  const data = `${combinedData}`;
  const hash = crypto.createHash(method);
  hash.update(data);
  return hash.digest("hex");
}
