const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html'; // Redirect to login if not authenticated
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const submitBtn = document.getElementById('submitBtn');
    const taskList = document.getElementById('taskList');
    const sortBy = document.getElementById('sortBy');
    const order = document.getElementById('order');
    const importanceFilter = document.getElementById('importanceFilter');

    let currentTaskId = null; // To track the task being edited

    // Fetch tasks from the backend with sorting and filtering
    async function fetchTasks() {
        const importance = importanceFilter.value;
        const sortByValue = sortBy.value;
        const orderValue = order.value;

        try {
            const response = await fetch(`http://localhost:8000/api/tasks?importance=${importance}&sortBy=${sortByValue}&order=${orderValue}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const tasks = await response.json();
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${task.title} - ${task.description} - ${task.dueDate} - ${task.importance}
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                taskList.appendChild(li);

                // Add event listeners for edit and delete buttons
                const editButton = li.querySelector('.edit-btn');
                const deleteButton = li.querySelector('.delete-btn');
                
                editButton.addEventListener('click', () => editTask(task._id));
                deleteButton.addEventListener('click', () => deleteTask(task._id));
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Add a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();

        if (!title || !description) {
            alert('Task title and description cannot be empty');
            return;
        }

        const dueDate = document.getElementById('dueDate').value;
        const importance = document.getElementById('importance').value;

        try {
            let response;
            if (currentTaskId) {
                // Edit task
                response = await fetch(`http://localhost:8000/api/tasks/${currentTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, description, dueDate, importance })
                });
                currentTaskId = null; // Reset edit mode after update
            } else {
                // Add task
                response = await fetch('http://localhost:8000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, description, dueDate, importance })
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save task');
            }

            taskTitle.value = '';
            taskDescription.value = '';
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    });

    // Edit task
    async function editTask(taskId) {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch task details');
            }

            const task = await response.json();

            taskTitle.value = task.title;
            taskDescription.value = task.description;

            // Change button text to "Update Task" and set edit mode
            submitBtn.textContent = 'Update Task';
            currentTaskId = taskId;
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    }

    // Delete a task
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Event listener for sorting and filtering changes
    sortBy.addEventListener('change', fetchTasks);
    order.addEventListener('change', fetchTasks);
    importanceFilter.addEventListener('change', fetchTasks);

    // Load tasks on page load
    fetchTasks();
});
