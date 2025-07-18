import { db } from "../../database/database";

export const storeContactForm = async ({ 
  name,
  email,
  reason,
  message,
 }: { 
  name: string
  email: string
  reason: string
  message: string
}) => {
  const result = db
    .insertInto("contact_form_entries")
    .values({ 
      name,
      email,
      reason,
      message,
    })
    .execute();
  return result;
};