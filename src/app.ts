import express from "express";
import { LibraryDataSource } from "./config/database";
import dotenv from "dotenv";
import "reflect-metadata";
import routes from "./routes";

// Load environment variables
dotenv.config();

// Create Express app
export const app = express();

// Middleware
app.use(express.json());

// Initialize TypeORM only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    LibraryDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!");
        })
        .catch((err) => {
            console.error("Error during Data Source initialization:", err);
        });
}

// Routes - removing the /api prefix to match Postman collection
app.use('/', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} 