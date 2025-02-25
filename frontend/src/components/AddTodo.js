//Provides a form for users to enter a new todo title and submit it
import React, { useState } from 'react';

function AddTodo( { addTodo }) {
    //useState hook to manage the input value for the new todo title
    const [title, setTitle] = useState('');

    //handleSubmit is called when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevent the default form submission (which reloads the page)
        if (!title.trim()) return; //If the input is empty or only whitespace, do nothing
        await addTodo(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type= 'text'
                placeholder='Add a new todo...'
                value={title}
                onChange={(e) => setTitle(e.target.value)} //Update state as the user types
            />
            <button type='submit'>Add</button>
        </form>
    );
}

export default AddTodo;