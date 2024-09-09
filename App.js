import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Low');
  const [newCategory, setNewCategory] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState('Low');
  const [editCategory, setEditCategory] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState('');

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    // Check alarm
    if (alarmTime && currentTime.toTimeString().slice(0, 5) === alarmTime) {
      alert('Alarm ringing!');
      setAlarmTime(''); // Reset alarm after ringing
    }
  }, [currentTime, alarmTime]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    const newTodoItem = {
      id: Date.now(),
      title: newTodo,
      dueDate: newDueDate,
      priority: newPriority,
      category: newCategory,
      completed: false,
    };

    setTodos([...todos, newTodoItem]);
    setNewTodo('');
    setNewDueDate('');
    setNewPriority('Low');
    setNewCategory('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id, title, dueDate, priority, category) => {
    setEditTodoId(id);
    setEditTodoText(title);
    setEditDueDate(dueDate);
    setEditPriority(priority);
    setEditCategory(category);
  };

  const saveEdit = () => {
    if (editTodoText.trim() === '') return;

    setTodos(
      todos.map(todo =>
        todo.id === editTodoId ? { ...todo, title: editTodoText, dueDate: editDueDate, priority: editPriority, category: editCategory } : todo
      )
    );
    setEditTodoId(null);
    setEditTodoText('');
    setEditDueDate('');
    setEditPriority('Low');
    setEditCategory('');
  };

  const cancelEdit = () => {
    setEditTodoId(null);
    setEditTodoText('');
    setEditDueDate('');
    setEditPriority('Low');
    setEditCategory('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    let filtered = todos;
    if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    }
    if (search) {
      filtered = filtered.filter(todo => todo.title.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showDetailsPopup = (todo) => {
    setSelectedTodo(todo);
    setShowDetails(true);
  };

  const closeDetailsPopup = () => {
    setShowDetails(false);
    setSelectedTodo(null);
  };

  const progress = Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <input
        type="date"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
      />
      <select
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Category"
      />
      <button onClick={addTodo}>Add</button>

      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks"
      />

      <ul>
        {getFilteredTodos().sort((a, b) => b.priority.localeCompare(a.priority)).map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {editTodoId === todo.id ? (
              <div className="edit-buttons">
                <input
                  type="text"
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category"
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title} - {todo.dueDate} - {todo.priority} - {todo.category}
                </span>
                <button onClick={() => startEditing(todo.id, todo.title, todo.dueDate, todo.priority, todo.category)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={() => showDetailsPopup(todo)}>Details</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={clearCompleted}>Clear Completed</button>

      <div className="footer">
        <span>{todos.filter(todo => !todo.completed).length} items left</span>
      </div>

      <div className="progress">
        <span>Progress: {progress}%</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="clock">
        <span>Current Time: {currentTime.toLocaleTimeString()}</span>
      </div>

      <div className="alarm">
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          placeholder="Set Alarm"
        />
      </div>

      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {showDetails && (
        <div className="popup">
          <div className="popup-content">
            <h2>Task Details</h2>
            <p>Title: {selectedTodo.title}</p>
            <p>Due Date: {selectedTodo.dueDate}</p>
            <p>Priority: {selectedTodo.priority}</p>
            <p>Category: {selectedTodo.category}</p>
            <button onClick={closeDetailsPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
