import { getDB, TABLE_NAME } from "../database";
import { FarmSiteInterface } from "../entities/farm-site.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";

export async function getAllFarmSites(
  includeDeleted = false
): Promise<ResponseInterface<FarmSiteInterface[]>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.FarmSites, "readonly");
  const store = tx.objectStore(TABLE_NAME.FarmSites);

  const farmSites = await store.getAll();

  const theData: FarmSiteInterface[] = includeDeleted
    ? farmSites
    : farmSites.filter((site) => !site.IsDeleted);
  return { success: true, message: "OK", data: theData };
}

export async function getFarmSiteById(
  farmSiteId: number
): Promise<ResponseInterface<FarmSiteInterface>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.FarmSites, "readonly");
  const store = tx.objectStore(TABLE_NAME.FarmSites);

  const farmSite: FarmSiteInterface | undefined = await store.get(farmSiteId);
  if (!farmSite) {
    return {
      success: false,
      message: "Data Not Found!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: farmSite,
  };
}

export async function addFarmSite(
  farmSite: Omit<FarmSiteInterface, "FarmSiteId">
): Promise<ResponseInterface<FarmSiteInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    throw new Error("Please login to add farm site!");
  }

  const db = await getDB();

  const newFarmSite = {
    ...farmSite,
    CreatedDate: new Date().toISOString(),
    CreatedUserId: user.UserId,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
    IsDeleted: false,
  };

  const tx = db.transaction(TABLE_NAME.FarmSites, "readwrite");
  const store = tx.objectStore(TABLE_NAME.FarmSites);
  const farmSiteId = await store.add(newFarmSite);

  await tx.done;

  if (!farmSiteId) {
    return {
      success: false,
      message: "Failed to Add Farm Site!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: { ...newFarmSite, FarmSiteId: Number(farmSiteId) },
  };
}

export async function updateFarmSite(
  farmSiteId: number,
  updatedData: Partial<FarmSiteInterface>
): Promise<ResponseInterface<FarmSiteInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.FarmSites, "readwrite");
  const store = tx.objectStore(TABLE_NAME.FarmSites);

  const existingFarmSite = await store.get(farmSiteId);

  if (!existingFarmSite) {
    return {
      success: false,
      message: `Farm site with ID ${farmSiteId} not found`,
    };
  }

  const updatedFarmSite = {
    ...existingFarmSite,
    ...updatedData,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
  };

  await store.put(updatedFarmSite);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: updatedFarmSite,
  };
}

export async function softDeleteFarmSite(
  farmSiteId: number
): Promise<ResponseInterface<number>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.FarmSites, "readwrite");
  const store = tx.objectStore(TABLE_NAME.FarmSites);

  const existingFarmSite = await store.get(farmSiteId);

  if (!existingFarmSite) {
    return {
      success: false,
      message: `Farm site with ID ${farmSiteId} not found`,
    };
  }

  existingFarmSite.IsDeleted = true;
  existingFarmSite.ModifiedDate = new Date().toISOString();
  existingFarmSite.ModifiedUserId = user.UserId;

  await store.put(existingFarmSite);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: farmSiteId,
  };
}
