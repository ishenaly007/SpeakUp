document.addEventListener('DOMContentLoaded', () => {
    const lessonTitleElement = document.getElementById('lesson-title'); // Assuming this element exists
    const lessonContentArea = document.getElementById('lesson-content-area');
    // Optional: const errorDisplayElement = document.getElementById('error-display');

    if (!lessonContentArea || !lessonTitleElement) {
        console.error("Required HTML elements (lesson-title, lesson-content-area) not found.");
        // Display a generic error on the page if these critical elements are missing
        if (lessonContentArea) lessonContentArea.innerHTML = '<p class="error">Error loading page structure.</p>';
        else if (document.body) document.body.innerHTML = '<p class="error">Error loading page structure.</p>';
        return;
    }

    lessonTitleElement.textContent = 'Loading...';
    lessonContentArea.innerHTML = '<p class="loading">Загрузка урока...</p>';

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId');
    const userId = params.get('userId');

    if (!lessonId || !userId) {
        const errorMsg = '<p class="error">Ошибка: ID урока или ID пользователя отсутствуют в URL.</p>';
        lessonTitleElement.textContent = 'Ошибка';
        lessonContentArea.innerHTML = errorMsg;
        // if (errorDisplayElement) errorDisplayElement.innerHTML = errorMsg;
        return;
    }

    // Use apiRequest from main.js
    apiRequest(`lessons/${lessonId}?userId=${userId}`)
        .then(lesson => {
            lessonTitleElement.textContent = lesson.title || 'Lesson'; // Set lesson title
            lessonContentArea.innerHTML = lesson.htmlContent || '<p class="info">Содержимое урока недоступно.</p>';

            if (lesson.cssContent) {
                const styleElement = document.createElement('style');
                styleElement.textContent = lesson.cssContent;
                document.head.appendChild(styleElement);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки урока:', error);
            // The apiRequest function in main.js already alerts the error.
            // We can also display it in the lesson content area.
            const errorMsg = `<p class="error">Не удалось загрузить урок. ${error.message ? error.message : ''}</p>`;
            lessonTitleElement.textContent = 'Ошибка загрузки';
            lessonContentArea.innerHTML = errorMsg;
            // if (errorDisplayElement) errorDisplayElement.innerHTML = errorMsg;
        });
});
