import { z } from "zod";

// Zod schema for the public contact form.
// Keeps validation logic in one place — used by both the API route (server)
// and can be imported into the frontend form for client-side validation too.
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be 100 characters or fewer." })
    .trim(),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .toLowerCase(),

  // Restrict to known subjects so the DB never holds arbitrary strings here.
  // This also makes filtering contacts by type straightforward on the admin side.
  subject: z.enum(
    ["Job Opportunity", "Project Inquiry", "Freelance", "General"],
    {
      errorMap: () => ({
        message:
          "Subject must be one of: Job Opportunity, Project Inquiry, Freelance, General.",
      }),
    },
  ),

  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(2000, { message: "Message must be 2000 characters or fewer." })
    .trim(),
  // Honeypot — must be empty. Bots fill every field; real users never see this.
  website: z.string().max(0, { message: "Bot detected." }).optional(),

  // Turnstile token — set automatically when widget completes, never by user
  cfToken: z.string().min(1, { message: "Please complete the verification." }),
});

// In a pure-JS project we cannot use z.infer<typeof contactSchema> (that is TypeScript).
// Instead, export the schema itself — consumers call schema.parse() or schema.safeParse()
// and the inferred shape is whatever the schema produces at runtime.
export default contactSchema;
