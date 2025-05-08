import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, taskCreateValidation, loginValidaton, categoryCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserControler from './controlers/UserControler.js'; 
import * as TaskControler from './controlers/TaskControler.js';
import * as CategoryControler from './controlers/CategoryControler.js';
import multer from 'multer';
import handleValildationErrors from './utils/handleValildationErrors.js';
import cors from 'cors'
import { put } from "@vercel/blob";


import dotenv from 'dotenv';

dotenv.config();



mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('DB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors()) 
app.use(express.json());


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
    try {
        const { file } = req;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        // Upload the file to Vercel Blob
        const blob = await put(`uploads/${file.originalname}`, file.buffer, {
            access: "public", // Make the file publicly accessible
            contentType: file.mimetype,
        });

        res.json({ url: blob.url });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "File upload failed" });
    }
});


app.post('/auth/login', loginValidaton, handleValildationErrors, UserControler.login);
app.post('/auth/register', registerValidation, handleValildationErrors,  UserControler.register);
app.get('/auth/me', checkAuth, UserControler.getMe);
app.get('/auth/guestLogin', loginValidaton, handleValildationErrors, UserControler.loginGuest);


const test = () =>{
  console.log('test')
}

app.get('/tasks', checkAuth, TaskControler.getAll);
app.get('/tasks/:id', checkAuth, TaskControler.getOne);
app.post('/tasks', checkAuth, taskCreateValidation, handleValildationErrors, TaskControler.create);
app.delete('/tasks/:id', checkAuth, TaskControler.remove);
app.patch('/tasks/:id', checkAuth, taskCreateValidation, handleValildationErrors, TaskControler.update);

app.get('/statistics', checkAuth, TaskControler.getStatistics);

app.post('/category', checkAuth, categoryCreateValidation, handleValildationErrors, CategoryControler.create);
app.delete('/category/:id', checkAuth, CategoryControler.remove);
app.get('/category/:id', checkAuth, CategoryControler.getOne);
app.get('/category', checkAuth, CategoryControler.getAll);
app.patch('/category/:id', checkAuth, categoryCreateValidation, handleValildationErrors, CategoryControler.update);

app.get('/tasks-by-categories', checkAuth, CategoryControler.getTasksByCategories);
app.get('/tasks-by-status', checkAuth, CategoryControler.getTasksByStatusName);
app.get('/tasks-completed', checkAuth, TaskControler.getCompleted);
app.patch('/complete-task/:id', checkAuth, TaskControler.completeTask)



export default app;