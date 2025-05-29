insert into public.tests (id, lesson_id, question, correct_option)
values  (1, 1, 'Какой цвет называется "Blue" на английском?', 'Синий'),
        (2, 1, 'Какой цвет получается при смешивании красного и жёлтого?', 'Orange'),
        (3, 1, 'Как правильно произносится цвет "Green" на английском?', '/griːn/'),
        (4, 2, 'Какое приветствие лучше использовать в 9 утра?', 'Good morning'),
        (5, 2, 'Как сказать "Привет" неформально на английском?', 'Hi'),
        (6, 2, 'Заполни пропуск: "Hey, Mike! What’s up?" — "____, just heading to the park."', 'Not much');

insert into public.test_options (test_id, option)
values  (1, 'Синий'),
        (1, 'Красный'),
        (1, 'Зелёный'),
        (2, 'Orange'),
        (2, 'Green'),
        (2, 'Magenta'),
        (2, 'Purple'),
        (2, 'Brown'),
        (3, '/griːn/'),
        (3, '/ˈjɛloʊ/'),
        (4, 'Good morning'),
        (4, 'Good evening'),
        (4, 'Good afternoon'),
        (4, 'Hey'),
        (5, 'Hi'),
        (5, 'Good afternoon'),
        (5, 'Ms. Smith'),
        (6, 'Not much'),
        (6, 'Goodbye'),
        (6, 'Good morning'),
        (6, 'I’m fine'),
        (6, 'Hello');

INSERT INTO lessons (title, level, description, note, html_content, css_content, javascript_content)
VALUES (
           'Love in English: Rom-Com Vibes',
           'A2-B1',
           'Урок о выражении чувств на английском в стиле романтической комедии с флиртом, диалогами и признаниями.',
           'Практикуйте интонацию для флирта и используйте сцены из фильмов для вдохновения.',
           '<section id="flirt-scene" class="section-scene">
             <h2>Сцена в кафе: Флиртуем по-английски</h2>
             <p>Ты в уютном кафе, напротив симпатичный человек. Пора сказать что-то романтичное! Вот ключевые слова:</p>
             <ul class="vocab-list">
               <li><span class="vocab-term">to flirt</span> — флиртовать: <em>She’s flirting with him by smiling.</em></li>
               <li><span class="vocab-term">chemistry</span> — химия между людьми: <em>There’s chemistry between us.</em></li>
               <li><span class="vocab-term">to sweep someone off their feet</span> — вскружить голову: <em>He swept her off her feet.</em></li>
               <li><span class="vocab-term">love at first sight</span> — любовь с первого взгляда: <em>Is it love at first sight?</em></li>
             </ul>
             <p><strong>Задание:</strong> Напиши диалог (4 реплики), где ты флиртуешь, используя 2 слова из списка.</p>
             <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" alt="Cozy Cafe" class="scene-image" />
           </section>

           <section id="movie-moment" class="section-movie">
             <h2>Культовый момент из ромкома</h2>
             <p>Посмотри сцену из <em>Love Actually</em> с признанием через плакаты:</p>
             <iframe width="560" height="315" src="https://www.youtube.com/embed/cU3Z6iY0rqs" title="Love Actually Scene" frameborder="0" allowfullscreen></iframe>
             <p><strong>Задание:</strong> Выпиши 2 романтичные фразы из видео и напиши свое признание (4-5 предложений), используя 1 слово из списка.</p>
           </section>

           <section id="love-letter" class="section-letter">
             <h2>Письмо любви</h2>
             <p>Напиши короткое письмо своему воображаемому возлюбленному. Используй 2 слова из списка.</p>
             <div class="letter-box">
               <p><em>Пример:</em> Dear Emma, I felt chemistry the moment we met. You swept me off my feet!</p>
             </div>
             <button id="check-letter" class="interactive-btn">Проверить письмо</button>
             <div id="feedback" class="feedback-box"></div>
           </section>',
           '/* love.css */
           * {
             box-sizing: border-box;
             margin: 0;
             padding: 0;
           }
           body {
             font-family: "Arial", sans-serif;
             background-color: #fff5f5;
             color: #333;
             line-height: 1.6;
           }
           .section-scene, .section-movie, .section-letter {
             padding: 20px;
             background-color: #fff;
             margin: 20px;
             border-radius: 8px;
             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
           }
           .scene-image {
             width: 100%;
             max-width: 500px;
             margin: 15px 0;
             border-radius: 6px;
           }
           .vocab-list {
             list-style: none;
             margin: 15px 0;
           }
           .vocab-term {
             font-weight: bold;
             color: #e91e63;
           }
           .letter-box {
             background-color: #ffebee;
             padding: 15px;
             border-left: 4px solid #e91e63;
             border-radius: 4px;
           }
           .interactive-btn {
             padding: 10px 20px;
             background-color: #e91e63;
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
           }
           .interactive-btn:hover {
             background-color: #d81b60;
           }
           .feedback-box {
             margin-top: 10px;
             padding: 10px;
             background-color: #f0f0f0;
             border-radius: 4px;
             display: none;
           }',
           'document.getElementById("check-letter").addEventListener("click", function() {
             const feedback = document.getElementById("feedback");
             feedback.style.display = "block";
             feedback.textContent = "Great job! Make sure your letter includes at least 2 vocab words like ''flirt'' or ''chemistry''.";
  });'
       );

-- Тесты для урока 1 (lesson_id = 4, test_id начинается с 7)
INSERT INTO tests (id, lesson_id, question, correct_option)
VALUES
    (7, 4, 'Что означает фраза "to sweep someone off their feet"?', 'Вскружить голову'),
    (8, 4, 'Как сказать "флиртовать" на английском?', 'To flirt'),
    (9, 4, 'Заполни пропуск: "I felt ___ the moment we met."', 'chemistry');

INSERT INTO test_options (test_id, option)
VALUES
    (7, 'Вскружить голову'), (7, 'Расстаться'), (7, 'Встретиться'),
    (8, 'To flirt'), (8, 'To love'), (8, 'To break up'),
    (9, 'chemistry'), (9, 'friendship'), (9, 'anger');

-- Урок 2: Работа — Английский в стиле стартапа (lesson_id = 5)
INSERT INTO lessons (title, level, description, note, html_content, css_content, javascript_content)
VALUES (
           'Work in English: Startup Hustle',
           'A2-B1',
           'Урок о работе в стартапе: презентация идей, найм команды и обсуждение карьерных целей на английском.',
           'Практикуйте уверенный тон для питча и используйте реальные примеры стартапов.',
           '<section id="pitch-zone" class="section-pitch">
             <h2>Питч твоего стартапа</h2>
             <p>Ты фаундер стартапа и презентуешь идею инвесторам. Вот слова для крутого питча:</p>
             <ul class="vocab-list">
               <li><span class="vocab-term">to pitch an idea</span> — презентовать идею: <em>I’m pitching my app to investors.</em></li>
               <li><span class="vocab-term">hustle</span> — суета, энергичная работа: <em>Startup life is all about hustle.</em></li>
               <li><span class="vocab-term">game-changer</span> — революционное решение: <em>Our product is a game-changer.</em></li>
               <li><span class="vocab-term">to scale a business</span> — масштабировать бизнес: <em>We need to scale our business globally.</em></li>
             </ul>
             <p><strong>Задание:</strong> Напиши питч (5-7 предложений) для своего стартапа, используя 2 слова из списка.</p>
             <img src="https://images.unsplash.com/photo-1516321310762-4792d68b6f04" alt="Startup Office" class="pitch-image" />
           </section>

           <section id="shark-tank" class="section-video">
             <h2>Учись у профи</h2>
             <p>Посмотри питч из <em>Shark Tank</em>:</p>
             <iframe width="560" height="315" src="https://www.youtube.com/embed/k3Ps7Zk8V1A" title="Shark Tank Pitch" frameborder="0" allowfullscreen></iframe>
             <p><strong>Задание:</strong> Выпиши 2 уверенные фразы из видео и напиши свой питч, вдохновленный ими.</p>
           </section>

           <section id="job-ad" class="section-job">
             <h2>Найми команду</h2>
             <p>Напиши объявление о вакансии для своего стартапа (4-6 предложений). Используй 2 слова из списка.</p>
             <div class="job-box">
               <p><em>Пример:</em> Join our hustle! We’re looking for a developer to create a game-changer product.</p>
             </div>
             <button id="check-ad" class="interactive-btn">Проверить объявление</button>
             <div id="feedback" class="feedback-box"></div>
           </section>',
           '/* work.css */
           * {
             box-sizing: border-box;
             margin: 0;
             padding: 0;
           }
           body {
             font-family: "Helvetica", sans-serif;
             background-color: #e3f2fd;
             color: #333;
             line-height: 1.6;
           }
           .section-pitch, .section-video, .section-job {
             padding: 20px;
             background-color: #fff;
             margin: 20px;
             border-radius: 8px;
             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
           }
           .pitch-image {
             width: 100%;
             max-width: 500px;
             margin: 15px 0;
             border-radius: 6px;
           }
           .vocab-list {
             list-style: none;
             margin: 15px 0;
           }
           .vocab-term {
             font-weight: bold;
             color: #0288d1;
           }
           .job-box {
             background-color: #e1f5fe;
             padding: 15px;
             border-left: 4px solid #0288d1;
             border-radius: 4px;
           }
           .interactive-btn {
             padding: 10px 20px;
             background-color: #0288d1;
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
           }
           .interactive-btn:hover {
             background-color: #0277bd;
           }
           .feedback-box {
             margin-top: 10px;
             padding: 10px;
             background-color: #f0f0f0;
             border-radius: 4px;
             display: none;
           }',
           'document.getElementById("check-ad").addEventListener("click", function() {
             const feedback = document.getElementById("feedback");
             feedback.style.display = "block";
             feedback.textContent = "Awesome! Ensure your job ad uses at least 2 vocab words like ''hustle'' or ''game-changer''.";
  });'
       );

-- Тесты для урока 2 (lesson_id = 5, test_id начинается с 10)
INSERT INTO tests (id, lesson_id, question, correct_option)
VALUES
    (10, 5, 'Что означает "to pitch an idea"?', 'Презентовать идею'),
    (11, 5, 'Как сказать "революционное решение" на английском?', 'Game-changer'),
    (12, 5, 'Заполни пропуск: "Startup life is all about ___."', 'hustle');

INSERT INTO test_options (test_id, option)
VALUES
    (10, 'Презентовать идею'), (10, 'Найти работу'), (10, 'Завершить проект'),
    (11, 'Game-changer'), (11, 'Break-even'), (11, 'Teamwork'),
    (12, 'hustle'), (12, 'relaxation'), (12, 'failure');

-- Урок 3: Путешествия — Английский в стиле тревел-блога (lesson_id = 6)
INSERT INTO lessons (title, level, description, note, html_content, css_content, javascript_content)
VALUES (
           'Travel in English: Blogger’s Adventure',
           'A2-B1',
           'Урок о путешествиях в стиле тревел-блога: делимся впечатлениями, пишем посты и снимаем сторис на английском.',
           'Используйте яркие описания и практикуйте неформальный стиль.',
           '<section id="blog-vibe" class="section-blog">
             <h2>Твой тревел-блог</h2>
             <p>Ты вернулся из путешествия и готов написать пост в Instagram. Вот слова для ярких историй:</p>
             <ul class="vocab-list">
               <li><span class="vocab-term">wanderlust</span> — страсть к путешествиям: <em>My wanderlust takes me to new places.</em></li>
               <li><span class="vocab-term">hidden gem</span> — скрытая жемчужина: <em>This cafe is a hidden gem.</em></li>
               <li><span class="vocab-term">to soak up the culture</span> — впитывать культуру: <em>I love soaking up the culture.</em></li>
               <li><span class="vocab-term">bucket list</span> — список желаний: <em>Japan is on my bucket list.</em></li>
             </ul>
             <p><strong>Задание:</strong> Напиши пост для Instagram (5-7 предложений) о своем путешествии, используя 2 слова из списка.</p>
             <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" alt="Tropical Beach" class="blog-image" />
           </section>

           <section id="travel-video" class="section-video">
             <h2>Вдохновение от блогера</h2>
             <p>Посмотри, как тревел-блогеры делятся впечатлениями:</p>
             <iframe width="560" height="315" src="https://www.youtube.com/embed/6mXbW2nZrcw" title="Nomadic Matt Travel" frameborder="0" allowfullscreen></iframe>
             <p><strong>Задание:</strong> Выпиши 2 фразы из видео и напиши свои 3-5 предложений для сторис.</p>
           </section>

           <section id="travel-quiz" class="section-quiz">
             <h2>Проверь свои впечатления</h2>
             <p>Выбери место и опиши его в 3-4 предложениях, используя 2 слова из списка.</p>
             <button id="check-quiz" class="interactive-btn">Проверить описание</button>
             <div id="feedback" class="feedback-box"></div>
           </section>',
           '/* travel.css */
           * {
             box-sizing: border-box;
             margin: 0;
             padding: 0;
           }
           body {
             font-family: "Georgia", serif;
             background-color: #e8f5e9;
             color: #333;
             line-height: 1.6;
           }
           .section-blog, .section-video, .section-quiz {
             padding: 20px;
             background-color: #fff;
             margin: 20px;
             border-radius: 8px;
             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
           }
           .blog-image {
             width: 100%;
             max-width: 500px;
             margin: 15px 0;
             border-radius: 6px;
           }
           .vocab-list {
             list-style: none;
             margin: 15px 0;
           }
           .vocab-term {
             font-weight: bold;
             color: #388e3c;
           }
           .interactive-btn {
             padding: 10px 20px;
             background-color: #388e3c;
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
           }
           .interactive-btn:hover {
             background-color: #2e7d32;
           }
           .feedback-box {
             margin-top: 10px;
             padding: 10px;
             background-color: #f0f0f0;
             border-radius: 4px;
             display: none;
           }',
           'document.getElementById("check-quiz").addEventListener("click", function() {
             const feedback = document.getElementById("feedback");
             feedback.style.display = "block";
             feedback.textContent = "Cool! Make sure your description uses at least 2 vocab words like ''wanderlust'' or ''hidden gem''.";
  });'
       );

-- Тесты для урока 3 (lesson_id = 6, test_id начинается с 13)
INSERT INTO tests (id, lesson_id, question, correct_option)
VALUES
    (13, 6, 'Что означает "hidden gem"?', 'Скрытая жемчужина'),
    (14, 6, 'Как сказать "страсть к путешествиям" на английском?', 'Wanderlust'),
    (15, 6, 'Заполни пропуск: "Visiting Iceland is on my ___."', 'bucket list');

INSERT INTO test_options (test_id, option)
VALUES
    (13, 'Скрытая жемчужина'), (13, 'Популярное место'), (13, 'Дорогой отель'),
    (14, 'Wanderlust'), (14, 'Adventure'), (14, 'Vacation'),
    (15, 'bucket list'), (15, 'to-do list'), (15, 'travel plan');