export interface FarmSiteInterface {
  FarmSiteId: number;
  FarmSiteName: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  DefaultPrimaryCropId: number;
  IsDeleted?: boolean;
}

export type FarmSiteIData = Omit<FarmSiteInterface, "FarmSiteId">;
