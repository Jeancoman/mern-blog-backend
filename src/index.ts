import app from "./app";
import { PORT } from "./config/env";
import logger from "./utils/logger";

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

export {};
