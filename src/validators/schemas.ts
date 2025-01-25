import { body } from 'express-validator';

export const userValidation = [
    body('name').notEmpty().withMessage('Name is required')
];

export const bookValidation = [
    body('name').notEmpty().withMessage('Name is required')
];

export const returnBookValidation = [
    body('score')
        .notEmpty()
        .withMessage('Score is required')
        .isFloat({ min: 0, max: 10 })
        .withMessage('Score must be between 0 and 10')
]; 