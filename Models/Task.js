import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    createdAt: {
        type: String, // Store date as a string in YYYY-MM-DD format
        required: true,
        default: () => {
          const today = new Date();
          return today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        },
      },
    imageUrl: String
}, {
    // timestamps: true,
},
);

export default mongoose.model('Task', TaskSchema);