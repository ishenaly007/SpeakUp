const API_BASE_URL = 'http://localhost:8084/api';

// Проверка авторизации
function checkAuth() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
    return userId;
}

// Логин пользователя
async function login(telegramId, username) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramChatId: telegramId, telegramUsername: username })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        localStorage.setItem('userId', data.id);
        return data.id;
    } catch (error) {
        alert('Login failed: ' + error.message);
        throw error;
    }
}

// Утилита для API-запросов
async function apiRequest(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    } catch (error) {
        alert(`Error: ${error.message}`);
        throw error;
    }
}

// Парсинг MarkdownV2
function parseMarkdownV2(text) {
    // Декодируем экранированные символы
    const decodedText = text.replace(/\\([*_[\]()~`>#+\-=|{}.!])/g, '$1');
    // Обрабатываем Telegram-специфичные конструкции
    const processedText = decodedText
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Ссылки
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>') // Жирный
        .replace(/_(.*?)_/g, '<em>$1</em>') // Курсив
        .replace(/`(.*?)`/g, '<code>$1</code>'); // Код
    // Парсим через marked.js
    return marked.parse(processedText, { breaks: true });
}