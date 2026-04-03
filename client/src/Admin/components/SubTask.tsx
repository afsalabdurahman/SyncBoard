import { Trash } from "lucide-react";
import { title } from "process";
import { useState, useRef, useEffect } from "react";
import { deleteSubTaskApi } from "../apis/taskApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteSubTaskRedux } from "../../Redux/feature/task/taskSlice";
import { formatEstimateShort } from "../../Utility/dateformate";
/* ─── Types ─────────────────────────────────────────── */
interface Subtask {
  // id: string;
  title: string;
  estimate: number|null;
  // description: string;
  // priority: "Low" | "Medium" | "High";
  // completed: boolean;
  status: "Pending" | "Completed"
}

// const PRIORITY_META = {
//   Low: { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
//   Medium: { color: "text-amber-600", bg: "bg-amber-50   border-amber-200", dot: "bg-amber-500" },
//   High: { color: "text-rose-600", bg: "bg-rose-50    border-rose-200", dot: "bg-rose-500" },
// };

/* ─── Subtask Popup ──────────────────────────────────── */
function SubtaskPopup({
  onAdd,
  onClose,
}: {
  onAdd: (s: Omit<Subtask, "id" | "completed">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [estimate, setEst] = useState<number>(null)
  // const [description, setDesc] = useState("");
  // const [priority, setPriority] = useState<Subtask["priority"]>("Medium");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), status: "Pending", estimate: estimate });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[400px] max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        {/* accent bar */}
        <div className="h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" />

        {/* header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-100">
              <svg className="w-3.5 h-3.5 text-violet-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M7 2v10M2 7h10" />
              </svg>
            </span>
            <h3 className="text-sm font-semibold text-gray-800">Add Subtask</h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 space-y-3">
          {/* Title */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              task name <span className="text-rose-400">*</span>
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Write unit tests"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/25 focus:border-violet-400 placeholder-gray-300 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Estimate time
            </label>
            <input
              value={estimate}
              onChange={(e) => setEst(Number(e.target.value))}
             type="number"
              placeholder="eg:1"
              className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/25 focus:border-violet-400 placeholder-gray-300 transition-all"
            />
          </div>

          {/* Priority */}
          {/* <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Priority
            </label>
            <div className="flex gap-1.5">
              {(["Low", "Medium", "High"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                    priority === p
                      ? `${PRIORITY_META[p].bg} ${PRIORITY_META[p].color}`
                      : "border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${priority === p ? PRIORITY_META[p].dot : "bg-gray-300"}`} />
                  {p}
                </button>
              ))}
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!title.trim()}
              className="flex-[2] py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition-all"
            >
              Add Subtask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SubtaskSection — drop this inside your form ───── */
export const SubtaskSection = ({ setSubTask, subTask, taskId }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>(subTask || []);
  const [showPopup, setShowPopup] = useState(false);

  const dispacth = useDispatch()
  //  setSubtasks(subTask??[])
  const addSubtask = (data: Omit<Subtask, "id" | "completed">) =>
    setSubtasks((p) => [...p, { ...data }]);
  setSubTask(subtasks)
  // const toggleSubtask = (id: string) =>
  //   setSubtasks((p) => p.map((s) => s.id === id ? { ...s, completed: !s.completed } : s));

  const removeSubtask = (id: string) =>
    setSubtasks((p) => p.filter((s) => s.id !== id));

  const completed = subtasks.filter((s) => s.status).length;
  const deleteSubTask = async (subTask) => {

    try {
      await deleteSubTaskApi(taskId, subTask);
      
      setSubtasks((p) => p.filter((s) => s.title !== subTask));
      dispacth(deleteSubTaskRedux(subTask))
      toast.success("Delete success")
    } catch (error) {
      toast.info("try again later")
    }



  }
  return (
    <>
      {/* Popup */}
      {showPopup && (
        <SubtaskPopup onAdd={addSubtask} onClose={() => setShowPopup(false)} />
      )}

      {/* ── Row: same grid-cols-4 layout as your other fields ── */}
      <div className="">

        {/* Label */}
        <div className="text-right pt-2 space-y-0.5">
          {subtasks.length > 0 && (
            <span className="text-[10px] text-gray-400 block">{subtasks.length} done</span>
          )}
        </div>

        {/* Content */}
        <div className="col-span-3 space-y-2">

          {/* Progress bar */}
          {/* {subtasks.length > 0 && (
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${(completed / subtasks.length) * 100}%` }}
              />
            </div>
          )} */}

          {/* Subtask list */}
          {subtasks.length > 0 && (
            <ul className="space-y-1.5">
              {subtasks.map((s) => (
                <li style={{ width: "25em" }}
                  key={s.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 group hover:border-gray-200 transition-all"
                >
                  {/* Checkbox */}
                  {/* <button
                    type="button"
                    onClick={() => toggleSubtask(s.id)}
                    className={`flex-shrink-0 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all ${s.completed
                        ? "bg-violet-600 border-violet-600"
                        : "border-gray-300 hover:border-violet-400"
                      }`}
                  >
                    {s.completed && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                      </svg>
                    )}
                  </button> */}

                  {/* Title */}
                  <span className={`flex-1 text-[12px] leading-tight transition-all ${s.completed ? "line-through text-gray-300" : "text-gray-700"
                    }`}>
                    {s.title}
                  </span>
                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow-sm">
  {formatEstimateShort(s.estimate ?? 1)}
</span>
                  <span className="text-red-500 hover:text-red-700 cursor-pointer">
                   
                    <Trash size={16} onClick={() => deleteSubTask(s.title)} />
                  </span>

                  {/* Description (if any) */}
                  {s.description && (
                    <span className={`hidden sm:block text-[10px] max-w-[100px] truncate transition-all ${s.completed ? "text-gray-300 line-through" : "text-gray-400"
                      }`}>
                      {s.description}
                    </span>
                  )}

                  {/* Priority */}
                  {/* <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold ${PRIORITY_META[s.priority].color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_META[s.priority].dot}`} />
                    {s.priority}
                  </span> */}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeSubtask(s.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded text-gray-300 hover:text-rose-400 transition-all"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 1l8 8M9 1L1 9" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-violet-300 text-violet-500 hover:bg-violet-50 hover:border-violet-400 text-[12px] font-semibold transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M7 2v10M2 7h10" />
            </svg>
            Add Subtask
          </button>

        </div>
      </div>
    </>
  );
}