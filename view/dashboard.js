const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html'; // Перенаправление на логин, если не авторизован
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

    let currentTaskId = null; // Отслеживание редактируемой задачи

    // Получение задач с сервера
    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:8000/api/tasks', {
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
                    ${task.title} - ${task.description}
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                taskList.appendChild(li);

                // Добавление обработчиков для редактирования и удаления
                const editButton = li.querySelector('.edit-btn');
                const deleteButton = li.querySelector('.delete-btn');
                
                editButton.addEventListener('click', () => editTask(task._id));
                deleteButton.addEventListener('click', () => deleteTask(task._id));
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Создание или обновление задачи
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();

        if (!title || !description) {
            alert('Task title and description cannot be empty');
            return;
        }

        try {
            let response;
            if (currentTaskId) {
                // Обновление задачи
                response = await fetch(`http://localhost:8000/api/tasks/${currentTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, description })
                });
                currentTaskId = null;
                submitBtn.textContent = 'Add Task';
            } else {
                // Создание новой задачи
                response = await fetch('http://localhost:8000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, description })
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

    // Функция для редактирования задачи
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

            submitBtn.textContent = 'Update Task';
            currentTaskId = taskId;
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    }

    // Функция для удаления задачи
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

    // Загрузка задач при загрузке страницы
    fetchTasks();
});

function toggleMenu() {
    document.querySelector(".menu").classList.toggle("active");
}
