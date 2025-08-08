import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import config from "./config/app.config.js";

const PORT = config.PORT;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(() => {
        console.log("Failed to connected to mongoDB");
        process.exit(1);
    });
