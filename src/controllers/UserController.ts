import { Request, Response } from 'express';
import { LibraryDataSource } from '../config/database';
import { User } from '../entities/User';
import { BorrowedBook } from '../entities/BorrowedBook';
import { IsNull, Not } from 'typeorm';

const userRepository = LibraryDataSource.getRepository(User);
const borrowedBookRepository = LibraryDataSource.getRepository(BorrowedBook);

export class UserController {
    static async listUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userRepository.find({
                select: ['id', 'name'],
                order: { name: 'ASC' }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = await userRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ['borrowedBooks', 'borrowedBooks.book']
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Format the response according to the Postman collection
            const pastBooks = user.borrowedBooks
                .filter(bb => bb.returnedAt !== null)
                .map(bb => ({
                    name: bb.book.title,
                    userScore: bb.rating
                }));

            const presentBooks = user.borrowedBooks
                .filter(bb => bb.returnedAt === null)
                .map(bb => ({
                    name: bb.book.title
                }));

            const response = {
                id: user.id,
                name: user.name,
                books: {
                    past: pastBooks,
                    present: presentBooks
                }
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user' });
        }
    }

    static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const user = userRepository.create({ name });
            await userRepository.save(user);
            res.status(201).send();
        } catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    }
} 