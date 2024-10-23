import { IDBPDatabase } from "idb";
import { UserIData, UserInterface } from "../entities/user.interface";
import { getDB, TABLE_NAME } from "../database";

const LIST_USER = [
  {
    username: "user001",
    name: "User 001",
    email: "user001@harvesthub.com",
    password: "abcd1234",
  },
  {
    username: "user002",
    name: "User 002",
    email: "user002@harvesthub.com",
    password: "password",
  },
  {
    username: "user003",
    name: "User 003",
    email: "user003@harvesthub.com",
    password: "12345678",
  },
];

export async function seedUsers(db: IDBPDatabase<unknown>) {
  const users = await db.getAll(TABLE_NAME.Users);
  if (users.length !== 0) return;
  for (const user of LIST_USER) {
    const hashedPassword = btoa(user.password);
    const newUser: UserIData = {
      IsCustomerUser: true,
      Username: user.username,
      UserPassword: hashedPassword,
      UserGivenName: user.name,
      UserEmailAddress: user.email,
      CreatedDate: new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
      UserStatus: "Active",
      IsDeleted: false,
    };
    await db.put(TABLE_NAME.Users, newUser);
  }
}

export async function getUserByEmailAndPassword(
  email: string,
  password: string
) {
  const hashedPassword = btoa(password);
  const db = await getDB();
  const listUser = await db.getAll(TABLE_NAME.Users);
  const findUser = listUser.find(
    (user: UserInterface) =>
      user.UserEmailAddress === email && user.UserPassword === hashedPassword
  );
  return findUser;
}

export async function getUserByEmailAndHash(
  email: string,
  hashedPassword: string
) {
  const db = await getDB();
  const listUser = await db.getAll(TABLE_NAME.Users);
  const findUser = listUser.find(
    (user: UserInterface) =>
      user.UserEmailAddress === email && user.UserPassword === hashedPassword
  );
  return findUser;
}
