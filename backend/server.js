//Server-side file: responsible for handling the data sent from the front end

//Initialization
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors());

//Connecting to MongoDB
/**
 * Notes:
 * mongoose.connect(process.env.MONGO_URI, {...}) => Attempts to connect to a MongoDB database.
 * The connection URI is read from an environment variable (process.env.MONGO_URI), which keeps
 * sensitive infor (like your database credentials) out of the code
 * 
 * options:
 * -userNewURLParser: true => Uses the new MongoDB connection string parser for better reliability.
 * -useUnifiedTopology: true => Uses the new topology engine to improve connection management (handles server discover, monitoring, and failover more efficiently).
 * 
 * mongoose.connect is asynchronous because it returns a promise. This promise lets you knwo when the connection succeeds or fails.
 * .then method attaches a callback that will be executed when the promise resolves successfully
 * .catch method attaches a callback that will be executed if the promise is rejected 
 */
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

//Define a simple Todo model using Mongoose
/**
 * Notes:
 * const todoSchema = new mongoose.Schema({...}) => a schema acts like a blueprint for how each Todo document should look in MongoDB
 * Example: 
 * { title: "Read a book ", completed: false }
 */
const todoSchema = new mongoose.Schema({
    title: String,
    completed : { type: Boolean, default: false } 
});

//Compile the schema into a model
/**
 * What does the model do?
 * -provides an interface (methods) to create, read, update, and delete documents in the collection.
 * 
 * The Todo model is a class that we can use to interact with the todos collection in MongoDB
 * Mongoose will automatically convert 'Todo' to 'todos' as the collection name.
 */
const Todo = mongoose.model('Todo', todoSchema);

//API Endpoints

//GET all todos
app.get('/api/todos', async (req, res) => {
    try{
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    };
});

//POST a new todo
app.post('/api/todos', async (req, res) => {
    try {
        //Get the title from the frontend request
        const { title } = req.body;

        //If title is missing, throw an error
        if (!title) throw new Error('Title is required')

        //Create a new JS object (a Mongoose document) based on the Todo model
        const newTodo = new Todo({title: title});

        //Save the todo in MongoDB
        //Note: if saving fails, Mongoose would throw an error
        const savedTodo = await newTodo.save();

        //Send back status 201 (created) and the saved todo
        res.status(201).json(savedTodo);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//PUT replace a todo with a edited todo
app.post('/api/todos/:id', async (req, res) => {
    try {
        //Get the id from the params
        const { id } = req.params

        //Get the updated data from the frontend
        const { title, completed } = req.body;

        //Update the todo with the new values and return the updated document
        const editedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, completed },
            { new : true } //This option returns the updated document
        );

        //Send back status 200 (ok) and the editedTodo
        res.status(200).json(editedTodo);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//DELETE a todo by ID
app.delete('/api/todo/:id', async (req, res) => {
    try {
        //Get the id from the params
        const { id } = req.params;

        //Wait for MongoDB to delete the todo with the id
        await Todo.findByIdAndDelete(id);

        //Send back status 200 (ok) and json data containing the message that the todo was deleted
        res.status(200).json({message: 'Todo deleted'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});