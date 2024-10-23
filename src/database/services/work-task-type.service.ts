import { getDB, TABLE_NAME } from "../database";
import { WorkTaskTypeInterface } from "../entities/work-task-type.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";

export async function getAllWorkTaskTypes(
  includeDeleted = false
): Promise<ResponseInterface<WorkTaskTypeInterface[]>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.WorkTaskTypes, "readonly");
  const store = tx.objectStore(TABLE_NAME.WorkTaskTypes);

  const workTaskTypes = await store.getAll();

  const theData: WorkTaskTypeInterface[] = includeDeleted
    ? workTaskTypes
    : workTaskTypes.filter((site) => !site.IsDeleted);
  return { success: true, message: "OK", data: theData };
}

export async function getWorkTaskTypeById(
  workTaskTypeCode: number
): Promise<ResponseInterface<WorkTaskTypeInterface>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.WorkTaskTypes, "readonly");
  const store = tx.objectStore(TABLE_NAME.WorkTaskTypes);

  const workTaskType: WorkTaskTypeInterface | undefined = await store.get(
    workTaskTypeCode
  );
  if (!workTaskType) {
    return {
      success: false,
      message: "Data Not Found!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: workTaskType,
  };
}

export async function addWorkTaskType(
  workTaskType: Omit<WorkTaskTypeInterface, "WorkTaskTypeCode">
): Promise<ResponseInterface<WorkTaskTypeInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    throw new Error("Please login to add workTaskType!");
  }

  const db = await getDB();

  const newWorkTaskType = {
    ...workTaskType,
    CreatedDate: new Date().toISOString(),
    CreatedUserId: user.UserId,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
    IsDeleted: false,
  };

  const tx = db.transaction(TABLE_NAME.WorkTaskTypes, "readwrite");
  const store = tx.objectStore(TABLE_NAME.WorkTaskTypes);
  const workTaskTypeCode = await store.add(newWorkTaskType);

  await tx.done;

  if (!workTaskTypeCode) {
    return {
      success: false,
      message: "Failed to Add WorkTaskType!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: { ...newWorkTaskType, WorkTaskTypeCode: Number(workTaskTypeCode) },
  };
}

export async function updateWorkTaskType(
  workTaskTypeCode: number,
  updatedData: Partial<WorkTaskTypeInterface>
): Promise<ResponseInterface<WorkTaskTypeInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.WorkTaskTypes, "readwrite");
  const store = tx.objectStore(TABLE_NAME.WorkTaskTypes);

  const existingWorkTaskType = await store.get(workTaskTypeCode);

  if (!existingWorkTaskType) {
    return {
      success: false,
      message: `WorkTaskType with ID ${workTaskTypeCode} not found`,
    };
  }

  const updatedWorkTaskType = {
    ...existingWorkTaskType,
    ...updatedData,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
  };

  await store.put(updatedWorkTaskType);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: updatedWorkTaskType,
  };
}

export async function softDeleteWorkTaskType(
  workTaskTypeCode: number
): Promise<ResponseInterface<number>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.WorkTaskTypes, "readwrite");
  const store = tx.objectStore(TABLE_NAME.WorkTaskTypes);

  const existingWorkTaskType = await store.get(workTaskTypeCode);

  if (!existingWorkTaskType) {
    return {
      success: false,
      message: `WorkTaskType with ID ${workTaskTypeCode} not found`,
    };
  }

  existingWorkTaskType.IsDeleted = true;
  existingWorkTaskType.ModifiedDate = new Date().toISOString();
  existingWorkTaskType.ModifiedUserId = user.UserId;

  await store.put(existingWorkTaskType);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: workTaskTypeCode,
  };
}
