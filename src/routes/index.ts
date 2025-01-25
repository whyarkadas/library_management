import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';
import { BookController } from '../controllers/BookController';
import { validate } from '../middleware/validation';
import { 
    userValidation, 
    bookValidation, 
    borrowBookValidation, 
    returnBookValidation 
} from '../validators/schemas';

const router = Router();

// User routes
router.get('/users', UserController.listUsers as RequestHandler);
router.get('/users/:id', UserController.getUserById as RequestHandler);
router.post('/users', userValidation, validate as RequestHandler, UserController.createUser as RequestHandler);

// Book routes
router.get('/books', BookController.listBooks as RequestHandler);
router.get('/books/:id', BookController.getBookById as RequestHandler);
router.post('/books', bookValidation, validate as RequestHandler, BookController.createBook as RequestHandler);
router.post('/books/:id/borrow', borrowBookValidation, validate as RequestHandler, BookController.borrowBook as RequestHandler);
router.post('/books/:id/return', returnBookValidation, validate as RequestHandler, BookController.returnBook as RequestHandler);

export default router; 