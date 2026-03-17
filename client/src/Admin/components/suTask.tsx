// import { useState, useRef, useEffect } from "react";

// /* ─── Types ─────────────────────────────────────────── */
// interface Subtask {
//   id: string;
//   title: string;
//   description: string;
//   priority: "low" | "medium" | "high";
//   completed: boolean;
// }

// interface TaskForm {
//   title: string;
//   description: string;
//   dueDate: string;
//   priority: "low" | "medium" | "high";
//   assignee: string;
// }

// const PRIORITY_META = {
//   low:    { label: "Low",    color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-500/30", dot: "bg-emerald-400" },
//   medium: { label: "Medium", color: "text-amber-400",   bg: "bg-amber-400/10   border-amber-500/30",   dot: "bg-amber-400"   },
//   high:   { label: "High",   color: "text-rose-400",    bg: "bg-rose-400/10    border-rose-500/30",    dot: "bg-rose-400"    },
// };

// /* ─── Sub-component: Subtask Popup ───────────────────── */
// function SubtaskPopup({
//   onAdd,
//   onClose,
// }: {
//   onAdd: (s: Omit<Subtask, "id" | "completed">) => void;
//   onClose: () => void;
// }) {
//   const [form, setForm] = useState({ title: "", description: "", priority: "medium" as Subtask["priority"] });
//   const titleRef = useRef<HTMLInputElement>(null);

//   useEffect(() => { titleRef.current?.focus(); }, []);

//   const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const submit = () => {
//     if (!form.title.trim()) return;
//     onAdd({ title: form.title.trim(), description: form.description.trim(), priority: form.priority });
//     onClose();
//   };

//   return (
//     /* Backdrop */
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       {/* Panel */}
//       <div className="relative w-[440px] max-w-[95vw] bg-[#13151f] border border-[#252a3d] rounded-2xl shadow-2xl shadow-black/70 overflow-hidden">

//         {/* Top accent line */}
//         <div className="h-[3px] bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500" />

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 pt-5 pb-3">
//           <div className="flex items-center gap-2.5">
//             <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/30">
//               <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M8 3v10M3 8h10" />
//               </svg>
//             </span>
//             <h3 className="text-[15px] font-semibold text-white tracking-tight">New Subtask</h3>
//           </div>
//           <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
//             <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//               <path d="M3 3l10 10M13 3L3 13" />
//             </svg>
//           </button>
//         </div>

//         {/* Form body */}
//         <div className="px-6 pb-6 space-y-4">
//           {/* Title */}
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Subtask title *</label>
//             <input
//               ref={titleRef}
//               name="title"
//               value={form.title}
//               onChange={handle}
//               placeholder="e.g. Write unit tests"
//               onKeyDown={(e) => e.key === "Enter" && submit()}
//               className="w-full bg-[#1a1d2e] border border-[#2a2f45] hover:border-[#353b58] focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-slate-600 outline-none transition-all"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Description</label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handle}
//               rows={3}
//               placeholder="Optional details about this subtask…"
//               className="w-full resize-none bg-[#1a1d2e] border border-[#2a2f45] hover:border-[#353b58] focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-slate-600 outline-none transition-all"
//             />
//           </div>

//           {/* Priority */}
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Priority</label>
//             <div className="flex gap-2">
//               {(["low", "medium", "high"] as const).map((p) => (
//                 <button
//                   key={p}
//                   type="button"
//                   onClick={() => setForm((f) => ({ ...f, priority: p }))}
//                   className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[12px] font-semibold transition-all ${
//                     form.priority === p
//                       ? `${PRIORITY_META[p].bg} ${PRIORITY_META[p].color} scale-[1.02]`
//                       : "bg-[#1a1d2e] border-[#2a2f45] text-slate-500 hover:border-[#353b58]"
//                   }`}
//                 >
//                   <span className={`w-1.5 h-1.5 rounded-full ${form.priority === p ? PRIORITY_META[p].dot : "bg-slate-600"}`} />
//                   {PRIORITY_META[p].label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 pt-1">
//             <button
//               onClick={onClose}
//               className="flex-1 py-2.5 rounded-xl border border-[#2a2f45] text-[13px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={submit}
//               disabled={!form.title.trim()}
//               className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-semibold text-white transition-all shadow-lg shadow-violet-900/40"
//             >
//               Add Subtask
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Main Component ─────────────────────────────────── */
// export default function TaskFormWithSubtasks() {
//   const [task, setTask] = useState<TaskForm>({
//     title: "", description: "", dueDate: "", priority: "medium", assignee: "",
//   });
//   const [subtasks, setSubtasks] = useState<Subtask[]>([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const handleTask = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
//     setTask((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const addSubtask = (data: Omit<Subtask, "id" | "completed">) =>
//     setSubtasks((p) => [...p, { ...data, id: crypto.randomUUID(), completed: false }]);

//   const toggleSubtask = (id: string) =>
//     setSubtasks((p) => p.map((s) => s.id === id ? { ...s, completed: !s.completed } : s));

//   const removeSubtask = (id: string) =>
//     setSubtasks((p) => p.filter((s) => s.id !== id));

//   const completedCount = subtasks.filter((s) => s.completed).length;

//   const handleSubmit = () => {
//     if (!task.title.trim()) return;
//     setSubmitted(true);
//     setTimeout(() => setSubmitted(false), 2500);
//   };

//   return (
//     <div className="min-h-screen bg-[#0c0e17] flex items-start justify-center py-12 px-4"
//          style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

//       {showPopup && <SubtaskPopup onAdd={addSubtask} onClose={() => setShowPopup(false)} />}

//       <div className="w-full max-w-[560px]">

//         {/* Page header */}
//         <div className="mb-6">
//           <p className="text-[11px] font-bold tracking-[0.2em] text-violet-500 uppercase mb-1">Task Manager</p>
//           <h1 className="text-2xl font-bold text-white tracking-tight">Create Task</h1>
//           <p className="text-[13px] text-slate-500 mt-1">Fill in the details and add subtasks below.</p>
//         </div>

//         {/* Card */}
//         <div className="bg-[#13151f] border border-[#1f2235] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

//           {/* Card top strip */}
//           <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500" />

//           <div className="p-6 space-y-5">

//             {/* Task Title */}
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Task Title *</label>
//               <input
//                 name="title"
//                 value={task.title}
//                 onChange={handleTask}
//                 placeholder="e.g. Redesign onboarding flow"
//                 className="w-full bg-[#1a1d2e] border border-[#252a3d] hover:border-[#353b58] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-slate-600 outline-none transition-all"
//               />
//             </div>

//             {/* Description */}
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Description</label>
//               <textarea
//                 name="description"
//                 value={task.description}
//                 onChange={handleTask}
//                 rows={3}
//                 placeholder="What needs to be done? Provide context…"
//                 className="w-full resize-none bg-[#1a1d2e] border border-[#252a3d] hover:border-[#353b58] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-slate-600 outline-none transition-all"
//               />
//             </div>

//             {/* Due Date + Assignee */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Due Date</label>
//                 <input
//                   type="date"
//                   name="dueDate"
//                   value={task.dueDate}
//                   onChange={handleTask}
//                   className="w-full bg-[#1a1d2e] border border-[#252a3d] hover:border-[#353b58] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-300 outline-none transition-all [color-scheme:dark]"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Assignee</label>
//                 <input
//                   name="assignee"
//                   value={task.assignee}
//                   onChange={handleTask}
//                   placeholder="@username"
//                   className="w-full bg-[#1a1d2e] border border-[#252a3d] hover:border-[#353b58] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-slate-600 outline-none transition-all"
//                 />
//               </div>
//             </div>

//             {/* Priority */}
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Priority</label>
//               <div className="flex gap-2">
//                 {(["low", "medium", "high"] as const).map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     onClick={() => setTask((f) => ({ ...f, priority: p }))}
//                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[12px] font-semibold transition-all ${
//                       task.priority === p
//                         ? `${PRIORITY_META[p].bg} ${PRIORITY_META[p].color}`
//                         : "bg-[#1a1d2e] border-[#252a3d] text-slate-500 hover:border-[#353b58]"
//                     }`}
//                   >
//                     <span className={`w-1.5 h-1.5 rounded-full ${task.priority === p ? PRIORITY_META[p].dot : "bg-slate-600"}`} />
//                     {PRIORITY_META[p].label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* ── Subtasks Section ── */}
//             <div className="space-y-3 pt-1">
//               {/* Subtask header row */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Subtasks</span>
//                   {subtasks.length > 0 && (
//                     <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
//                       <span className="text-white">{completedCount}</span>
//                       <span className="text-violet-500">/</span>
//                       {subtasks.length}
//                     </span>
//                   )}
//                 </div>

//                 {/* ⬡ Add Subtask Icon Button */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPopup(true)}
//                   title="Add subtask"
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/10 border border-violet-500/30 hover:bg-violet-600/20 hover:border-violet-500/60 text-violet-400 text-[12px] font-semibold transition-all group"
//                 >
//                   <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
//                     <path d="M7 2v10M2 7h10" />
//                   </svg>
//                   Add Subtask
//                 </button>
//               </div>

//               {/* Progress bar */}
//               {subtasks.length > 0 && (
//                 <div className="h-1 bg-[#1a1d2e] rounded-full overflow-hidden">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-violet-600 to-sky-500 transition-all duration-500"
//                     style={{ width: `${subtasks.length ? (completedCount / subtasks.length) * 100 : 0}%` }}
//                   />
//                 </div>
//               )}

//               {/* Subtask List */}
//               {subtasks.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-[#252a3d] text-center">
//                   <svg className="w-8 h-8 text-slate-700 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
//                   </svg>
//                   <p className="text-[13px] text-slate-600">No subtasks yet</p>
//                   <p className="text-[11px] text-slate-700 mt-0.5">Click "Add Subtask" to break this task down</p>
//                 </div>
//               ) : (
//                 <ul className="space-y-2">
//                   {subtasks.map((s) => (
//                     <li
//                       key={s.id}
//                       className="flex items-start gap-3 p-3 rounded-xl bg-[#1a1d2e] border border-[#252a3d] group hover:border-[#353b58] transition-all"
//                     >
//                       {/* Checkbox */}
//                       <button
//                         type="button"
//                         onClick={() => toggleSubtask(s.id)}
//                         className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-[5px] border-2 flex items-center justify-center transition-all ${
//                           s.completed
//                             ? "bg-violet-600 border-violet-600"
//                             : "border-slate-600 hover:border-violet-500"
//                         }`}
//                       >
//                         {s.completed && (
//                           <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                             <path d="M1.5 5l2.5 2.5 4.5-4.5" />
//                           </svg>
//                         )}
//                       </button>

//                       {/* Content */}
//                       <div className="flex-1 min-w-0">
//                         <p className={`text-[13px] font-medium leading-tight transition-all ${s.completed ? "line-through text-slate-600" : "text-slate-200"}`}>
//                           {s.title}
//                         </p>
//                         {s.description && (
//                           <p className={`text-[11px] mt-0.5 leading-snug transition-all ${s.completed ? "text-slate-700 line-through" : "text-slate-500"}`}>
//                             {s.description}
//                           </p>
//                         )}
//                       </div>

//                       {/* Priority badge */}
//                       <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${PRIORITY_META[s.priority].bg} ${PRIORITY_META[s.priority].color}`}>
//                         {PRIORITY_META[s.priority].label}
//                       </span>

//                       {/* Delete */}
//                       <button
//                         type="button"
//                         onClick={() => removeSubtask(s.id)}
//                         className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
//                       >
//                         <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                           <path d="M2 2l8 8M10 2L2 10" />
//                         </svg>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Submit */}
//             <div className="flex gap-3 pt-2">
//               <button
//                 type="button"
//                 className="flex-1 py-3 rounded-xl border border-[#252a3d] text-[13px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
//               >
//                 Save Draft
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={!task.title.trim()}
//                 className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-semibold text-white transition-all shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2"
//               >
//                 {submitted ? (
//                   <>
//                     <svg className="w-4 h-4 text-emerald-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M3 8l3.5 3.5 6.5-7" />
//                     </svg>
//                     Task Created!
//                   </>
//                 ) : (
//                   <>
//                     Create Task
//                     {subtasks.length > 0 && (
//                       <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
//                         +{subtasks.length}
//                       </span>
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>

//           </div>
//         </div>

//         {/* Footer hint */}
//         <p className="text-center text-[11px] text-slate-700 mt-4">
//           Subtasks inherit the parent task's project and sprint.
//         </p>
//       </div>
//     </div>
//   );
// }