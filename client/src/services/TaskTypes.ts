export interface Task {
  id: string;
  taskName: string;
  project: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
}