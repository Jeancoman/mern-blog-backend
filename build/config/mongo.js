import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { MONGODB_URL } from "./env.js";
mongoose.set("strictQuery", false);
const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
    }
    catch (error) {
        logger.error(error);
    }
};
const mongo = {
    connect,
};
export default mongo;
