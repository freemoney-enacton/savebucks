import crypto from "crypto";
export const replaceMacros = (url: any, macros: any) => {
  Object.keys(macros).forEach((key) => {
    const macroKey = `#${key}`;
    url = url.replace(macroKey, macros[key]);
  });
  return url;
};
export const validateHash = (
  hashMethod: string,
  receivedHash: string,
  combinedData: any
) => {
  const generatedHash = crypto
    .createHash(hashMethod)
    .update(combinedData.toString())
    .digest("hex");
  return generatedHash === receivedHash;
};
