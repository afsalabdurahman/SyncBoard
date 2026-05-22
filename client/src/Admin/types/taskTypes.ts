export interface Task {
  id: string;
  taskName: string;
  project: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
}
export interface taskResponse{
  list : Task[],
  totalPages:number|string,
currentPage:number|string,
totalItems:number|string
}
export interface PaginationState {
  page: number;
  rowPerpage: number;
  totalItems: number;
  totalPages: number;
}
