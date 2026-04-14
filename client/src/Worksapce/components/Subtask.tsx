import { useState, useRef, useEffect } from "react";
import { updateSubTaskStatus } from "../apis/workspaceapis";
import { toast } from "react-toastify";
import {Subtask} from "../types/workspaceTypes"



export const SubtaskButton = ({setOpensub,task}) => {
 
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subTask);
 
  /* ── drag state ── */
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const completed = subtasks.filter((s) => s.status=="Completed").length;
  const total = subtasks.length;
  const allDone = completed === total;

const toggleSubtask = async(title: string) => {

try {

 await updateSubTaskStatus(task.id,title);
 toast.success("Updated")
 setSubtasks((prev) =>
    prev.map((s) =>
      s.title === title
        ? { ...s, status: s.status === "Completed" ? "Pending" : "Completed" }
        : s
    )
  );
} catch  {
  toast.error("Failed to update")
} 
};
  /* drag handle — mouse */
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  /* drag handle — touch */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragging.current = true;
    dragOffset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
  };


// Alternative short version people often prefer:
function formatEstimateShort(minutes?: number): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
  useEffect(() => {
    const move = (clientX: number, clientY: number) => {
      if (!dragging.current || !panelRef.current) return;
      const parent = panelRef.current.offsetParent as HTMLElement;
      if (!parent) return;

      const { width: pW, height: pH } = parent.getBoundingClientRect();
      const panelW = panelRef.current.offsetWidth;
      const panelH = panelRef.current.offsetHeight;

      setPos({
        x: Math.min(Math.max(0, clientX - dragOffset.current.x), pW - panelW),
        y: Math.min(Math.max(0, clientY - dragOffset.current.y), pH - panelH),
      });
    };

    const onMM  = (e: MouseEvent)  => move(e.clientX, e.clientY);
    const onTM  = (e: TouchEvent)  => move(e.touches[0].clientX, e.touches[0].clientY);
    const onEnd = ()               => { dragging.current = false; };

    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup",   onEnd);
    window.addEventListener("touchmove", onTM,  { passive: true });
    window.addEventListener("touchend",  onEnd);
    return () => {
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup",   onEnd);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend",  onEnd);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      style={{ position: "absolute", left: pos.x, top: pos.y }}
      className="w-[300px] bg-[#161926] border border-[#252840] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
    >
      {/* ══ Drag Handle Header ══ */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#252840] bg-[#1a1d2e] cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
        
            <button onClick={()=>setOpensub(null)} className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white">
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 6l12 12M6 18L18 6" />
  </svg>
</button>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Subtasks
          </span>
        
        </div>

        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
          ${allDone ? "bg-emerald-500/15 text-emerald-400" : "bg-indigo-500/15 text-indigo-400"}`}>
          {completed} / {total} done
        </span>
      </div>

      {/* ══ Progress Bar ══ */}
      <div className="h-[3px] bg-[#252840]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-emerald-500" : "bg-indigo-500"}`}
          style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
        />
      </div>

      {/* ══ Subtask List ══ */}
      <ul className="py-2 max-h-60 overflow-y-auto">
        {subtasks.map((task,index) => (
          <li
            key={index}
            onClick={() => toggleSubtask(task.title)}
            className="flex items-center gap-3 px-4 py-2.5 group hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            {/* checkbox */}
            <div className={`shrink-0 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all duration-200
              ${task.status =="Completed" ? "bg-emerald-500 border-emerald-500" : "border-slate-600 group-hover:border-indigo-400"}`}>
              {task.status =="Completed" && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              )}
            </div>

            {/* label */}
           <div className="flex items-baseline justify-between gap-2 group">
  <span 
    className={`text-[13px] leading-snug transition-all duration-200 select-none truncate
      ${task.status === "Completed" 
        ? "line-through text-slate-500" 
        : "text-slate-200 group-hover:text-white"}`}
  >
    {task.title}
  </span>

  {task.estimate && (
    <span 
      // title={`Estimated time: ${formatEstimate(45)}`}
      className={`text-xs font-medium flex-shrink-0 px-1.5 py-0.5 rounded
        ${task.status === "Completed" 
          ? "text-slate-500/60 bg-slate-800/30" 
          : "text-blue-300/90 bg-blue-950/40 group-hover:bg-blue-900/50"}`}
    >
      {formatEstimateShort(task.estimate)}
    </span>
  )}
</div>
            
          </li>
        ))}
      </ul>

      {/* ══ Footer ══ */}
      
        {/* <button
          className="w-full text-[12px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors py-0.5"
          onClick={(e) => {
            e.stopPropagation();
            const label = prompt("New subtask name:");
            if (label?.trim())
              setSubtasks((prev) => [...prev, { id: Date.now(), label: label.trim(), completed: false }]);
          }}
        >
          + Add subtask
        </button> */}
    
    </div>
  );
};