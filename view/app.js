document.addEventListener('DOMContentLoaded', function () {
    // Переключение между формами
    document.getElementById('toggleForm').addEventListener('click', function (e) {
        e.preventDefault();

        let formTitle = document.getElementById('formTitle');
        let toggleText = document.getElementById('toggleForm');
        let usernameField = document.getElementById('usernameField');
        let usernameInput = document.getElementById('username');

        if (formTitle.innerText === 'Login') {
            formTitle.innerText = 'Register';
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLogin">Login</a>';
            usernameField.style.display = 'block';
            usernameInput.setAttribute('required', '');
        } else {
            formTitle.innerText = 'Login';
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleRegister">Register</a>';
            usernameField.style.display = 'none';
            usernameInput.removeAttribute('required');
        }

        document.getElementById('toggleLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('toggleForm').click();
        });

        document.getElementById('toggleRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('toggleForm').click();
        });
    });

    // Отправка формы для логина/регистрации
    document.getElementById('authForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        let usernameField = document.getElementById('username');
        let username = usernameField ? usernameField.value : '';
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let formTitle = document.getElementById('formTitle').innerText;
        let message = document.getElementById('message');

        // Используем префикс /api/auth для согласования с сервером
        let endpoint = formTitle === 'Login' ? '/api/auth/login' : '/api/auth/register';

        let requestBody = formTitle === 'Login'
            ? { email, password }
            : { username, email, password };

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                message.style.color = 'green';
                message.innerText = data.message || 'Success!';
                if (formTitle === 'Login') {
                    localStorage.setItem('token', data.token);
                    window.location.href = "home.html";
                }
            } else {
                throw new Error(data.error || 'Something went wrong!');
            }
        } catch (error) {
            message.style.color = 'red';
            message.innerText = error.message;
        }
    });
});
