import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
export const useTasks = () => useSelector((state:RootState)=>state.task.tasks);
export const usePaginationTask = () => useSelector((state:RootState)=>state.task)