import { Preferences } from "@capacitor/preferences";

const TOKEN_KEY = "token";

type UserType = {
  id: string;
  email: string;
  password: string;
};
const LIST_USER: UserType[] = [
  {
    id: "user001",
    email: "user001@harvesthub.com",
    password: "abcd1234",
  },
  {
    id: "user002",
    email: "user002@harvesthub.com",
    password: "password",
  },
  {
    id: "user003",
    email: "user003@harvesthub.com",
    password: "12345678",
  },
];

function checkIfUserExist(email: string, password: string) {
  const findUser = LIST_USER.find(
    (user) => user.email === email && user.password === password
  );
  return findUser;
}

export async function login(email: string, password: string) {
  if (!email || !password) {
    return {
      status: false,
      message: "Please enter a valid email address and password!",
    };
  }
  const user = checkIfUserExist(email, password);
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
    const user: UserType = JSON.parse(decodedToken);

    const isUserValid = checkIfUserExist(user.email, user.password);
    if (!isUserValid) {
      return { status: false, message: "Token invalid!" };
    }

    return { status: true, message: "Login Valid", user };
  } else {
    return { status: false, message: "Token not found!" };
  }
}
