document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toggleRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "/register.html";
    });
    

    document.getElementById('authForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        let usernameField = document.getElementById('username');
        let username = usernameField ? usernameField.value : '';
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let formTitle = document.getElementById('formTitle').innerText;
        let message = document.getElementById('message');

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