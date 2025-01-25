import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { BorrowedBook } from "../entities/BorrowedBook";

async function seed() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();

        // Drop and recreate tables
        await AppDataSource.synchronize(true);

        // Create users
        const users = await AppDataSource.getRepository(User).save([
            { name: "Enes Faruk Meniz" },
            { name: "Eray Aslan" },
            { name: "Sefa Eren Şahin" },
            { name: "Kadir Mutlu" }
        ]);

        // Create books
        const books = await AppDataSource.getRepository(Book).save([
            { title: "The Hitchhiker's Guide to the Galaxy", averageRating: 10, isAvailable: true },
            { title: "I, Robot", averageRating: 5, isAvailable: true },
            { title: "Dune", averageRating: 0, isAvailable: true },
            { title: "1984", averageRating: 0, isAvailable: true },
            { title: "Brave New World", averageRating: 0, isAvailable: false }
        ]);

        // Create borrowed books records
        const borrowedBooks = await AppDataSource.getRepository(BorrowedBook).save([
            {
                user: users[0], // Enes Faruk Meniz
                book: books[0], // Hitchhiker's Guide
                borrowedAt: new Date('2019-09-01'),
                returnedAt: new Date('2019-09-15'),
                rating: 10
            },
            {
                user: users[0], // Enes Faruk Meniz
                book: books[1], // I, Robot
                borrowedAt: new Date('2019-09-20'),
                returnedAt: new Date('2019-10-05'),
                rating: 5
            },
            {
                user: users[0], // Enes Faruk Meniz
                book: books[4], // Brave New World
                borrowedAt: new Date('2019-10-10'),
                returnedAt: null,
                rating: null
            }
        ]);

        console.log("Seed completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seed(); 