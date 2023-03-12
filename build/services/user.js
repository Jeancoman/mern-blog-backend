import User from "../models/user.js";
const createWithPassword = async (userName, password) => {
    const user = await User.create({
        userName,
        password,
    });
    return user;
};
const createWithOAuth2 = async (userName, displayName, profileImageUrl) => {
    const user = await User.create({
        userName,
        displayName,
        profileImageUrl
    });
    return user;
};
const findByUserName = async (userName) => {
    const user = await User.findOne({ userName }).exec();
    return user;
};
const findById = async (id) => {
    const user = await User.findById({ _id: id });
    return user;
};
const UserService = { createWithPassword, createWithOAuth2, findByUserName, findById };
export default UserService;
