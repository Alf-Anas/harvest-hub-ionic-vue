export interface WorkTaskInterface {
  WorkTaskId: number;
  FarmFieldId: number;
  WorkTaskTypeCode: string;
  WorkTaskStatusCode: "Complete" | "Open" | "Underway" | "Overdue";
  StartedDate: string;
  CancelledDate?: string;
  DueDate: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  IsCompleted?: boolean;
  IsDeleted?: boolean;
  IsStarted?: boolean;
  IsCancelled?: boolean;
}
