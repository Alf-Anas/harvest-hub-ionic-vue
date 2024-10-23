export interface UserInterface {
  UserId: number;
  IsCustomerUser?: boolean;
  Username?: string;
  UserPassword?: string;
  UserGivenName: string;
  UserEmailAddress: string;
  CreatedDate: string;
  CreatedUserId?: number;
  ModifiedDate: string;
  ModifiedUserId?: number;
  UserStatus: "Active" | "Inactive";
  IsDeleted?: boolean;
  FarmSiteId?: number;
}

export type UserIData = Omit<UserInterface, "UserId">;
