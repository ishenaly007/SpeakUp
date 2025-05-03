document.addEventListener('DOMContentLoaded', () => {
    const userId = checkAuth();
    const chatHistory = document.getElementById('chat-history');

    if (userId) {
        chatHistory.innerHTML = '<p class="loading">Загрузка истории чата...</p>';
        apiRequest(`chat/${userId}/history`)
            .then(history => {
                chatHistory.innerHTML = ''; // Удаляем индикатор загрузки
                history.forEach(message => {
                    appendMessage(message.message, message.isUserMessage, message.createdAt);
                });
                chatHistory.scrollTop = chatHistory.scrollHeight;
            })
            .catch(error => {
                console.error('Ошибка загрузки истории чата:', error);
                chatHistory.innerHTML = `<p class="error">Ошибка загрузки чата: ${error.message}</p>`;
            });
    } else {
        chatHistory.innerHTML = '<p class="error">Пожалуйста, войдите в систему.</p>';
    }

    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

function appendMessage(message, isUser, createdAt) {
    const chatHistory = document.getElementById('chat-history');
    const timestamp = new Date(createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
        <div class="avatar ${isUser ? 'user-avatar' : 'bot-avatar'}">
            <img src="${isUser ? 'https://upload.wikimedia.org/wikipedia/commons/1/19/Audi_A7_Sportback_Genf_2018.jpg' : 'https://img.alicdn.com/imgextra/i2/1797064093/O1CN01FTdSDT1g6e7p1HAv6_!!1797064093.png_.webp'}" alt="${isUser ? 'User' : 'Bot'}">
        </div>
        <div class="message-content">
            <div class="message-text">${parseMarkdownV2(message)}</div>
            <span class="timestamp">${timestamp}</span>
        </div>
    `;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const userId = checkAuth();
    appendMessage(message, true, new Date().toISOString()); // Локальное время для отправленного сообщения
    input.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    document.getElementById('chat-history').appendChild(typingDiv);
    document.getElementById('chat-history').scrollTop = document.getElementById('chat-history').scrollHeight;

    apiRequest('chat', 'POST', { userId, message })
        .then(data => {
            document.getElementById('chat-history').removeChild(typingDiv);
            appendMessage(data.message, false, data.createdAt);
        })
        .catch(error => {
            document.getElementById('chat-history').removeChild(typingDiv);
            console.error('Ошибка отправки сообщения:', error);
            alert(`Ошибка отправки сообщения: ${error.message}`);
        });
}

function clearChat() {
    document.getElementById('chat-history').innerHTML = '';
}