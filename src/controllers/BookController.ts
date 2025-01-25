import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { User } from '../entities/User';
import { BorrowedBook } from '../entities/BorrowedBook';
import { IsNull } from 'typeorm';

const bookRepository = AppDataSource.getRepository(Book);
const userRepository = AppDataSource.getRepository(User);
const borrowedBookRepository = AppDataSource.getRepository(BorrowedBook);

export class BookController {
    static async listBooks(req: Request, res: Response): Promise<void> {
        try {
            const books = await bookRepository.find({
                select: ['id', 'title'],
                order: { title: 'ASC' }
            });

            const response = books.map(book => ({
                id: book.id,
                name: book.title
            }));

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching books' });
        }
    }

    static async getBookById(req: Request, res: Response): Promise<void> {
        try {
            const book = await bookRepository.findOne({
                where: { id: parseInt(req.params.id) }
            });

            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }

            const response = {
                id: book.id,
                name: book.title,
                score: book.averageRating
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching book' });
        }
    }

    static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const book = bookRepository.create({ 
                title: name,
                averageRating: 0,
                isAvailable: true
            });
            await bookRepository.save(book);
            res.status(201).send();
        } catch (error) {
            res.status(500).json({ error: 'Error creating book' });
        }
    }

    static async borrowBook(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const bookId = parseInt(req.params.id);

            const book = await bookRepository.findOne({
                where: { id: bookId }
            });

            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }

            if (!book.isAvailable) {
                res.status(400).json({ error: 'Book is not available' });
                return;
            }

            const user = await userRepository.findOne({
                where: { id: userId }
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const borrowedBook = borrowedBookRepository.create({
                user,
                book,
                borrowedAt: new Date()
            });

            book.isAvailable = false;
            await bookRepository.save(book);
            await borrowedBookRepository.save(borrowedBook);

            res.status(200).send();
        } catch (error) {
            res.status(500).json({ error: 'Error borrowing book' });
        }
    }

    static async returnBook(req: Request, res: Response): Promise<void> {
        try {
            const { score } = req.body;
            const bookId = parseInt(req.params.id);

            const borrowedBook = await borrowedBookRepository.findOne({
                where: { 
                    book: { id: bookId },
                    returnedAt: IsNull()
                },
                relations: ['book']
            });

            if (!borrowedBook) {
                res.status(404).json({ error: 'Borrowed book record not found' });
                return;
            }

            borrowedBook.returnedAt = new Date();
            borrowedBook.rating = score;
            await borrowedBookRepository.save(borrowedBook);

            const book = borrowedBook.book;
            book.isAvailable = true;

            // Update average rating
            const allRatings = await borrowedBookRepository
                .createQueryBuilder('borrowed_book')
                .where('borrowed_book.book.id = :bookId', { bookId })
                .andWhere('borrowed_book.rating IS NOT NULL')
                .getMany();

            const totalRating = allRatings.reduce((sum, record) => sum + (record.rating || 0), 0);
            book.averageRating = totalRating / allRatings.length;

            await bookRepository.save(book);

            res.status(200).send();
        } catch (error) {
            res.status(500).json({ error: 'Error returning book' });
        }
    }
} 