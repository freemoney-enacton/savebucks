import * as businessInquiryFormEntries from "./business-inquiry-forms.model";
import { FastifyReply, FastifyRequest } from "fastify";


export const storeBusinessInquiryForm = async (req: FastifyRequest, reply: FastifyReply) => {
  
  const { 
    name,
    email,
    website,
    company_name,
    reason,
    subject,
    message,
   } = req.body as { 
      name: string,
      email: string,
      website: string | null,
      company_name: string | null,
      reason: string,
      subject: string,
      message: string | null
    };

    await businessInquiryFormEntries.storeBusinessInquiryForm({ 
      name,
      email,
      website,
      company_name,
      reason,
      subject,
      message
     });

    // If no group is specified, return all data
    return reply.sendSuccess(
      1,
      200,
      "Business Inquiry Form Submited",
      null,
      null
    );
  };
