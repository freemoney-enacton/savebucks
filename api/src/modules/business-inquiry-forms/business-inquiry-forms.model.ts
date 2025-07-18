import { db } from "../../database/database";

export const storeBusinessInquiryForm = async ({ 
  name,
  email,
  website,
  company_name,
  reason,
  subject,
  message,
 }: { 
  name: string,
  email: string,
  website: string | null,
  company_name: string | null,
  reason: string,
  subject: string,
  message: string | null
}) => {
  const result = db
    .insertInto("business_inquiries")
    .values({ 
      name,
      email,
      website,
      company_name,
      reason,
      subject,
      message,
    })
    .execute();
  return result;
};