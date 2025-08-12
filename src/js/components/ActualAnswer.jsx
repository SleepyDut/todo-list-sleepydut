import React, { useState, useEffect } from "react";

const Answer = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName] = useState("your_username"); // Change this to your desired username

  const API_BASE = "https://playground.4geeks.com/todo";

  // Create user if doesn't exist and fetch todos on component mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        // Try to get user first
        const userResponse = await fetch(`${API_BASE}/users/${userName}`);

        if (!userResponse.ok) {
          // User doesn't exist, create it
          await fetch(`${API_BASE}/users/${userName}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        // Fetch todos after ensuring user exists
        fetchTodos();
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [userName]);

  // Fetch todos from API
  const fetchTodos = () => {
    fetch(`${API_BASE}/users/${userName}`)
      .then((resp) => {
        console.log(resp.ok);
        console.log(resp.status);
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        setTodos(data.todos || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Add todo using your template
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setLoading(true);
      const task = {
        label: inputValue,
        is_done: false,
      };

      fetch(`${API_BASE}/todos/${userName}`, {
        method: "POST",
        body: JSON.stringify(task),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
          console.log(resp.ok); // Será true si la respuesta es exitosa
          console.log(resp.status); // El código de estado 201, 300, 400, etc.
          return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
        })
        .then((data) => {
          // Aquí es donde debe comenzar tu código después de que finalice la búsqueda
          console.log(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
          setInputValue("");
          fetchTodos(); // Refresh the list
          setLoading(false);
        })
        .catch((error) => {
          // Manejo de errores
          console.log(error);
          setLoading(false);
        });
    }
  };

  // Delete todo from API and refresh list
  const deleteTodo = (id) => {
    setLoading(true);
    fetch(`${API_BASE}/todos/${id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        console.log(resp.ok);
        console.log(resp.status);
        if (resp.ok) {
          fetchTodos(); // Refresh the list only if successful
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // Clear all todos from server
  const clearAllTodos = () => {
    setLoading(true);
    // Delete user (which deletes all their todos) and recreate
    fetch(`${API_BASE}/users/${userName}`, {
      method: "DELETE",
    })
      .then((resp) => {
        console.log(resp.ok);
        console.log(resp.status);
        // Recreate user
        return fetch(`${API_BASE}/users/${userName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then((resp) => {
        console.log(resp.ok);
        console.log(resp.status);
        // Update local state
        setTodos([]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
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
                className="form-control mb-3"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              {loading && (
                <div className="text-center mb-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {todos.length === 0 ? (
                <p className="mt-2 text-muted text-center">
                  {loading ? "Loading tasks..." : "Add tasks above."}
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="mt-2 list-group-item d-flex justify-content-between align-items-center todo-item"
                    >
                      <span>{todo.label}</span>
                      <button
                        type="button"
                        className="hover btn-close delete-btn"
                        aria-label="Close"
                        onClick={() => deleteTodo(todo.id)}
                        disabled={loading}
                      ></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mx-3 mb-2 d-flex justify-content-between align-items-center">
              {todos.length > 0 && (
                <small className="text-muted">{todos.length} Items left</small>
              )}
              {todos.length > 0 && (
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={clearAllTodos}
                  disabled={loading}
                >
                  Delete All!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
