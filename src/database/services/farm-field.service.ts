import { getDB, TABLE_NAME } from "../database";
import { FarmFieldInterface } from "../entities/farm-field.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";

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

export async function addFarmField(
  farmField: Omit<FarmFieldInterface, "FarmFieldId">
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
