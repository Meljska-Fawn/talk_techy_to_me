const editFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#edit-title-input').value.trim();
    const content = document.querySelector('#edit-post-content-input').value.trim();

    if (title && content) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard/');
        } else {
            alert('Failed to edit post.');
        }
    }
};

document.querySelector('#edit-post-form').addEventListener('submit', editFormHandler);