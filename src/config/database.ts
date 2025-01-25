import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { BorrowedBook } from "../entities/BorrowedBook";
import dotenv from "dotenv";

dotenv.config();

export const LibraryDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Book, BorrowedBook],
    subscribers: [],
    migrations: [],
}); 