addEventListener('DOMContentLoaded', () => {
    handleFormSubmit();
});

function handleFormSubmit() {
    const form = document.getElementById('message-form');
    const feedbackDiv = document.getElementById('form-feedback');
    const submitButton = document.getElementById('submit-button');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        submitButton.disabled = true;

        const name = (document.getElementById('name').value || '').trim();
        const email = (document.getElementById('email').value || '').trim();
        const subject = (document.getElementById('subject').value || '').trim();
        const message = (document.getElementById('message').value || '').trim();
    
        let isValid = true;
        let messages = [];
        if (name.length < 3) {
            isValid = false;
            messages.push('Name should be at least 3 characters');
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            isValid = false;
            messages.push('Email is invalid');
        }

        if (subject.length < 3) {
            isValid = false;
            messages.push('Subject should be at least 3 character');
        }

        if (message.length < 3) {
            isValid = false;
            messages.push('Message should be at least 3 character');
        }

        feedbackDiv.style.display = 'block';
        if (isValid) {
            document.getElementById('name').value = name;
            document.getElementById('email').value = email;
            document.getElementById('subject').value = subject;
            document.getElementById('message').value = message;
            await sendMessage(form, feedbackDiv);

        } else {
            feedbackDiv.innerHTML = messages.join('<br>');
            feedbackDiv.style.color = 'red';
        }
        submitButton.disabled = false;
    })
}

async function sendMessage(form, feedbackDiv) {

    const apiUrl = 'https://contact-worker.urban.rw/';
    feedbackDiv.textContent = "please wait...";
    feedbackDiv.style.color = 'green';

    try {
        const response = await fetch(apiUrl, {
            body: new FormData(form),
            method: 'POST',
            mode: 'cors',
        });

        const resMessage = await response.json();

        if (!response.ok) {
            throw new Error(resMessage);
        }
        feedbackDiv.textContent = 'Message received! I will get back to you soon via your email';
        feedbackDiv.style.color = 'green';

        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('message').value = '';

    } catch (e) {
        feedbackDiv.style.color = 'red';
        feedbackDiv.textContent = e.toString();
    }
}