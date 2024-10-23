import { getDB, TABLE_NAME } from "../database";
import { WorkTaskInterface } from "../entities/work-task.interface";
import { getUserFromToken } from "@/router/auth";
import { ResponseInterface } from "../entities/response.interface";

export async function getAllWorkTasks(
  includeDeleted = false
): Promise<ResponseInterface<WorkTaskInterface[]>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.WorkTasks, "readonly");
  const store = tx.objectStore(TABLE_NAME.WorkTasks);

  const workTasks = await store.getAll();

  const theData: WorkTaskInterface[] = includeDeleted
    ? workTasks
    : workTasks.filter((site) => !site.IsDeleted);
  return { success: true, message: "OK", data: theData };
}

export async function getWorkTaskById(
  workTaskId: number
): Promise<ResponseInterface<WorkTaskInterface>> {
  const db = await getDB();
  const tx = db.transaction(TABLE_NAME.WorkTasks, "readonly");
  const store = tx.objectStore(TABLE_NAME.WorkTasks);

  const workTask: WorkTaskInterface | undefined = await store.get(workTaskId);
  if (!workTask) {
    return {
      success: false,
      message: "Data Not Found!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: workTask,
  };
}

export async function addWorkTask(
  workTask: Omit<WorkTaskInterface, "WorkTaskId">
): Promise<ResponseInterface<WorkTaskInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    throw new Error("Please login to add workTask!");
  }

  const db = await getDB();

  const newWorkTask = {
    ...workTask,
    CreatedDate: new Date().toISOString(),
    CreatedUserId: user.UserId,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
    IsDeleted: false,
  };

  const tx = db.transaction(TABLE_NAME.WorkTasks, "readwrite");
  const store = tx.objectStore(TABLE_NAME.WorkTasks);
  const workTaskId = await store.add(newWorkTask);

  await tx.done;

  if (!workTaskId) {
    return {
      success: false,
      message: "Failed to Add WorkTask!",
    };
  }
  return {
    success: true,
    message: "OK",
    data: { ...newWorkTask, WorkTaskId: Number(workTaskId) },
  };
}

export async function updateWorkTask(
  workTaskId: number,
  updatedData: Partial<WorkTaskInterface>
): Promise<ResponseInterface<WorkTaskInterface>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.WorkTasks, "readwrite");
  const store = tx.objectStore(TABLE_NAME.WorkTasks);

  const existingWorkTask = await store.get(workTaskId);

  if (!existingWorkTask) {
    return {
      success: false,
      message: `WorkTask with ID ${workTaskId} not found`,
    };
  }

  const updatedWorkTask = {
    ...existingWorkTask,
    ...updatedData,
    ModifiedDate: new Date().toISOString(),
    ModifiedUserId: user.UserId,
  };

  await store.put(updatedWorkTask);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: updatedWorkTask,
  };
}

export async function softDeleteWorkTask(
  workTaskId: number
): Promise<ResponseInterface<number>> {
  const user = await getUserFromToken();
  if (!user?.UserId) {
    return {
      success: false,
      message: "Please logged in to continue!",
    };
  }

  const db = await getDB();

  const tx = db.transaction(TABLE_NAME.WorkTasks, "readwrite");
  const store = tx.objectStore(TABLE_NAME.WorkTasks);

  const existingWorkTask = await store.get(workTaskId);

  if (!existingWorkTask) {
    return {
      success: false,
      message: `WorkTask with ID ${workTaskId} not found`,
    };
  }

  existingWorkTask.IsDeleted = true;
  existingWorkTask.ModifiedDate = new Date().toISOString();
  existingWorkTask.ModifiedUserId = user.UserId;

  await store.put(existingWorkTask);
  await tx.done;

  return {
    success: true,
    message: "OK",
    data: workTaskId,
  };
}
