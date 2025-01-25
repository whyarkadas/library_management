import request from 'supertest';
import { app } from '../app';
import { LibraryDataSource } from '../config/database';
import { User } from '../entities/User';
import { Book } from '../entities/Book';
import { BorrowedBook } from '../entities/BorrowedBook';

describe('UserController', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await LibraryDataSource.synchronize(true);
    });

    describe('GET /users', () => {
        it('should return empty array when no users exist', async () => {
            const response = await request(app).get('/users');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return array of users when users exist', async () => {
            const userRepo = LibraryDataSource.getRepository(User);
            await userRepo.save([
                { name: 'Test User 1' },
                { name: 'Test User 2' }
            ]);

            const response = await request(app).get('/users');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('name');
        });
    });

    describe('GET /users/:id', () => {
        it('should return 404 when user does not exist', async () => {
            const response = await request(app).get('/users/999');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should return user with empty book lists when user has no books', async () => {
            const userRepo = LibraryDataSource.getRepository(User);
            const user = await userRepo.save({ name: 'Test User' });

            const response = await request(app).get(`/users/${user.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: user.id,
                name: 'Test User',
                books: {
                    past: [],
                    present: []
                }
            });
        });

        it('should return user with borrowed books', async () => {
            const userRepo = LibraryDataSource.getRepository(User);
            const bookRepo = LibraryDataSource.getRepository(Book);
            const borrowedBookRepo = LibraryDataSource.getRepository(BorrowedBook);

            const user = await userRepo.save({ name: 'Test User' });
            const book1 = await bookRepo.save({ 
                title: 'Test Book 1',
                averageRating: 0,
                isAvailable: false
            });
            const book2 = await bookRepo.save({ 
                title: 'Test Book 2',
                averageRating: 0,
                isAvailable: true
            });

            await borrowedBookRepo.save({
                user,
                book: book1,
                borrowedAt: new Date(),
                returnedAt: null
            });

            await borrowedBookRepo.save({
                user,
                book: book2,
                borrowedAt: new Date('2023-01-01'),
                returnedAt: new Date('2023-01-15'),
                rating: 5
            });

            const response = await request(app).get(`/users/${user.id}`);
            expect(response.status).toBe(200);
            expect(response.body.books.present).toHaveLength(1);
            expect(response.body.books.past).toHaveLength(1);
            expect(response.body.books.present[0].name).toBe('Test Book 1');
            expect(response.body.books.past[0].name).toBe('Test Book 2');
            expect(response.body.books.past[0].userScore).toBe(5);
        });
    });

    describe('POST /users', () => {
        it('should create a new user with valid data', async () => {
            const response = await request(app)
                .post('/users')
                .send({ name: 'New User' });

            expect(response.status).toBe(201);

            const userRepo = LibraryDataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { name: 'New User' } });
            expect(user).toBeTruthy();
            expect(user?.name).toBe('New User');
        });

        it('should return 400 when name is missing', async () => {
            const response = await request(app)
                .post('/users')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
}); 