"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiX, FiLoader } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Zod schema — mirrors what the API expects
// ---------------------------------------------------------------------------
const projectSchema = z.object({
  title: z.string().min(2).max(100),
  slug: z.string().min(2),
  tagline: z.string().min(5).max(200),
  category: z.enum(["SaaS", "AI", "Analytics", "DevOps", "Marketplace"]),
  status: z.enum(["live", "development", "archived"]),
  problem: z.string().min(10),
  solution: z.string().min(10),
  description: z.string().min(10),
  // techStack and highlights are managed separately via local state
  // and injected before submit — Zod validates the final merged object
  techStack: z.array(z.string()).min(1, "Add at least one technology"),
  highlights: z.array(z.string()),
  links: z.object({
    live: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  }),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

// ---------------------------------------------------------------------------
// Helper — turn a title string into a URL-safe slug
// ---------------------------------------------------------------------------
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ---------------------------------------------------------------------------
// TagInput — reusable "type + Enter to add, click X to remove" component
// ---------------------------------------------------------------------------
function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [inputValue, setInputValue] = useState("");

  function handleKeyDown(e) {
    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) {
        onAdd(newTag);
      }
      setInputValue("");
    }
    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 min-h-10.5 p-2 rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
            aria-label={`Remove ${tag}`}
          >
            <FiX size={10} />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-30 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ProjectForm component
// Props:
//   project — null for create mode, project object for edit mode
//   onSuccess — called after successful save
//   onCancel  — called when user clicks Cancel
// ---------------------------------------------------------------------------
export default function ProjectForm({ project, onSuccess, onCancel }) {
  const isEditMode = Boolean(project);

  // Tech stack and highlights are arrays managed outside react-hook-form
  // because react-hook-form doesn't natively handle tag-style inputs well
  const [techStack, setTechStack] = useState(project?.techStack || []);
  const [highlights, setHighlights] = useState(project?.highlights || []);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      tagline: project?.tagline || "",
      category: project?.category || "SaaS",
      status: project?.status || "live",
      problem: project?.problem || "",
      solution: project?.solution || "",
      description: project?.description || "",
      techStack: project?.techStack || [],
      highlights: project?.highlights || [],
      links: {
        live: project?.links?.live || "",
        github: project?.links?.github || "",
      },
      featured: project?.featured || false,
      order: project?.order || 0,
    },
  });

  // Watch title field to auto-generate slug (only in create mode)
  const titleValue = watch("title");

  useEffect(() => {
    // Don't overwrite slug in edit mode — user may have a custom slug
    if (!isEditMode && titleValue) {
      setValue("slug", titleToSlug(titleValue));
    }
  }, [titleValue, isEditMode, setValue]);

  // Keep Zod-validated fields in sync with local tag state
  useEffect(() => {
    setValue("techStack", techStack);
  }, [techStack, setValue]);

  useEffect(() => {
    setValue("highlights", highlights);
  }, [highlights, setValue]);

  // -------------------------------------------------------------------------
  // Tag helpers
  // -------------------------------------------------------------------------
  function addTech(tag) {
    setTechStack((prev) => [...prev, tag]);
  }
  function removeTech(tag) {
    setTechStack((prev) => prev.filter((t) => t !== tag));
  }
  function addHighlight(tag) {
    setHighlights((prev) => [...prev, tag]);
  }
  function removeHighlight(tag) {
    setHighlights((prev) => prev.filter((h) => h !== tag));
  }

  // -------------------------------------------------------------------------
  // Submit handler
  // -------------------------------------------------------------------------
  async function onSubmit(data) {
    setIsSubmitting(true);
    setServerError("");

    // Merge tag arrays into the validated data object
    const payload = { ...data, techStack, highlights };

    try {
      const url = isEditMode ? `/api/projects/${project._id}` : "/api/projects";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        // Show the server's validation message if present
        setServerError(json.message || "Something went wrong. Try again.");
        return;
      }

      // Success — let the parent page handle dialog close + list refresh
      onSuccess();
    } catch (err) {
      setServerError("Network error. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      {/* ── Row 1: Title + Slug ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g. TaskFlow AI"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">
            Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            placeholder="e.g. taskflow-ai"
            {...register("slug")}
          />
          <p className="text-xs text-muted-foreground">
            Auto-generated from title — edit if needed
          </p>
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      {/* ── Tagline ─────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="tagline">
          Tagline <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tagline"
          placeholder="One sentence that sells this project"
          {...register("tagline")}
        />
        {errors.tagline && (
          <p className="text-xs text-destructive">{errors.tagline.message}</p>
        )}
      </div>

      {/* ── Row 2: Category + Status ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            Category <span className="text-destructive">*</span>
          </Label>
          {/* shadcn Select is uncontrolled — we wire it via setValue */}
          <Select
            defaultValue={project?.category || "SaaS"}
            onValueChange={(val) => setValue("category", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="AI">AI</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Marketplace">Marketplace</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            defaultValue={project?.status || "live"}
            onValueChange={(val) => setValue("status", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="development">In Development</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* ── Problem ─────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="problem">
          Problem <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="problem"
          rows={3}
          placeholder="What problem does this project solve?"
          {...register("problem")}
        />
        {errors.problem && (
          <p className="text-xs text-destructive">{errors.problem.message}</p>
        )}
      </div>

      {/* ── Solution ─────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="solution">
          Solution <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="solution"
          rows={3}
          placeholder="How does this project solve that problem?"
          {...register("solution")}
        />
        {errors.solution && (
          <p className="text-xs text-destructive">{errors.solution.message}</p>
        )}
      </div>

      {/* ── Description ─────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Full Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Full project description shown on the detail page"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label>
          Tech Stack <span className="text-destructive">*</span>
        </Label>
        <TagInput
          tags={techStack}
          onAdd={addTech}
          onRemove={removeTech}
          placeholder="Type a technology and press Enter"
        />
        <p className="text-xs text-muted-foreground">
          Press Enter or comma after each technology name
        </p>
        {errors.techStack && (
          <p className="text-xs text-destructive">{errors.techStack.message}</p>
        )}
      </div>

      {/* ── Highlights ───────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Label>Key Highlights</Label>
        <TagInput
          tags={highlights}
          onAdd={addHighlight}
          onRemove={removeHighlight}
          placeholder="Type a highlight and press Enter (3–4 recommended)"
        />
        <p className="text-xs text-muted-foreground">
          Short bullet points — e.g. "Real-time collaboration via Socket.io"
        </p>
        {errors.highlights && (
          <p className="text-xs text-destructive">
            {errors.highlights.message}
          </p>
        )}
      </div>

      {/* ── Links ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="links.live">Live URL</Label>
          <Input
            id="links.live"
            placeholder="https://your-project.vercel.app"
            {...register("links.live")}
          />
          {errors.links?.live && (
            <p className="text-xs text-destructive">
              {errors.links.live.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="links.github">GitHub URL</Label>
          <Input
            id="links.github"
            placeholder="https://github.com/you/repo"
            {...register("links.github")}
          />
          {errors.links?.github && (
            <p className="text-xs text-destructive">
              {errors.links.github.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Featured + Order ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-1.5">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            min={0}
            placeholder="0"
            {...register("order")}
          />
          <p className="text-xs text-muted-foreground">
            Lower numbers appear first (0 = first)
          </p>
          {errors.order && (
            <p className="text-xs text-destructive">{errors.order.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Featured on Homepage</Label>
          {/* Using a styled checkbox instead of shadcn Switch to keep it simple */}
          <div className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              id="featured"
              className="h-4 w-4 rounded border-border accent-[#2563EB] cursor-pointer"
              {...register("featured")}
              defaultChecked={project?.featured || false}
            />
            <label
              htmlFor="featured"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Feature this project on the portfolio homepage
            </label>
          </div>
        </div>
      </div>

      {/* ── Server error ─────────────────────────────────────────────────── */}
      {serverError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3">
          <p className="text-sm text-destructive">{serverError}</p>
        </div>
      )}

      {/* ── Form actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white min-w-30"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <FiLoader className="animate-spin" size={14} />
              Saving…
            </span>
          ) : (
            "Save Project"
          )}
        </Button>
      </div>
    </form>
  );
}
