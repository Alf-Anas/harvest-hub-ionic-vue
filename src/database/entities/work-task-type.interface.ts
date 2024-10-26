export interface WorkTaskTypeInterface {
  WorkTaskTypeId: number;
  WorkTaskTypeCode: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  IsDeleted?: boolean;
}

export type WorkTaskTypeIData = Omit<WorkTaskTypeInterface, "WorkTaskTypeId">;
