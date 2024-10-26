import { getDB, TABLE_NAME } from "../database";
import {
  WorkTaskTypeIData,
  WorkTaskTypeInterface,
} from "../entities/work-task-type.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";
import { IDBPDatabase } from "idb";

const LIST_WORK_TASK_TYPE = [
  {
    name: "Cultivate",
  },
  {
    name: "Fertilize",
  },
  {
    name: "Spray",
  },
  {
    name: "Irrigate",
  },
  {
    name: "Plant",
  },
  {
    name: "Harvest",
  },
];

export async function seedWorkTaskTypes(db: IDBPDatabase<unknown>) {
  const workTaskTypes = await db.getAll(TABLE_NAME.WorkTaskTypes);
  if (workTaskTypes.length !== 0) return;
  for (const workTaskType of LIST_WORK_TASK_TYPE) {
    const newWorkTaskType: WorkTaskTypeIData = {
      WorkTaskTypeCode: workTaskType.name,
      CreatedDate: new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
      IsDeleted: false,
    };
    await db.put(TABLE_NAME.WorkTaskTypes, newWorkTaskType);
  }
}

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
  workTaskTypeId: number
): Promise<ResponseInterface<WorkTaskTypeInterface>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.WorkTaskTypes, "readonly");
  const store = tx.objectStore(TABLE_NAME.WorkTaskTypes);

  const workTaskType: WorkTaskTypeInterface | undefined = await store.get(
    workTaskTypeId
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
  workTaskType: Omit<WorkTaskTypeInterface, "WorkTaskTypeId">
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
  const workTaskTypeId = await store.add(newWorkTaskType);

  await tx.done;

  if (!workTaskTypeId) {
    return {
      success: false,
      message: "Failed to Add WorkTaskType!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: { ...newWorkTaskType, WorkTaskTypeId: Number(workTaskTypeId) },
  };
}

export async function updateWorkTaskType(
  workTaskTypeId: number,
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

  const existingWorkTaskType = await store.get(workTaskTypeId);

  if (!existingWorkTaskType) {
    return {
      success: false,
      message: `WorkTaskType with ID ${workTaskTypeId} not found`,
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
  workTaskTypeId: number
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

  const existingWorkTaskType = await store.get(workTaskTypeId);

  if (!existingWorkTaskType) {
    return {
      success: false,
      message: `WorkTaskType with ID ${workTaskTypeId} not found`,
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
    data: workTaskTypeId,
  };
}
