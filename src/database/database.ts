import { IDBPDatabase, openDB } from "idb";
import { seedUsers } from "./services/user.service";
import { seedCrops } from "./services/crop.service";
import { seedFarmSites } from "./services/farm-site.service";
import { seedWorkTaskTypes } from "./services/work-task-type.service";

const DB_NAME = "HarvestHub.DB";
export const TABLE_NAME = {
  FarmSites: "FarmSites",
  FarmFields: "FarmFields",
  WorkTasks: "WorkTasks",
  WorkTaskTypes: "WorkTaskTypes",
  Crops: "Crops",
  Users: "Users",
};

let dbPromise: IDBPDatabase<unknown>;
export async function initDB() {
  if (!dbPromise) {
    let isNewDatabase = false;
    dbPromise = await openDB(DB_NAME, 1, {
      upgrade(db) {
        isNewDatabase = true;
        if (!db.objectStoreNames.contains(TABLE_NAME.FarmSites)) {
          db.createObjectStore(TABLE_NAME.FarmSites, {
            keyPath: "FarmSiteId",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(TABLE_NAME.FarmFields)) {
          db.createObjectStore(TABLE_NAME.FarmFields, {
            keyPath: "FarmFieldId",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(TABLE_NAME.WorkTasks)) {
          db.createObjectStore(TABLE_NAME.WorkTasks, {
            keyPath: "WorkTaskId",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(TABLE_NAME.WorkTaskTypes)) {
          db.createObjectStore(TABLE_NAME.WorkTaskTypes, {
            keyPath: "WorkTaskTypeId",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(TABLE_NAME.Crops)) {
          db.createObjectStore(TABLE_NAME.Crops, {
            keyPath: "CropId",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(TABLE_NAME.Users)) {
          db.createObjectStore(TABLE_NAME.Users, {
            keyPath: "UserId",
            autoIncrement: true,
          });
        }
      },
    });
    if (isNewDatabase) {
      seedUsers(dbPromise);
      seedCrops(dbPromise);
      seedFarmSites(dbPromise);
      seedWorkTaskTypes(dbPromise);
    }
  }

  return dbPromise;
}

export async function getDB() {
  if (!dbPromise) {
    dbPromise = await initDB();
  }
  return dbPromise;
}
