import { User } from "../config/database";

const createUser = async (
  accountName: string,
  username: string,
  password: string,
) => {
  try {
    const user = await User.create({
      accountName,
      username,
      password,
    });
    return user;
  } catch {
    return null;
  }
};

const findUserByUsername = async (username: string) => {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    return user;
  } catch {
    return null;
  }
};

const findUserById = async (id: string) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
};

const authenticate = async (username: string, password: string) => {
  const user = await findUserByUsername(username);

  if (user) {
    if (user.password === password) {
      return {
        User: {
          id: user.id,
          accountName: user.accountName,
          username: user.username,
          userType: user.userType
        },
        isValidCredentials: true,
      };
    } else {
      return {
        messages: "Invalid credentials",
        isValidCredentials: false,
      };
    }
  }
  return {
    messages: "Invalid credentials",
    isValidCredentials: false,
  };
};

export { createUser, authenticate, findUserByUsername, findUserById };
