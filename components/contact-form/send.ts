"use server";

import { Resend } from "resend";
import EmailTemplate from "../EmailTemplate";
import { ContactFormData, contactFormSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: ContactFormData) {
  const validatedData = contactFormSchema.safeParse(data);

  if (validatedData.success) {
    const { name, email, message } = validatedData.data;

    try {
      const data = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: "fikrirakala@gmail.com",
        subject: "Contact form submission",
        react: EmailTemplate({ name, email, message }),
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }

  if (validatedData.error) {
    return { success: false, error: validatedData.error.format() };
  }
}
