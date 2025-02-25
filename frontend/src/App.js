/**
 * The App component holds the main logic and state for the app
 * It fetches the list of todos from the backend, handles adding new todos, and deleting existing ones
 * It also renders child components like AddTodo and TodoList
 */
/**
 * Main Component vs Child Components
 * Main Component:
 * -State & Data: Holds the overall state of your app (like the list of todos)
 * -API Calls & Logic: Contains functions that make API calls (e.g., GET, POST, PUT, DELETE) and update the state accordingly
 * -Passing Props: Passes data and functions to child componenets so they can display data or trigger state changes
 * 
 * Child Components:
 * -UI & Presentation: Responsible for displaying specific parts of the UI
 * -User Interactions: Handle events (like clicks) and then call the functions passed down from the parent
 * -No Global State Management: They don't manage the overall state; instead, they receive data and functions via props
 */

import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

function App() {
  //when you call the useState hook, it returns an array with two elements:
  //1. the current state value (i.e. todos)
  //2. A function to update that state (i.e. setTodos)
  //Here we initialize the todos state as an empty array
  const [todos, setTodos] = useState([]);//Creates a state variable named todos, which starts as an empty array and it creates a function named setTodos that you can use to update the todos state

  //useEffect runs after the component mounts.
  //It fetches the initial list of todos from our backend.
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        const data = await response.json();
        setTodos(data);
      }catch (error) {
        console.error('Error fetching todos:', error);
      }
    }

    fetchTodos();
  }, []); //Empty array means this runs only once when the component mounts

  //Function to add a new todo
  //Note: dont need to pass in completed because when created default should be false
  const addTodo = async (title) => {
    try {
      //Send a POST request to create a new todo
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({title}),
      });
      //Convert response from JSON string into a JS object
      const newTodo = await response.json();

      //Update the todos state by adding the new todo.
      //setTodos used to update the todos state
      //... is the spread operator. In this context, it takes all the elements from the current todos array and "spreads" them into a new array
      //[...todos, newTodo] creates a brand new array that: starts with all the current todos and appends newTodo at the end
      //Why use the spread operator? => in React, you should not mutate state directly. Instead you create a new array(or object) with the updated data
      setTodos([...todos, newTodo]);

    } catch (error) {
      console.error('Error adding todo', error);
    }
  }

  //Function to delete a new todo
  const deleteTodo = async (id) => {
    try {
      //Send a DELETE request to remove the todo with the given id
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      //Update the state by filtering out the deleted todo
      setTodos(todos.filter(todo => todo._id !== id));

    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const editTodo = async (id, updatedData) => {
    try {
      //Send a PUT request to replace the old todo with the edited todo data
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(updatedData)
      });

      //Convert from JSON to JS 
      const updatedTodo = await response.json();

      //Update state: replace the old todo with the new one
      /**
       * map() returns a new array
       * for each element, if the todo matched the id, it replaces it with updatedTodo; otherwise, it keeps the original todo
       */
      setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error editing todo: ', error);
    }

  }

  /**
   * Rendering a component=> means displaying a componenet (which is like a custom HTML element) on the screen
   * Props (Properties)=> are a way to pass data or functions from a parent component (e.g. App) to a child component (e.g. AddTodo or TodoList)
   * Passing Props => you're sending data (like the list of todos) and functions (like how to add or delete a todo) from your main App component into these smaller components so they can use that data and functionality
   */
  return (
    <div className='App'>
      <h1>To-Do App</h1>
      {/* Render the AddTodo component and pass the AddTodo function as a prop */}
      <AddTodo addTodo={addTodo} />
      {/* Render the ToDoList componenet and pass todos and deleteTodo function as props */}
      <TodoList todos ={todos} deleteTodo={deleteTodo} editTodo={editTodo} />
    </div>
  )


}

export default App;