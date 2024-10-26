import { getDB, TABLE_NAME } from "../database";
import { CropIData, CropInterface } from "../entities/crop.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";
import { IDBPDatabase } from "idb";

const LIST_CROP = [
  {
    name: "Sugar Cane",
  },
  {
    name: "Oil Palms",
  },
  {
    name: "SoyBeans",
  },
];

export async function seedCrops(db: IDBPDatabase<unknown>) {
  const crops = await db.getAll(TABLE_NAME.Crops);
  if (crops.length !== 0) return;
  for (const crop of LIST_CROP) {
    const newCrop: CropIData = {
      CropCode: crop.name,
      CreatedDate: new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
      IsDeleted: false,
    };
    await db.put(TABLE_NAME.Crops, newCrop);
  }
}

export async function getAllCrops(
  includeDeleted = false
): Promise<ResponseInterface<CropInterface[]>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.Crops, "readonly");
  const store = tx.objectStore(TABLE_NAME.Crops);

  const crops = await store.getAll();

  const theData: CropInterface[] = includeDeleted
    ? crops
    : crops.filter((site) => !site.IsDeleted);
  return { success: true, message: "OK", data: theData };
}

export async function getCropById(
  cropId: number
): Promise<ResponseInterface<CropInterface>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.Crops, "readonly");
  const store = tx.objectStore(TABLE_NAME.Crops);

  const crop: CropInterface | undefined = await store.get(cropId);
  if (!crop) {
    return {
      success: false,
      message: "Data Not Found!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: crop,
  };
}

export async function addCrop(
  crop: Omit<CropInterface, "CropId">
): Promise<ResponseInterface<CropInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    throw new Error("Please login to add crop!");
  }

  const db = await getDB();

  const newCrop = {
    ...crop,
    CreatedDate: new Date().toISOString(),
    CreatedUserId: user.UserId,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
    IsDeleted: false,
  };

  const tx = db.transaction(TABLE_NAME.Crops, "readwrite");
  const store = tx.objectStore(TABLE_NAME.Crops);
  const cropId = await store.add(newCrop);

  await tx.done;

  if (!cropId) {
    return {
      success: false,
      message: "Failed to Add Crop!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: { ...newCrop, CropId: Number(cropId) },
  };
}

export async function updateCrop(
  cropId: number,
  updatedData: Partial<CropInterface>
): Promise<ResponseInterface<CropInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.Crops, "readwrite");
  const store = tx.objectStore(TABLE_NAME.Crops);

  const existingCrop = await store.get(cropId);

  if (!existingCrop) {
    return {
      success: false,
      message: `Crop with ID ${cropId} not found`,
    };
  }

  const updatedCrop = {
    ...existingCrop,
    ...updatedData,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
  };

  await store.put(updatedCrop);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: updatedCrop,
  };
}

export async function softDeleteCrop(
  cropId: number
): Promise<ResponseInterface<number>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.Crops, "readwrite");
  const store = tx.objectStore(TABLE_NAME.Crops);

  const existingCrop = await store.get(cropId);

  if (!existingCrop) {
    return {
      success: false,
      message: `Crop with ID ${cropId} not found`,
    };
  }

  existingCrop.IsDeleted = true;
  existingCrop.ModifiedDate = new Date().toISOString();
  existingCrop.ModifiedUserId = user.UserId;

  await store.put(existingCrop);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: cropId,
  };
}
