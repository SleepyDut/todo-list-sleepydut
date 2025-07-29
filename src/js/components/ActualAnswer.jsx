import React, { useState } from "react";

const Answer = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false },
      ]);
      setInputValue("");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-info text-center mb-4">Todo List</h1>

          {/* Todo List */}
          <div className="card">
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-7"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {todos.length === 0 ? (
                <p className="mt-2 text-muted text-center">Add tasks above.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="mt-2 list-group-item d-flex justify-content-between align-items-center todo-item"
                    >
                      <span>{todo.text}</span>
                      <button
                        type="button"
                        className="hover btn-close delete-btn"
                        aria-label="Close"
                        onClick={() => deleteTodo(todo.id)}
                      ></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {todos.length > 0 && (
              <div className=" mx-3 mb-2">
                <small className="text-muted">{todos.length} Items left</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
