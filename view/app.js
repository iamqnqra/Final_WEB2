document.getElementById('toggleForm').addEventListener('click', function () {
    let formTitle = document.getElementById('formTitle');
    let toggleText = document.getElementById('toggleForm');
    let usernameField = document.getElementById('usernameField');
    let usernameInput = document.getElementById('username');
    
    if (formTitle.innerText === 'Login') {
        formTitle.innerText = 'Register';
        toggleText.innerHTML = 'Already have an account? <a href="#">Login</a>';
        usernameField.style.display = 'block';  // Show the username field for registration
        usernameInput.setAttribute('required', ''); // Make the username field required
    } else {
        formTitle.innerText = 'Login';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#">Register</a>';
        usernameField.style.display = 'none';  // Hide the username field for login
        usernameInput.removeAttribute('required'); // Remove the required attribute for login
    }
});

<<<<<<< HEAD
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Ошибка при входе');
        }

        const data = await response.json();
        console.log('Успешный вход:', data);
    } catch (error) {
        console.error('Ошибка:', error);
    }
});


=======
>>>>>>> 0a64b68af60a68ea6e1c84aa5f0c449b0b7ebbfd
document.getElementById('authForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let username = document.getElementById('username') ? document.getElementById('username').value : '';
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let formTitle = document.getElementById('formTitle').innerText;
    let message = document.getElementById('message');

    let endpoint = formTitle === 'Login' ? '/api/auth/login' : '/api/auth/register';

    let requestBody = formTitle === 'Login'
        ? { email, password }
        : { username, email, password }; // Register requires username, email, and password

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
            window.location.href = "dashboard.html"; // Redirect after login
        }
    } else {
        message.style.color = 'red';
        message.innerText = data.error || 'Something went wrong!';
    }
});

document.getElementById('navbar').innerHTML = (`
    <nav>
        <ul>
            <li><a href="index.html" id="home-link">Home</a></li>
            <li><a href="profile.html" id="profile-link">Profile</a></li>
            <li><a href="#" id="logout-link" style="display: none;">Logout</a></li>
        </ul>
    </nav>
`);
function toggleMenu() {
    document.querySelector(".menu").classList.toggle("active");
}