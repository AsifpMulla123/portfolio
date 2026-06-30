// "use client";

// import { useState } from "react";
// import useSWR from "swr";
// import {
//   FiPlus,
//   FiEdit2,
//   FiArchive,
//   FiExternalLink,
//   FiGithub,
//   FiRefreshCw,
//   FiFolder,
//   FiCheck,
//   FiMinus,
// } from "react-icons/fi";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import ProjectForm from "@/components/admin/ProjectForm";
// import PublishButton from "@/components/admin/PublishButton";

// // ---------------------------------------------------------------------------
// // SWR fetcher — standard JSON fetch, throws on non-ok responses
// // ---------------------------------------------------------------------------
// async function fetcher(url) {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Failed to load projects");
//   const json = await res.json();
//   return json.data; // our API always returns { success, message, data }
// }

// // ---------------------------------------------------------------------------
// // Category badge colours — matches the public Projects section palette
// // ---------------------------------------------------------------------------
// const CATEGORY_STYLES = {
//   SaaS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
//   AI: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
//   Analytics:
//     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
//   DevOps:
//     "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
//   Marketplace:
//     "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
// };

// // Status badge — live = green, development = amber, archived = muted
// const STATUS_STYLES = {
//   live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
//   development:
//     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
//   archived: "bg-muted text-muted-foreground",
// };

// const STATUS_LABELS = {
//   live: "Live",
//   development: "In Dev",
//   archived: "Archived",
// };

// // ---------------------------------------------------------------------------
// // Loading skeleton — shown while SWR is fetching
// // ---------------------------------------------------------------------------
// function TableSkeleton() {
//   return (
//     <div className="space-y-3">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <div
//           key={i}
//           className="flex items-center gap-4 px-4 py-3 border border-border rounded-lg"
//         >
//           <Skeleton className="h-4 w-48" />
//           <Skeleton className="h-5 w-20 rounded-full" />
//           <Skeleton className="h-5 w-16 rounded-full" />
//           <Skeleton className="h-4 w-4 rounded" />
//           <Skeleton className="h-8 w-8 rounded" />
//           <Skeleton className="h-8 w-16 rounded ml-auto" />
//         </div>
//       ))}
//     </div>
//   );
// }

// // ---------------------------------------------------------------------------
// // Empty state — shown when there are no projects yet
// // ---------------------------------------------------------------------------
// function EmptyState({ onAdd }) {
//   return (
//     <Card className="flex flex-col items-center justify-center gap-4 py-16 text-center border-dashed">
//       <div className="rounded-full bg-muted p-4">
//         <FiFolder size={32} className="text-muted-foreground" />
//       </div>
//       <div>
//         <p className="text-base font-medium text-foreground">No projects yet</p>
//         <p className="text-sm text-muted-foreground mt-1">
//           Add your first project to get started.
//         </p>
//       </div>
//       <Button
//         onClick={onAdd}
//         className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
//       >
//         <FiPlus size={14} className="mr-2" />
//         Add Your First Project
//       </Button>
//     </Card>
//   );
// }

// // ---------------------------------------------------------------------------
// // Main page component
// // ---------------------------------------------------------------------------
// export default function AdminProjectsPage() {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState(null); // null = create mode
//   const [showPublish, setShowPublish] = useState(false);
//   const [archivingId, setArchivingId] = useState(null); // tracks which row is loading

//   // SWR — fetches /api/projects and caches it
//   const { data, isLoading, error, mutate } = useSWR("/api/projects", fetcher);
//   const projects = data || [];

//   // -------------------------------------------------------------------------
//   // Open dialog for creating a new project
//   // -------------------------------------------------------------------------
//   function handleAddClick() {
//     setEditingProject(null);
//     setDialogOpen(true);
//   }

//   // -------------------------------------------------------------------------
//   // Open dialog pre-filled with the selected project for editing
//   // -------------------------------------------------------------------------
//   function handleEditClick(project) {
//     setEditingProject(project);
//     setDialogOpen(true);
//   }

//   // -------------------------------------------------------------------------
//   // Archive (DELETE) a project after confirmation
//   // -------------------------------------------------------------------------
//   async function handleArchive(project) {
//     // Simple native confirm — avoids adding another modal layer
//     const confirmed = window.confirm(
//       `Archive "${project.title}"? It will be hidden from the portfolio.`,
//     );
//     if (!confirmed) return;

//     setArchivingId(project._id);

//     try {
//       const res = await fetch(`/api/projects/${project._id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const json = await res.json();
//         alert(json.message || "Failed to archive project. Try again.");
//         return;
//       }

//       // Optimistic update — remove from local SWR cache immediately
//       await mutate((current) => current.filter((p) => p._id !== project._id), {
//         revalidate: false,
//       });

//       // Show the Publish button so user knows to push changes live
//       setShowPublish(true);
//     } catch (err) {
//       alert("Network error. Check your connection and try again.");
//     } finally {
//       setArchivingId(null);
//     }
//   }

//   // -------------------------------------------------------------------------
//   // Called by ProjectForm on success — refresh list, show Publish button
//   // -------------------------------------------------------------------------
//   function handleFormSuccess() {
//     setDialogOpen(false);
//     mutate(); // re-fetch from server to get latest data including new _id
//     setShowPublish(true);
//   }

//   // -------------------------------------------------------------------------
//   // Render
//   // -------------------------------------------------------------------------
//   return (
//     <div className="flex flex-col gap-6">
//       {/* Page header */}

//       {/* ── Action bar ──────────────────────────────────────────────────── */}
//       <div className="flex items-center justify-between gap-4 flex-wrap">
//         {/* Left: project count */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-muted-foreground">
//             {isLoading
//               ? "Loading…"
//               : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
//           </span>
//         </div>

//         {/* Right: Publish button (conditional) + Add button */}
//         <div className="flex items-center gap-3 flex-wrap">
//           {showPublish && (
//             <div className="flex items-center gap-3">
//               {/* Inform the user why this button appeared */}
//               <span className="text-xs text-muted-foreground">
//                 Changes saved — click Publish to go live
//               </span>
//               <PublishButton
//                 paths={["/"]}
//                 onBeforePublish={() => {
//                   // Nothing to do — data is already saved to DB
//                   // PublishButton will call /api/revalidate to trigger ISR
//                 }}
//                 onSuccess={() => setShowPublish(false)}
//               />
//             </div>
//           )}

//           <Button
//             onClick={handleAddClick}
//             className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
//           >
//             <FiPlus size={14} className="mr-2" />
//             Add Project
//           </Button>
//         </div>
//       </div>

//       {/* ── Content area ────────────────────────────────────────────────── */}
//       {isLoading ? (
//         <TableSkeleton />
//       ) : error ? (
//         // Error state — let user retry
//         <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
//           <p className="text-sm text-destructive">
//             Failed to load projects. Check your connection.
//           </p>
//           <Button variant="outline" size="sm" onClick={() => mutate()}>
//             <FiRefreshCw size={13} className="mr-2" />
//             Retry
//           </Button>
//         </Card>
//       ) : projects.length === 0 ? (
//         <EmptyState onAdd={handleAddClick} />
//       ) : (
//         // ── Projects table ───────────────────────────────────────────────
//         <div className="rounded-lg border border-border overflow-hidden">
//           {/* Table header */}
//           <div className="grid grid-cols-[2fr_1fr_1fr_80px_120px_100px] gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
//             <span>Title</span>
//             <span>Category</span>
//             <span>Status</span>
//             <span className="text-center">Featured</span>
//             <span>Live</span>
//             <span className="text-right">Actions</span>
//           </div>

//           {/* Table rows */}
//           <div className="divide-y divide-border">
//             {projects.map((project) => (
//               <div
//                 key={project._id}
//                 className="grid grid-cols-[2fr_1fr_1fr_80px_120px_100px] gap-4 px-4 py-3.5 items-center hover:bg-muted/30 transition-colors"
//               >
//                 {/* Title */}
//                 <div className="min-w-0">
//                   <p className="font-medium text-sm text-foreground truncate font-heading">
//                     {project.title}
//                   </p>
//                   <p className="text-xs text-muted-foreground truncate mt-0.5">
//                     {project.tagline}
//                   </p>
//                 </div>

//                 {/* Category badge */}
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
//                     CATEGORY_STYLES[project.category] ||
//                     "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {project.category}
//                 </span>

//                 {/* Status badge */}
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
//                     STATUS_STYLES[project.status] ||
//                     "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {STATUS_LABELS[project.status] || project.status}
//                 </span>

//                 {/* Featured checkmark */}
//                 <div className="flex justify-center">
//                   {project.featured ? (
//                     <FiCheck
//                       size={15}
//                       className="text-emerald-600 dark:text-emerald-400"
//                       aria-label="Featured"
//                     />
//                   ) : (
//                     <FiMinus
//                       size={15}
//                       className="text-muted-foreground"
//                       aria-label="Not featured"
//                     />
//                   )}
//                 </div>

//                 {/* Live link */}
//                 <div>
//                   {project.links?.live ? (
//                     <a
//                       href={project.links.live}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
//                     >
//                       <FiExternalLink size={12} />
//                       Visit site
//                     </a>
//                   ) : (
//                     <span className="text-xs text-muted-foreground">—</span>
//                   )}
//                 </div>

//                 {/* Actions: Edit + Archive */}
//                 <div className="flex items-center justify-end gap-1">
//                   {/* GitHub icon link — quick access without opening form */}
//                   {project.links?.github && (
//                     <a
//                       href={project.links.github}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
//                       aria-label="View on GitHub"
//                     >
//                       <FiGithub size={14} />
//                     </a>
//                   )}

//                   {/* Edit */}
//                   <button
//                     type="button"
//                     onClick={() => handleEditClick(project)}
//                     className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
//                     aria-label={`Edit ${project.title}`}
//                   >
//                     <FiEdit2 size={14} />
//                   </button>

//                   {/* Archive */}
//                   <button
//                     type="button"
//                     onClick={() => handleArchive(project)}
//                     disabled={archivingId === project._id}
//                     className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
//                     aria-label={`Archive ${project.title}`}
//                   >
//                     {archivingId === project._id ? (
//                       <FiRefreshCw size={14} className="animate-spin" />
//                     ) : (
//                       <FiArchive size={14} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Create / Edit dialog ─────────────────────────────────────────── */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="font-heading text-lg">
//               {editingProject ? "Edit Project" : "Add New Project"}
//             </DialogTitle>
//           </DialogHeader>

//           {/*
//             Key prop forces a full remount when switching between create/edit mode
//             — this resets all form state without extra useEffect logic
//           */}
//           <ProjectForm
//             key={editingProject?._id ?? "new"}
//             project={editingProject}
//             onSuccess={handleFormSuccess}
//             onCancel={() => setDialogOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import ProjectForm from "@/components/admin/ProjectForm";
import PublishButton from "@/components/admin/PublishButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  FiArchive,
  FiCheck,
  FiEdit2,
  FiExternalLink,
  FiFolder,
  FiGithub,
  FiMinus,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
import useSWR from "swr";

// ---------------------------------------------------------------------------
// SWR fetcher — standard JSON fetch, throws on non-ok responses
// ---------------------------------------------------------------------------
async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load projects");
  const json = await res.json();
  return json.data; // our API always returns { success, message, data }
}

// ---------------------------------------------------------------------------
// Category badge colours — matches the public Projects section palette
// ---------------------------------------------------------------------------
const CATEGORY_STYLES = {
  SaaS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  AI: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Analytics:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  DevOps:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Marketplace:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
};

// Status badge — live = green, development = amber, archived = muted
const STATUS_STYLES = {
  live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  development:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  archived: "bg-muted text-muted-foreground",
};

const STATUS_LABELS = {
  live: "Live",
  development: "In Dev",
  archived: "Archived",
};

// ---------------------------------------------------------------------------
// Loading skeleton — shown while SWR is fetching
// ---------------------------------------------------------------------------
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border border-border rounded-lg"
        >
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-16 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state — shown when there are no projects yet
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 py-16 text-center border-dashed">
      <div className="rounded-full bg-muted p-4">
        <FiFolder size={32} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-base font-medium text-foreground">No projects yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first project to get started.
        </p>
      </div>
      <Button
        onClick={onAdd}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
      >
        <FiPlus size={14} className="mr-2" />
        Add Your First Project
      </Button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function AdminProjectsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = create mode
  const [showPublish, setShowPublish] = useState(false);
  const [archivingId, setArchivingId] = useState(null); // tracks which row is loading

  // SWR — fetches /api/projects and caches it
  const { data, isLoading, error, mutate } = useSWR("/api/projects", fetcher);
  const projects = data || [];

  // -------------------------------------------------------------------------
  // Open dialog for creating a new project
  // -------------------------------------------------------------------------
  function handleAddClick() {
    setEditingProject(null);
    setDialogOpen(true);
  }

  // -------------------------------------------------------------------------
  // Open dialog pre-filled with the selected project for editing
  // -------------------------------------------------------------------------
  function handleEditClick(project) {
    setEditingProject(project);
    setDialogOpen(true);
  }

  // -------------------------------------------------------------------------
  // Archive (DELETE) a project after confirmation
  // -------------------------------------------------------------------------
  async function handleArchive(project) {
    // Simple native confirm — avoids adding another modal layer
    const confirmed = window.confirm(
      `Archive "${project.title}"? It will be hidden from the portfolio.`,
    );
    if (!confirmed) return;

    setArchivingId(project._id);

    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.message || "Failed to archive project. Try again.");
        return;
      }

      // Optimistic update — remove from local SWR cache immediately
      await mutate((current) => current.filter((p) => p._id !== project._id), {
        revalidate: false,
      });

      // Show the Publish button so user knows to push changes live
      setShowPublish(true);
    } catch (err) {
      alert("Network error. Check your connection and try again.");
    } finally {
      setArchivingId(null);
    }
  }

  // -------------------------------------------------------------------------
  // Called by ProjectForm on success — refresh list, show Publish button
  // -------------------------------------------------------------------------
  function handleFormSuccess() {
    setDialogOpen(false);
    mutate(); // re-fetch from server to get latest data including new _id
    setShowPublish(true);
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}

      {/* ── Action bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: project count */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading…"
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Right: Publish button (conditional) + Add button */}
        <div className="flex items-center gap-3 flex-wrap">
          {showPublish && (
            <div className="flex items-center gap-3">
              {/* Inform the user why this button appeared */}
              <span className="text-xs text-muted-foreground">
                Changes saved — click Publish to go live
              </span>
              <PublishButton
                paths={["/"]}
                onBeforePublish={() => {
                  // Nothing to do — data is already saved to DB
                  // PublishButton will call /api/revalidate to trigger ISR
                }}
                onSuccess={() => setShowPublish(false)}
              />
            </div>
          )}

          <Button
            onClick={handleAddClick}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          >
            <FiPlus size={14} className="mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* ── Content area ────────────────────────────────────────────────── */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        // Error state — let user retry
        <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-sm text-destructive">
            Failed to load projects. Check your connection.
          </p>
          <Button variant="outline" size="sm" onClick={() => mutate()}>
            <FiRefreshCw size={13} className="mr-2" />
            Retry
          </Button>
        </Card>
      ) : projects.length === 0 ? (
        <EmptyState onAdd={handleAddClick} />
      ) : (
        // ── Projects table ───────────────────────────────────────────────
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_80px_120px_100px] gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span className="text-center">Featured</span>
            <span>Live</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border">
            {projects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-[2fr_1fr_1fr_80px_120px_100px] gap-4 px-4 py-3.5 items-center hover:bg-muted/30 transition-colors"
              >
                {/* Title */}
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate font-heading">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {project.tagline}
                  </p>
                </div>

                {/* Category badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                    CATEGORY_STYLES[project.category] ||
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {project.category}
                </span>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                    STATUS_STYLES[project.status] ||
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {STATUS_LABELS[project.status] || project.status}
                </span>

                {/* Featured checkmark */}
                <div className="flex justify-center">
                  {project.featured ? (
                    <FiCheck
                      size={15}
                      className="text-emerald-600 dark:text-emerald-400"
                      aria-label="Featured"
                    />
                  ) : (
                    <FiMinus
                      size={15}
                      className="text-muted-foreground"
                      aria-label="Not featured"
                    />
                  )}
                </div>

                {/* Live link */}
                <div>
                  {project.links?.live ? (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                    >
                      <FiExternalLink size={12} />
                      Visit site
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>

                {/* Actions: Edit + Archive */}
                <div className="flex items-center justify-end gap-1">
                  {/* GitHub icon link — quick access without opening form */}
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="View on GitHub"
                    >
                      <FiGithub size={14} />
                    </a>
                  )}

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleEditClick(project)}
                    className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label={`Edit ${project.title}`}
                  >
                    <FiEdit2 size={14} />
                  </button>

                  {/* Archive */}
                  <button
                    type="button"
                    onClick={() => handleArchive(project)}
                    disabled={archivingId === project._id}
                    className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                    aria-label={`Archive ${project.title}`}
                  >
                    {archivingId === project._id ? (
                      <FiRefreshCw size={14} className="animate-spin" />
                    ) : (
                      <FiArchive size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create / Edit dialog ─────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* aria-describedby={undefined} tells shadcn we intentionally have no description */}
        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          {/* 
            Key prop forces a full remount when switching between create/edit mode
            — this resets all form state without extra useEffect logic
          */}
          <ProjectForm
            key={editingProject?._id ?? "new"}
            project={editingProject}
            onSuccess={handleFormSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
