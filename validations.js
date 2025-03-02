import { body } from "express-validator";

export const loginValidaton = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
]

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('firstName').isLength({ min: 4 }),
    body('lastName').isLength({ min: 4 }),
    body('avatarUrl').optional().isURL()
]

export const taskCreateValidation = [
    body('title', 'Enter full title of the task').isLength({ min: 3 }).isString(),
    body('text', 'Enter full text of the task').isLength({ min: 3 }).isString(),
    body('imageUrl', 'Wrong url to image').optional().isString(),
    body('priority', 'Please select a priority').isString(),
    body('status').isString(),
    body('categories', 'Please select a valid category').isArray(),
]

export const categoryCreateValidation = [
    body('name', 'Enter name of the category').isLength({ min: 3 }).isString(),
]