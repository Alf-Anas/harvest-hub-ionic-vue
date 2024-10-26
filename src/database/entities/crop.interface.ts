export interface CropInterface {
  CropId: number;
  CropCode: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  IsDeleted?: boolean;
}

export type CropIData = Omit<CropInterface, "CropId">;
