import mongoose from 'mongoose';
import CategoryModel from '../Models/Category.js';
import TaskModel from '../Models/Task.js'

export const create = async (req, res) => {
    try{

        const categoryName = req.body.name;

        const categoryExist = await CategoryModel.findOne({ name: categoryName })

        if(!categoryExist) {
            const doc = new CategoryModel({
                name: categoryName,
                user: req.userId
            })

            const category = await doc.save();
            console.log(category);
            

            res.json(category);
        } else{
            res.status(409).json({
                message: 'Already exist'
            })
        }

    } catch(err){
        console.log(err);
        res.status(500).json('Can not create a category')
    }
};

export const remove = async (req, res) => {
    try{

        const categoryId = req.params.id;

        const category = await CategoryModel.findById(categoryId);

        if(!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        };


        if(category.user.toString() !== req.userId){
            return res.status(403).json({
                message: 'No access'
            });
        };

        await CategoryModel.findOneAndDelete({ _id: categoryId })


        res.status(200).json({
            success: true
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not delete a category'
        });
    };
};

export const getOne = async (req, res) => {
    try{

        const categoryId = req.params.id;

        if(!categoryId){
            return res.json({
                message: 'No access'
            })
        }

        const category = await CategoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Check if the user has access to this category
        if (category.user.toString() !== req.userId) {
            return res.status(403).json({
                message: 'No access to this category'
            });
        }

        // Find tasks that belong to this category
        const tasksByCategory = await TaskModel.find({ category: categoryId });

        if(!tasksByCategory){
            return res.json({
                category: category,
                tasks: null
            })
        }  

        res.json({
            category: category,
            tasks: tasksByCategory
        });

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Can not get a category'
        });
    }
};

export const  getAll = async (req, res) => {
    try{

        if(!req.userId){
            return res.json({
                message: 'No acess, please login'
            })
        }

        const userId = req.userId.toString();
        const categories = await CategoryModel.find({ user: userId });


        res.json(categories);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not get a categories'
        })
        
    }
};

export const update = async (req, res) => {
    try{

        const categoryId = req.params.id;
        const userId = req.userId.toString();

        const category = await CategoryModel.findById(categoryId)

            
        if(category.user.toString() === userId){
            const doc = await CategoryModel.updateOne({
                _id: categoryId
            }, {
                name: req.body.name,
            });

            res.json({
                message: true
            });
        } else{
            res.status(403).json({
                messagee: 'No access'
            })
        }

        

       

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Can not update a category'
        })
        
    }
};



export const getTasksByCategories = async (req, res) => {
    try{

        // const categoryNameId = req.params.id;
        const userId = req.userId

        const categories = await CategoryModel.find({user: userId})
        console.log(categories);
        

        const tasksByCategories = []
        
        for(let i = 0; i < categories.length; i++){
            const isDuplicate = tasksByCategories.some((item) => item.category === categories[i].name);
            if(isDuplicate){
                continue;
            }

            const tasks = await TaskModel.find({user: userId, categories: categories[i]})

            tasksByCategories.push({
                category: categories[i].name,
                categoryId: categories[i]._id,
                tasks
            });

        }
        
        res.json(tasksByCategories)

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Can not get a tasks'
        })
    }
};

export const getTasksByStatusName = async (req, res) => {
    try{
        // const status = req.params.status;
        const userId = req.userId;

        const status = ['Not Started', 'In Progress', 'Completed']
        const tasksByStatus = []

        for(let i = 0; i < status.length; i++){

            const tasks = await TaskModel.find({user: userId, status: status[i]})

            tasksByStatus.push({
                status: status[i],
                tasks
            });

        }


        res.json(tasksByStatus);

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Can not get tasks'
        })
        
    }
}

