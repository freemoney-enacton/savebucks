import axios from "axios";
import * as contactFormEntries from "./contact-forms.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config/config";


export const storeContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
  
  const { 
    name,
    email,
    reason,
    message,
   } = req.body as { 
      name: string
      email: string
      reason: string
      message: string
    };

    await contactFormEntries.storeContactForm({ 
      name,
      email,
      reason,
      message,
     });
    
     //send rquest to admin to configure neeto
    axios.post(`${config.env.admin.url}/contact/submit`, {
      name,
      email,
      reason,
      message
    });
    // If no group is specified, return all data
    return reply.sendSuccess(
      1,
      200,
      "Contact Form Submited",
      null,
      null
    );
  };
