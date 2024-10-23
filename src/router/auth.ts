import { UserInterface } from "@/database/entities/user.interface";
import {
  getUserByEmailAndHash,
  getUserByEmailAndPassword,
} from "@/database/services/user.service";
import { Preferences } from "@capacitor/preferences";

const TOKEN_KEY = "token";

export async function login(email: string, password: string) {
  if (!email || !password) {
    return {
      status: false,
      message: "Please enter a valid email address and password!",
    };
  }
  const user = await getUserByEmailAndPassword(email, password);
  if (!user) {
    return { status: false, message: "User Doesn't Exist!" };
  }

  const encodeUser = btoa(JSON.stringify(user));

  await Preferences.set({
    key: TOKEN_KEY,
    value: encodeUser,
  });

  return { status: true, message: "Logged in succeded!" };
}

export async function logout() {
  await Preferences.remove({
    key: TOKEN_KEY,
  });

  return { status: true, message: "Logout in succeded!" };
}

export async function checkLoginState() {
  const { value: storedToken } = await Preferences.get({ key: TOKEN_KEY });

  if (storedToken) {
    // Decode the stored token using atob
    const decodedToken = atob(storedToken);
    const user: UserInterface = JSON.parse(decodedToken);

    const isUserValid = await getUserByEmailAndHash(
      user.UserEmailAddress,
      user.UserPassword || ""
    );

    if (!isUserValid) {
      return { status: false, message: "Token invalid!" };
    }

    return { status: true, message: "Login Valid", user };
  } else {
    return { status: false, message: "Token not found!" };
  }
}

export async function getUserFromToken() {
  const { value: storedToken } = await Preferences.get({ key: TOKEN_KEY });

  if (storedToken) {
    const decodedToken = atob(storedToken);
    const user: UserInterface = JSON.parse(decodedToken);

    return user;
  } else {
    return undefined;
  }
}
