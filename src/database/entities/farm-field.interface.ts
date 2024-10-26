import { CropInterface } from "./crop.interface";
import { FarmSiteInterface } from "./farm-site.interface";
import { WorkTaskInterface } from "./work-task.interface";

export interface FarmFieldInterface {
  FarmFieldId: number;
  FarmSiteId: number;
  FarmFieldName: string;
  FarmFieldCode: string;
  Description: string;
  RowWidth: number;
  FarmFieldRowDirection: string;
  FarmFieldColorHexCode: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  IsDeleted: boolean;
}

export type FarmFieldIData = Omit<FarmFieldInterface, "FarmFieldId">;

export type FarmFieldFullInterface = FarmFieldInterface & {
  farmSite?: FarmSiteInterface;
  crop?: CropInterface;
  tasks?: WorkTaskInterface[];
};

export type FarmFieldAddInterface = Omit<
  FarmFieldInterface,
  | "FarmFieldId"
  | "CreatedDate"
  | "ModifiedDate"
  | "CreatedUserId"
  | "ModifiedUserId"
  | "IsDeleted"
>;
