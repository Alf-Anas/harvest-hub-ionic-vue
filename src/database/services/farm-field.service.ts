import { getDB, TABLE_NAME } from "../database";
import {
  FarmFieldAddInterface,
  FarmFieldFullInterface,
  FarmFieldInterface,
} from "../entities/farm-field.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";
import { getCropById } from "./crop.service";
import { getFarmSiteById } from "./farm-site.service";
import { getAllWorkTasksByFieldId } from "./work-task.service";

export async function getAllFarmFields(
  includeDeleted = false
): Promise<ResponseInterface<FarmFieldInterface[]>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.FarmFields, "readonly");
  const store = tx.objectStore(TABLE_NAME.FarmFields);

  const farmFields = await store.getAll();

  const theData: FarmFieldInterface[] = includeDeleted
    ? farmFields
    : farmFields.filter((field) => !field.IsDeleted);
  return { success: true, message: "OK", data: theData };
}

export async function getFarmFieldById(
  farmFieldId: number
): Promise<ResponseInterface<FarmFieldInterface>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.FarmFields, "readonly");
  const store = tx.objectStore(TABLE_NAME.FarmFields);

  const farmField: FarmFieldInterface | undefined = await store.get(
    farmFieldId
  );
  if (!farmField) {
    return {
      success: false,
      message: "Data Not Found!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: farmField,
  };
}

export async function getAllFarmFieldsFull(
  includeDeleted = false
): Promise<ResponseInterface<FarmFieldFullInterface[]>> {
  const getFarmFields = await getAllFarmFields(includeDeleted);
  if (!getFarmFields.success) return getFarmFields;

  const listFarmFields = getFarmFields.data || [];
  const newListFarmFields: FarmFieldFullInterface[] = [];

  for (let i = 0; i < listFarmFields.length; i++) {
    const iFarmField = listFarmFields[i];
    const newFarmField: FarmFieldFullInterface = { ...iFarmField };
    const farmSite = (await getFarmSiteById(iFarmField.FarmSiteId)).data;
    if (farmSite) {
      const crop = (await getCropById(farmSite?.DefaultPrimaryCropId)).data;
      newFarmField.farmSite = farmSite;
      newFarmField.crop = crop;
    }
    const listTask = (await getAllWorkTasksByFieldId(iFarmField.FarmFieldId))
      .data;
    newFarmField.tasks = listTask;
    newListFarmFields.push(newFarmField);
  }

  return { success: true, message: "OK", data: newListFarmFields };
}

export async function addFarmField(
  farmField: FarmFieldAddInterface
): Promise<ResponseInterface<FarmFieldInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    throw new Error("Please login to add farm field!");
  }

  const db = await getDB();

  const newFarmField = {
    ...farmField,
    CreatedDate: new Date().toISOString(),
    CreatedUserId: user.UserId,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
    IsDeleted: false,
  };

  const tx = db.transaction(TABLE_NAME.FarmFields, "readwrite");
  const store = tx.objectStore(TABLE_NAME.FarmFields);
  const farmFieldId = await store.add(newFarmField);

  await tx.done;

  if (!farmFieldId) {
    return {
      success: false,
      message: "Failed to Add Farm Field!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: { ...newFarmField, FarmFieldId: Number(farmFieldId) },
  };
}

export async function updateFarmField(
  farmFieldId: number,
  updatedData: Partial<FarmFieldInterface>
): Promise<ResponseInterface<FarmFieldInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.FarmFields, "readwrite");
  const store = tx.objectStore(TABLE_NAME.FarmFields);

  const existingFarmField = await store.get(farmFieldId);

  if (!existingFarmField) {
    return {
      success: false,
      message: `Farm field with ID ${farmFieldId} not found`,
    };
  }

  const updatedFarmField = {
    ...existingFarmField,
    ...updatedData,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
  };

  await store.put(updatedFarmField);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: updatedFarmField,
  };
}

export async function softDeleteFarmField(
  farmFieldId: number
): Promise<ResponseInterface<number>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.FarmFields, "readwrite");
  const store = tx.objectStore(TABLE_NAME.FarmFields);

  const existingFarmField = await store.get(farmFieldId);

  if (!existingFarmField) {
    return {
      success: false,
      message: `Farm field with ID ${farmFieldId} not found`,
    };
  }

  existingFarmField.IsDeleted = true;
  existingFarmField.ModifiedDate = new Date().toISOString();
  existingFarmField.ModifiedUserId = user.UserId;

  await store.put(existingFarmField);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: farmFieldId,
  };
}
