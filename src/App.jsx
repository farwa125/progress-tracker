import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase.js';
import Swal from 'sweetalert2';
import { FaGoogle } from "react-icons/fa";


function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [user, setUser] = useState(null); // Track the user's authentication status
  const googleProvider = new GoogleAuthProvider();
  const authInstance = getAuth();
  const isAuthenticated = !!user; // Check if the user is authenticated
 


  const saveTask = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }

    if (taskText.trim() !== '') {
      setTasks([...tasks, { text: taskText.trim(), completed: false }]);
      setTaskText('');
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const startEdit = (index) => {
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setEditIndex(-1);
  };

  const updateTaskText = (index, newText) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
    setEditIndex(-1);
  };

  const filterTasks = (status) => {
    setFilterStatus(status);
  };


  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'completed') {
      return task.completed;
    } else if (filterStatus === 'pending') {
      return !task.completed;
    }
    return true;
  });

  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };
  
  const signIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        setUser(result.user);
        Swal.fire ("Login Completed","","success")
      })
      .catch((error) => {
        // Handle login error
      });
  };

  return (
    <div className='bg-slate-500 h-[100vh] pt-10'>
      {isAuthenticated ? (
        <div className="container mx-auto max-w-md p-4 bg-gray-800 rounded-lg text-white">
          <div className='flex justify-center mb-4'> {/* Centering the heading */}
          <h1 className="text-2xl font-bold">Task Manager</h1>
        </div>
 <div className="flex items-center mb-4">
        
        <label htmlFor="task" className="mr-2 font-semibold">Enter Task</label>
        <div className="flex">
          <input
            value={taskText}
            type="text"
            id="task"
            placeholder="Enter Task"
            name="enter task"
            onChange={(event) => {
              setTaskText(event.target.value);
            }}
            className="border text-black border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          <button onClick={saveTask} className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md transition duration-300 ease-in-out hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <span className="mr-2 font-semibold">Filter Tasks:</span>
        <button onClick={() => filterTasks('all')} className={`mr-2 px-3 py-1 rounded-md ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
          All
        </button>
        <button onClick={() => filterTasks('completed')} className={`mr-2 px-3 py-1 rounded-md ${filterStatus === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
          Completed
        </button>
        <button onClick={() => filterTasks('pending')} className={`px-3 py-1 rounded-md ${filterStatus === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
          Pending
        </button>
      </div>
      <div>
        {filteredTasks.length === 0 ? (
          <p className="text-center py-5 ">
            <span className='border border-gray p-3 rounded-[3px] '>
              No tasks added yet
            </span>
          </p>
        ) : (
          <ul>
            {filteredTasks.map((task, index) => (
              <li key={index} className={`flex items-center justify-between py-2 border-b border-gray-300 ${task.completed ? '' : ''} ${!task.completed ? '' : 'bg-green-700'}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`task-${index}`}
                    name={`task-${index}`}
                    checked={task.completed}
                    onChange={() => toggleCompletion(index)}
                    className="mr-2"
                  />
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={task.text}
                      onChange={(event) => updateTaskText(index, event.target.value)}
                      onBlur={cancelEdit}
                      className={`focus:outline-none ${task.completed ? 'line-through' : 'font-semibold'}`}
                    />
                  ) : (
                    <span className={task.completed ? 'line-through' : 'font-semibold'}>{task.text}</span>
                  )}
                </div>
                <div>
                  {editIndex !== index ? (
                    <button onClick={() => startEdit(index)} className="px-3 py-1 mr-2 bg-yellow-500 text-white font-semibold rounded-md transition duration-300 ease-in-out hover:bg-yellow-700">
                      Edit
                    </button>
                  ) : null}
                  <button onClick={() => removeTask(index)} className="px-3 py-1 bg-red-500 text-white font-semibold rounded-md transition duration-300 ease-in-out hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-md p-4 bg-gray-800 rounded-lg text-white ">
          <h1 className="text-2xl font-bold text-center mb-4 ">Task Manager</h1>
          <div className='flex justify-center'>
          <button
            onClick={signIn}
            className="flex justify-center items-center gap-2 bg-white text-gray-900 border border-gray-900 px-4 py-2 rounded-md mb-4 transition duration-300 ease-in-out hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaGoogle />

            Sign in with Google
          </button>
          
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
