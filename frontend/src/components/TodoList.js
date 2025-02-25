//Receives the list of todos and a delete function as props. It maps over the todos to render each individual TodoItem
import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, deleteTodo, editTodo }) {
    return (
        <ul>
            {todos.map(todo => (
                <TodoItem key={todo._id} todo={todo} deleteTodo={deleteTodo} editTodo={editTodo} />
            ))}
        </ul>
    );
}

export default TodoList;