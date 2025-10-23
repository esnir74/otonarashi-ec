import { contactFormSchema } from "@/lib/validations/contact";
import { generateContactEmailHtml } from "@/lib/email/contactEmailHtml";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const trimmedCompanyName = (data.companyName ?? "").trim();
    const subjectDetail = trimmedCompanyName
      ? `${trimmedCompanyName} - ${data.name}様より`
      : `${data.name}様より`;

    // Send email using Resend
    const { error: emailError } = await resend.emails.send({
      from: "オトナラシ <noreply@otonarashi.com>", // TODO: Update with actual domain
      to: [process.env.CONTACT_EMAIL || "8_carpboy_74@au.com"],
      replyTo: data.email,
      subject: `お問い合わせ: ${subjectDetail}`,
      html: generateContactEmailHtml(data),
    });

    if (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Contact form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
