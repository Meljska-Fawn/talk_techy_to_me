const commentFormHandler = async (event) => {
    event.preventDefault();

    const content = document.querySelector('#new-comment').value.trim();
    const id = event.target.getAttribute('data-id');

    if (content) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};

document.querySelector('#comment-form').addEventListener('submit', commentFormHandler);