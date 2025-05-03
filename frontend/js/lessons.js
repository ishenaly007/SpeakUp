document.addEventListener('DOMContentLoaded', () => {
    const userId = checkAuth();
    const lessonsList = document.getElementById('lessons-list');

    if (!userId) {
        lessonsList.innerHTML = '<p class="error">Пожалуйста, войдите в систему.</p>';
        return;
    }

    lessonsList.innerHTML = '<p class="loading">Загрузка уроков...</p>';

    apiRequest(`lessons?userId=${userId}`)
        .then(lessons => {
            lessonsList.innerHTML = ''; // Удаляем индикатор загрузки
            if (lessons.length === 0) {
                lessonsList.innerHTML = '<p class="info">Уроки пока недоступны.</p>';
                return;
            }

            lessons.forEach((lesson, index) => {
                const lessonDiv = document.createElement('div');
                lessonDiv.className = 'lesson';
                lessonDiv.style.animationDelay = `${index * 0.1}s`;
                lessonDiv.innerHTML = `
                    <h3>${lesson.title} (${lesson.level})</h3>
                    <div class="markdown-body lesson-description">${parseMarkdownV2(lesson.description)}</div>
                    <p class="status">${lesson.completed ? '✅ Завершено' : '⏳ В процессе'}</p>
                `;
                lessonDiv.onclick = () => {
                    window.location.href = `lesson.html?lessonId=${lesson.id}&userId=${userId}`;
                };
                lessonsList.appendChild(lessonDiv);
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки уроков:', error);
            lessonsList.innerHTML = `<p class="error">Не удалось загрузить уроки: ${error.message}</p>`;
        });
});