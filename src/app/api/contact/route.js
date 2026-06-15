import { Resend } from "resend";
import connectDB from "@/lib/db/mongodb";
import Contact from "@/lib/db/models/Contact";
import { contactSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/utils/rateLimiter";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip ?? "unknown";
}

export async function POST(request) {
  try {
    // ── Rate Limiting ─────────────────────────────────────────────────────────
    // Max 3 contact form submissions per IP per hour.
    // Prevents spam without punishing genuine users who correct a typo.
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 3, 3600000);
    if (!rateLimit.allowed) {
      return errorResponse(
        "You've sent too many messages. Please wait an hour before trying again.",
        429,
      );
    }

    // ── Parse Body ────────────────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body.", 400);
    }

    // ── Validate ──────────────────────────────────────────────────────────────
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      // Flatten Zod errors into { fieldName: "error message" } so the
      // frontend can map them directly to form fields.
      const fieldErrors = validation.error.flatten().fieldErrors;
      return Response.json(
        {
          success: false,
          message: "Validation failed.",
          data: { errors: fieldErrors },
        },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = validation.data;

    // ── Save to Database FIRST ────────────────────────────────────────────────
    // WHY SAVE FIRST, EMAIL SECOND:
    // Email delivery can fail (wrong API key, Resend outage, spam filter).
    // Saving first means the contact is never lost even if the email fails.
    // Admin can always see it in the dashboard.
    await connectDB();

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: ip,
    });

    // ── Send Email Notification via Resend ────────────────────────────────────
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    try {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL,
        subject: `New Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
            <h2 style="color: #0A0A0A; margin-bottom: 4px;">New Contact Form Submission</h2>
            <p style="color: #64748B; margin-top: 0; margin-bottom: 24px; font-size: 14px;">${timestamp} IST</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 12px 0; color: #64748B; font-size: 14px; width: 100px;">Name</td>
                <td style="padding: 12px 0; color: #0A0A0A; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 12px 0; color: #64748B; font-size: 14px;">Email</td>
                <td style="padding: 12px 0;">
                  <a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 12px 0; color: #64748B; font-size: 14px;">Subject</td>
                <td style="padding: 12px 0; color: #0A0A0A;">
                  <span style="background: #EFF6FF; color: #2563EB; padding: 2px 10px; border-radius: 4px; font-size: 13px; font-weight: 500;">${subject}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #64748B; font-size: 14px; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; color: #0A0A0A; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</td>
              </tr>
            </table>

            <div style="margin-top: 32px; padding: 12px 16px; background: #F8FAFC; border-left: 3px solid #2563EB; border-radius: 2px;">
              <p style="margin: 0; color: #64748B; font-size: 13px;">
                Reply directly to <strong>${email}</strong> to respond to this message.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      // Email failed but contact is already saved in DB — log and continue.
      // User still gets a success response.
      console.error("[Contact] Resend email failed:", emailError.message, {
        contactId: contact._id.toString(),
      });
    }

    return successResponse(
      { id: contact._id.toString() },
      "Message sent! I will get back to you within 24 hours.",
      201,
    );
  } catch (error) {
    console.error("[Contact] Unexpected error:", error);
    return errorResponse("Something went wrong. Please try again later.", 500);
  }
}
