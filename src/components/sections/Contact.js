// "use client";

// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { FiMail, FiMapPin, FiGithub, FiSend, FiLoader } from "react-icons/fi";

// import SectionHeading from "@/components/shared/SectionHeading";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { contactSchema } from "@/lib/validations/contact";

// export default function Contact() {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(contactSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       const result = await res.json();

//       if (result.success) {
//         // Prevents the connect modal from appearing after a successful submission
//         sessionStorage.setItem("contact_submitted", "true");
//         toast.success("Message sent!", {
//           description: "I'll get back to you within 24 hours.",
//         });
//         reset();
//       } else {
//         toast.error("Failed to send", { description: result.message });
//       }
//     } catch {
//       toast.error("Something went wrong", { description: "Please try again." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section id="contact" className="bg-card py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <SectionHeading
//           title="Get In Touch"
//           subtitle="Have a project in mind or want to discuss an opportunity? I would love to hear from you."
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
//           {/* LEFT COLUMN — Contact Info */}
//           <div className="flex flex-col gap-6">
//             <h3 className="font-heading text-2xl font-bold text-foreground">
//               Let&apos;s Work Together
//             </h3>

//             <p className="text-muted-foreground leading-relaxed">
//               I&apos;m currently open to full-time roles, freelance projects,
//               and interesting collaborations. Typical response time is within 24
//               hours.
//             </p>

//             <div className="flex flex-col gap-4 mt-2">
//               {/* mailto link — uses text-foreground so it's visible in both modes */}
//               <a
//                 href="mailto:asifmullaofficial@gmail.com"
//                 className="flex items-center gap-3 text-foreground hover:text-portfolio-accent transition-colors"
//               >
//                 <FiMail className="w-5 h-5 text-portfolio-accent shrink-0" />
//                 <span>asifmullaofficial@gmail.com</span>
//               </a>

//               <div className="flex items-center gap-3 text-foreground">
//                 <FiMapPin className="w-5 h-5 text-portfolio-accent shrink-0" />
//                 <span>India (Open to Remote)</span>
//               </div>

//               <a
//                 href="https://github.com/AsifpMulla123"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-3 text-foreground hover:text-portfolio-accent transition-colors"
//               >
//                 <FiGithub className="w-5 h-5 text-portfolio-accent shrink-0" />
//                 <span>github.com/AsifpMulla123</span>
//               </a>
//             </div>

//             {/* Availability badge */}
//             <div
//               className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border mt-2"
//               style={{
//                 backgroundColor: "rgb(16 185 129 / 0.1)",
//                 borderColor: "rgb(16 185 129 / 0.2)",
//               }}
//             >
//               <span className="relative flex h-2.5 w-2.5">
//                 <span
//                   className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
//                   style={{ backgroundColor: "#10b981" }}
//                 />
//                 <span
//                   className="relative inline-flex rounded-full h-2.5 w-2.5"
//                   style={{ backgroundColor: "#10b981" }}
//                 />
//               </span>
//               <span className="text-sm font-medium text-foreground">
//                 Available for new opportunities
//               </span>
//             </div>
//           </div>

//           {/* RIGHT COLUMN — Contact Form */}
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="flex flex-col gap-5"
//           >
//             {/* Name */}
//             <div className="flex flex-col gap-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Your full name"
//                 {...register("name")}
//               />
//               {errors.name && (
//                 <p className="text-sm text-destructive">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="flex flex-col gap-2">
//               <Label htmlFor="email">Email Address</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="your@email.com"
//                 {...register("email")}
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/*
//               Subject — shadcn Select via Controller.
//               Wrapped in a div with min-h to prevent layout shift when
//               the popover opens — the surrounding form rows don't reflow.
//             */}
//             <div className="flex flex-col gap-2">
//               <Label htmlFor="subject">Subject</Label>
//               <Controller
//                 name="subject"
//                 control={control}
//                 render={({ field }) => (
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger id="subject">
//                       <SelectValue placeholder="Select a subject" />
//                     </SelectTrigger>
//                     {/*
//                       position="popper" (default) opens below without reflowing
//                       the page. avoidCollisions keeps it from flipping upward
//                       unexpectedly and causing a visual jump.
//                     */}
//                     <SelectContent position="popper" avoidCollisions={false}>
//                       <SelectItem value="Job Opportunity">
//                         Job Opportunity
//                       </SelectItem>
//                       <SelectItem value="Project Inquiry">
//                         Project Inquiry
//                       </SelectItem>
//                       <SelectItem value="Freelance">Freelance</SelectItem>
//                       <SelectItem value="General">General</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {errors.subject && (
//                 <p className="text-sm text-destructive">
//                   {errors.subject.message}
//                 </p>
//               )}
//             </div>

//             {/* Message */}
//             <div className="flex flex-col gap-2">
//               <Label htmlFor="message">Message</Label>
//               <Textarea
//                 id="message"
//                 rows={5}
//                 placeholder="Tell me about your project or opportunity..."
//                 {...register("message")}
//               />
//               {errors.message && (
//                 <p className="text-sm text-destructive">
//                   {errors.message.message}
//                 </p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
//               style={{ backgroundColor: "#2563EB" }}
//             >
//               {isSubmitting ? (
//                 <>
//                   <FiLoader className="w-4 h-4 animate-spin" />
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <FiSend className="w-4 h-4" />
//                   Send Message
//                 </>
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FiMail, FiMapPin, FiGithub, FiSend, FiLoader } from "react-icons/fi";
import dynamic from "next/dynamic";

import SectionHeading from "@/components/shared/SectionHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/validations/contact";

// Lazy load Turnstile — only downloaded when the contact section is visible.
// This prevents Cloudflare's script from blocking the initial page load.
// ssr: false because Turnstile needs window/document to initialize.
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);
export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controls whether the Turnstile widget is mounted at all.
  // Starts false — becomes true only when the section scrolls into view.
  const [showTurnstile, setShowTurnstile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // IntersectionObserver fires when the contact section enters the viewport.
    // rootMargin: "200px" means we start loading 200px before it's visible —
    // gives Cloudflare's script time to load before the user reaches the form.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowTurnstile(true);
          // Once triggered we never need to observe again
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "", // honeypot — always empty for real users, bots fill it
      cfToken: "", // set automatically by Turnstile widget, never by user
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        // Prevents the connect modal from appearing after a successful submission
        sessionStorage.setItem("contact_submitted", "true");
        toast.success("Message sent!", {
          description: "I'll get back to you within 24 hours.",
        });
        reset();
      } else {
        toast.error("Failed to send", { description: result.message });
      }
    } catch {
      toast.error("Something went wrong", { description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-card py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind or want to discuss an opportunity? I would love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* ── LEFT COLUMN — Contact Info ─────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Let&apos;s Work Together
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              I&apos;m currently open to full-time roles, freelance projects,
              and interesting collaborations. Typical response time is within 24
              hours.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <a
                href="mailto:asifmullaofficial@gmail.com"
                className="flex items-center gap-3 text-foreground hover:text-portfolio-accent transition-colors"
              >
                <FiMail className="w-5 h-5 text-portfolio-accent shrink-0" />
                <span>asifmullaofficial@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-foreground">
                <FiMapPin className="w-5 h-5 text-portfolio-accent shrink-0" />
                <span>India (Open to Remote)</span>
              </div>

              <a
                href="https://github.com/AsifpMulla123"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-portfolio-accent transition-colors"
              >
                <FiGithub className="w-5 h-5 text-portfolio-accent shrink-0" />
                <span>github.com/AsifpMulla123</span>
              </a>
            </div>

            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border mt-2"
              style={{
                backgroundColor: "rgb(16 185 129 / 0.1)",
                borderColor: "rgb(16 185 129 / 0.2)",
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: "#10b981" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ backgroundColor: "#10b981" }}
                />
              </span>
              <span className="text-sm font-medium text-foreground">
                Available for new opportunities
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Contact Form ────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/*
              Honeypot field — completely hidden from real users.
              Bots crawl the DOM and fill every input they find.
              If this field arrives with any value, the API route
              silently rejects the submission without revealing why.
            */}
            <input
              type="text"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: "none" }}
              {...register("website")}
            />

            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/*
              Subject — shadcn Select controlled via Controller.
              position="popper" + avoidCollisions={false} prevents the
              dropdown from flipping upward and causing a layout shift.
            */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent position="popper" avoidCollisions={false}>
                      <SelectItem value="Job Opportunity">
                        Job Opportunity
                      </SelectItem>
                      <SelectItem value="Project Inquiry">
                        Project Inquiry
                      </SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/*
              Turnstile widget — Cloudflare's bot protection.
              For real users this resolves silently in the background
              within 1-2 seconds of page load — no puzzles, no friction.
              onSuccess: stores the verification token in the form state.
              onError/onExpire: clears the token so submit stays blocked
              until the user refreshes and gets a fresh verification.
              theme="auto" follows your site's light/dark mode.
            */}
            <div className="flex flex-col gap-2">
              {showTurnstile ? (
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => {
                    // Cloudflare confirmed this is a real browser — store token
                    setValue("cfToken", token, { shouldValidate: true });
                  }}
                  onError={() => {
                    // Verification failed — block submit until page is refreshed
                    setValue("cfToken", "", { shouldValidate: false });
                    toast.error("Verification failed", {
                      description: "Please refresh the page and try again.",
                    });
                  }}
                  onExpire={() => {
                    // Token expires after ~5 minutes of inactivity — clear it
                    setValue("cfToken", "", { shouldValidate: false });
                    toast.warning("Verification expired", {
                      description: "Please refresh the page to resubmit.",
                    });
                  }}
                  options={{
                    theme: "auto",
                    size: "normal",
                  }}
                />
              ) : (
                <div style={{ height: "65px" }} />
              )}
              {/*
                Only show this error if the user hits Submit before
                Turnstile has finished loading — rare but possible on
                very slow connections.
              */}
              {errors.cfToken && (
                <p className="text-sm text-destructive">
                  {errors.cfToken.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: "#2563EB" }}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
