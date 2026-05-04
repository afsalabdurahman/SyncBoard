import { Trash } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteSubTaskRedux } from "../../Redux/feature/task/taskSlice";
import { deleteSubTaskApi } from "../apis/taskApi";

/* ---------------- TYPES ---------------- */

interface AcceptanceCriteria {
  id: string;
  title: string;
  status: "Pending" | "Completed";
}

interface CriteriaSectionProps {
  setCriteria: React.Dispatch<
    React.SetStateAction<AcceptanceCriteria[]>
  >;
  criteria?: AcceptanceCriteria[];
  taskId: string;
}

/* ---------------- POPUP ---------------- */

function AcceptancePopup({
  onAdd,
  onClose,
}: {
  onAdd: (
    data: Omit<AcceptanceCriteria, "id">
  ) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const submit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      status: "Pending",
    });

    setTitle("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="w-[400px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border">

        {/* Top Accent */}
        <div className="h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" />

        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            Add Acceptance Criteria
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Criteria Name
            </label>

            <input
              ref={titleRef}
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && submit()
              }
              placeholder="Example: UI should be responsive"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={!title.trim()}
              className="flex-1 py-2 bg-violet-600 text-white rounded-lg disabled:opacity-40"
            >
              Add Criteria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN SECTION ---------------- */

export const CriteriaSection = ({
  setCriteria,
  criteria = [],
  taskId,
}: CriteriaSectionProps) => {
  const [acceptanceList, setAcceptanceList] =
    useState<AcceptanceCriteria[]>(criteria);
  const [showPopup, setShowPopup] =
    useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setCriteria(acceptanceList);
  }, [acceptanceList, setCriteria]);

  /* Add */
  const addCriteria = (
    data: Omit<AcceptanceCriteria, "id">
  ) => {
    const newItem = {
      ...data,
      id: Date.now().toString(),
    };

    setAcceptanceList((prev) => [
      ...prev,
      newItem,
    ]);
  };

  /* Delete */
  const deleteCriteria = async (
    id: string,
    title: string
  ) => {
    try {
      await deleteSubTaskApi(taskId, title);

      setAcceptanceList((prev) =>
        prev.filter((item) => item.id !== id)
      );

      dispatch(deleteSubTaskRedux(title));

      toast.success(
        "Criteria deleted successfully"
      );
    } catch {
      toast.error("Deletion failed");
    }
  };

  return (
    <>
      {/* Popup */}
      {showPopup && (
        <AcceptancePopup
          onAdd={addCriteria}
          onClose={() =>
            setShowPopup(false)
          }
        />
      )}

      <div className="space-y-3">
        {/* Count */}
        {acceptanceList.length > 0 && (
          <p className="text-xs text-gray-400">
            {acceptanceList.length} criteria added
          </p>
        )}

        {/* List */}
        {acceptanceList.length > 0 && (
          <ul className="space-y-2">
            {acceptanceList.map((item) => (
              <li  style={{ width: "23em" }}
                key={item.id}
                className="flex items-center justify-between px-3 py-3 rounded-lg border bg-gray-50 "
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.status}
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteCriteria(
                      item.id,
                      item.title
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={() =>
            setShowPopup(true)
          }
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-violet-300 text-violet-600 hover:bg-violet-50"
        >
          + Add Acceptance Criteria
        </button>
      </div>
    </>
  );
};