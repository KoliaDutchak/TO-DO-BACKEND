import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import TaskModel from '../Models/Task.js'
import CategoryModel from '../Models/Category.js';


export const create = async (req, res) => {
    try {

  
      

       
        const doc = new TaskModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            priority: req.body.priority,
            status: req.body.status,
            date: req.body.date,
            categories: req.body.categories,
            user: req.userId
        });


        

        const task = await doc.save();

        res.json(task);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not create a task'
        });
    }
};

export const getAll = async (req, res) => {
    try {

        const tasks = await TaskModel.find();
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        const decoded = jwt.verify(token, 'secret123');
        const decodedId = new mongoose.Types.ObjectId(decoded._id);
        const userTasks = tasks.filter(task => task.user.equals(decodedId) && task.status !== 'Completed')



        res.json(userTasks)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not get a tasks'
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const taskId = req.params.id;


        TaskModel.findById({
            _id: taskId
        })
            .then(task => {
                if (!task) {
                    return res.status(404).json({
                        message: 'Task not found'
                    })
                }
                return res.json(task)
            })
            .catch(err => {
                console.error('Error finding task:', err);
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not get a task'
        });
    }
};

export const remove = async (req, res) => {
    try {

        const taskId = req.params.id;

        const doc = await TaskModel.findOneAndDelete({
            _id: taskId
        });

        if (!doc) {
            return res.status(404).json({
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not delete a task'
        })
    }
};

export const update = async (req, res) => {
    try {

        const taskId = req.params.id;

        await TaskModel.updateOne({
            _id: taskId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            priority: req.body.priority,
            status: req.body.status,
            categories: req.body.categories,
            user: req.userId
        });

        res.json({
            success: true
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not update a task'
        })
    }
};

export const getStatistics = async (req, res) => {
    try {

        const userId = req.userId.toString();
        const tasks = (await TaskModel.find()).sort(task => task.user.toString() === userId);
        const amountOfTasks = tasks.length;

        const notStarted = tasks.filter(task =>
            ['not started', 'Not Started', 'Not started', 'not Started'].includes(task.status)
        );
        const inProgress = tasks.filter(task =>
            ['in progress', 'In Progress', 'In progress', 'in Progress'].includes(task.status)
        );
        const completed = tasks.filter(task =>
            ['Completed', 'completed'].includes(task.status)
        );

        const notStartedPercentage = Math.round((notStarted.length / amountOfTasks) * 100);
        const inProgressPercentage = Math.round((inProgress.length / amountOfTasks) * 100);
        const completedPercentage = Math.round((completed.length / amountOfTasks) * 100);
        

        res.json({
            'notStarted': notStartedPercentage,
            'inProgress': inProgressPercentage,
            'completed': completedPercentage
        });

    } catch (err) {
        res.status(500).json({
            message: 'Can not get a statistics'
        })
    }
};

export const getCompleted = async (req, res) => {

    try{
        const tasks = await TaskModel.find({ status: 'Completed' });

        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        const decoded = jwt.verify(token, 'secret123');
        const decodedId = new mongoose.Types.ObjectId(decoded._id);
        const completedTasks = tasks.filter(task => task.user.equals(decodedId) && task.status === 'Completed')


        res.json(completedTasks);

        
    } catch(err) {
        res.status(500).json({
            message: 'Can not get completed tasks'
        })
    }

}   

export const completeTask = async (req, res) => {

    try{        

        const taskId = req.params.id;

        const doc = await TaskModel.updateOne({
            _id: taskId,
        }, {
            status: 'Completed'
        });

        res.json(doc, id)

        

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not update a task'
        }) 
    }

}