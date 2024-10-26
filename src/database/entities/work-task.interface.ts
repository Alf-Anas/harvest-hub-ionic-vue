import { CropInterface } from "./crop.interface";
import { FarmFieldInterface } from "./farm-field.interface";
import { FarmSiteInterface } from "./farm-site.interface";

export interface WorkTaskInterface {
  WorkTaskId: number;
  FarmFieldId: number;
  WorkTaskName: string;
  WorkTaskTypeCode: string;
  WorkTaskStatusCode: "Complete" | "Open" | "Underway" | "Overdue";
  Instruction: string;
  Attachment: string;
  StartedDate?: string;
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

export type WorkTaskIData = Omit<WorkTaskInterface, "WorkTaskId">;

export type WorkTaskAddInterface = Omit<
  WorkTaskInterface,
  | "WorkTaskId"
  | "StartedDate"
  | "CancelledDate"
  | "CreatedDate"
  | "ModifiedDate"
  | "CreatedUserId"
  | "ModifiedUserId"
  | "IsCompleted"
  | "IsDeleted"
  | "IsStarted"
  | "IsCancelled"
>;

export type WorkTaskFullInterface = WorkTaskInterface & {
  field?: FarmFieldInterface;
  crop?: CropInterface;
  site?: FarmSiteInterface;
};
