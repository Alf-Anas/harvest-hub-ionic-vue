export interface FarmFieldInterface {
  FarmFieldId: number;
  FarmSiteId: number;
  FarmFieldName: string;
  FarmFieldCode: string;
  RowWidth: number;
  FarmFieldRowDirection: string;
  FarmFieldColorHexCode: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  IsDeleted: boolean;
}
