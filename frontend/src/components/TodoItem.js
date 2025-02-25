//Displays a single todo's title and provides a button to delete that todo
import React, { useState } from 'react';

function TodoItem({ todo, deleteTodo, editTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(todo.title);

    const handleSave = async () => {
        //Call the editTodo function from (App.js) with the new title and current completed status
        await editTodo(todo._id, {title : editedTitle, completed: todo.completed});
        setIsEditing(false);
    };

    return (
        <li>
            {isEditing ? (
                //When editing, show an input field with the current title
                <input
                    type='text'
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
            ) : (
                //When not editing, simple display the todo title
                <span>{todo.title}</span>
            )}

            {/* Toggle edit mode or save changes*/}
            {isEditing ? (
                <button onClick={handleSave}>Save</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
            )}

            {/* Delete button remains available */}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
        </li>
    );
}

export default TodoItem;