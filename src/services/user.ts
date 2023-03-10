import User from "../models/user";

const createWithPassword = async (userName: string, password: string) => {
  const user = await User.create({
    userName,
    password,
  });
  return user;
};

const createWithOAuth2 = async (userName: string, displayName: string, profileImageUrl: string) => {
  const user = await User.create({
    userName,
    displayName,
    profileImageUrl
  });
  return user;
};

const findByUserName = async (userName: string) => {
  const user = await User.findOne({ userName }).exec();
  return user;
};

const findById = async (id: string) => {
  const user = await User.findById({ _id: id });
  return user;
};

const UserService = { createWithPassword, createWithOAuth2, findByUserName, findById };

export default UserService;
