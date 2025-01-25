import request from 'supertest';
import { app } from '../app';
import { LibraryDataSource } from '../config/database';
import { User } from '../entities/User';
import { Book } from '../entities/Book';
import { BorrowedBook } from '../entities/BorrowedBook';

describe('BookController', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await LibraryDataSource.synchronize(true);
    });

    describe('GET /books', () => {
        it('should return empty array when no books exist', async () => {
            const response = await request(app).get('/books');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return array of books when books exist', async () => {
            const bookRepo = LibraryDataSource.getRepository(Book);
            await bookRepo.save([
                { title: 'Test Book 1', averageRating: 0, isAvailable: true },
                { title: 'Test Book 2', averageRating: 0, isAvailable: true }
            ]);

            const response = await request(app).get('/books');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('name');
        });
    });

    describe('GET /books/:id', () => {
        it('should return 404 when book does not exist', async () => {
            const response = await request(app).get('/books/999');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should return book details when book exists', async () => {
            const bookRepo = LibraryDataSource.getRepository(Book);
            const book = await bookRepo.save({ 
                title: 'Test Book',
                averageRating: 4.5,
                isAvailable: true
            });

            const response = await request(app).get(`/books/${book.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: book.id,
                name: 'Test Book',
                score: 4.5
            });
        });
    });

    describe('POST /books', () => {
        it('should create a new book with valid data', async () => {
            const response = await request(app)
                .post('/books')
                .send({ name: 'New Book' });

            expect(response.status).toBe(201);

            const bookRepo = LibraryDataSource.getRepository(Book);
            const book = await bookRepo.findOne({ where: { title: 'New Book' } });
            expect(book).toBeTruthy();
            expect(book?.title).toBe('New Book');
            expect(book?.isAvailable).toBe(true);
            expect(book?.averageRating).toBe(0);
        });

        it('should return 400 when name is missing', async () => {
            const response = await request(app)
                .post('/books')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /users/:userId/borrow/:bookId', () => {
        it('should allow borrowing an available book through user-centric endpoint', async () => {
            const userRepo = LibraryDataSource.getRepository(User);
            const bookRepo = LibraryDataSource.getRepository(Book);

            const user = await userRepo.save({ name: 'Test User' });
            const book = await bookRepo.save({ 
                title: 'Test Book',
                averageRating: 0,
                isAvailable: true
            });

            const response = await request(app)
                .post(`/users/${user.id}/borrow/${book.id}`);

            expect(response.status).toBe(200);

            const updatedBook = await bookRepo.findOne({ where: { id: book.id } });
            expect(updatedBook?.isAvailable).toBe(false);
        });
    });

    describe('POST /users/:userId/return/:bookId', () => {
        it('should allow returning a borrowed book through user-centric endpoint', async () => {
            const userRepo = LibraryDataSource.getRepository(User);
            const bookRepo = LibraryDataSource.getRepository(Book);
            const borrowedBookRepo = LibraryDataSource.getRepository(BorrowedBook);

            const user = await userRepo.save({ name: 'Test User' });
            const book = await bookRepo.save({ 
                title: 'Test Book',
                averageRating: 0,
                isAvailable: false
            });

            await borrowedBookRepo.save({
                user,
                book,
                borrowedAt: new Date(),
                returnedAt: null
            });

            const response = await request(app)
                .post(`/users/${user.id}/return/${book.id}`)
                .send({ score: 8 });

            expect(response.status).toBe(200);

            const updatedBook = await bookRepo.findOne({ where: { id: book.id } });
            expect(updatedBook?.isAvailable).toBe(true);
            expect(updatedBook?.averageRating).toBe(8);
        });
    });
}); 