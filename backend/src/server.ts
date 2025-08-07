import path, { dirname } from "path";
import * as url from "url";
import dotenv from "dotenv";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({
    path: path.join(__dirname, "..", "config.env"),
});

import app from "./app.js";
import { connectDB } from "./config/db.config.js";

const PORT = process.env.PORT ?? 3000;
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
