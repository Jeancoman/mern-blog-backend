import { User } from "../config/database.js";
const createUser = async (accountName, username, password) => {
    try {
        const user = await User.create({
            accountName,
            username,
            password,
        });
        return user;
    }
    catch {
        return null;
    }
};
const findUserByUsername = async (username) => {
    try {
        const user = await User.findOne({
            where: {
                username,
            },
        });
        return user;
    }
    catch {
        return null;
    }
};
const findUserById = async (id) => {
    try {
        const user = await User.findOne({
            where: {
                id,
            },
        });
        return user;
    }
    catch {
        return null;
    }
};
const authenticate = async (username, password) => {
    const user = await findUserByUsername(username);
    if (user) {
        if (user.password === password) {
            return {
                User: {
                    id: user.id,
                    accountName: user.accountName,
                    username: user.username,
                },
                isValidCredentials: true,
            };
        }
        else {
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
