const signupFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && password) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/homepage'); // it's looking for / in the homeroutes to know where to go to next
        } else {
            alert('Failed to sign up.');
        }
    }
};

document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);