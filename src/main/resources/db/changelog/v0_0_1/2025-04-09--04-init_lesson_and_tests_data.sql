INSERT INTO lessons (title, level, description, note, html_content, css_content)
VALUES ('Colors in English',
        'Beginner',
        'Урок по изучению названий цветов на английском языке, включая основные и дополнительные цвета.',
        'Обратите внимание на правильное произношение и написание. Используйте визуальные подсказки.',
        '<section id="introduction" class="section-intro">
          <h2>Введение</h2>
          <p>
            В этом уроке вы узнаете, как правильно называть основные и дополнительные цвета на английском языке. Мы начнем с <strong>primary colors</strong>, затем перейдем к <strong>secondary colors</strong>.
          </p>
          <img src="https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=800&q=60" alt="Color Palette" class="intro-image" />
        </section>

        <section id="primary-colors" class="section-colors">
          <h2>Primary Colors (Основные цвета)</h2>
          <p>Основные цвета в английском языке:</p>
          <ul class="color-list">
            <li>
              <div class="color-swatch" style="background-color: #ff0000;"></div>
              <span class="color-name">Red</span> — красный
            </li>
            <li>
              <div class="color-swatch" style="background-color: #0000ff;"></div>
              <span class="color-name">Blue</span> — синий
            </li>
            <li>
              <div class="color-swatch" style="background-color: #ffff00;"></div>
              <span class="color-name">Yellow</span> — жёлтый
            </li>
          </ul>
          <p>
            <strong>Произношение:</strong> /rɛd/, /bluː/, /ˈjɛloʊ/. Повторяйте за видео:
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/O08xBTevmOo?si=tUpAD3TlUydwF1nT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>

        <section id="secondary-colors" class="section-colors">
          <h2>Secondary Colors (Дополнительные цвета)</h2>
          <p>Они образуются при смешивании основных цветов:</p>
          <ul class="color-list">
            <li>
              <div class="color-swatch" style="background-color: #00ff00;"></div>
              <span class="color-name">Green</span> — зелёный (<em>blue + yellow</em>)
            </li>
            <li>
              <div class="color-swatch" style="background-color: #ff00ff;"></div>
              <span class="color-name">Magenta</span> — маджента (<em>red + blue</em>)
            </li>
            <li>
              <div class="color-swatch" style="background-color: #ff7f00;"></div>
              <span class="color-name">Orange</span> — оранжевый (<em>red + yellow</em>)
            </li>
          </ul>
          <p>
            <strong>Произношение:</strong> /griːn/, /məˈdʒentə/, /ˈɔrɪndʒ/. Посмотрите пример в этом видео:
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/v9gIj0j7Ba0?si=ofNFJlXGSub1Leh6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>',
        '/* colors.css */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Arial", sans-serif;
        background-color: #fafafa;
        color: #333;
        line-height: 1.6;
      }

      .section-intro {
        background-color: #fff;
        padding: 30px 20px;
        text-align: center;
      }

      .intro-image {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .section-colors {
        padding: 30px 20px;
        background-color: #fdfdfd;
        border-bottom: 1px solid #e0e0e0;
      }

      .section-colors h2 {
        font-size: 2rem;
        margin-bottom: 15px;
        color: #ff7e5f;
      }

      .color-list {
        list-style: none;
      }

      .color-list li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }

      .color-swatch {
        width: 40px;
        height: 40px;
        margin-right: 15px;
        border: 2px solid #ccc;
        border-radius: 4px;
      }

      .color-name {
        font-weight: bold;
      }'),
       ('Greetings in English',
        'Elementary',
        'Урок о формальных и неформальных приветствиях, фразах для начала беседы и прощания.',
        'Практикуйте интонацию и используйте реальные сценарии общения.',
        '<section id="introduction" class="section-intro">
          <h2>Введение</h2>
          <p>
            На этом уроке мы разберем различные способы приветствия на английском языке: от формального «Good morning» до дружеского «Hey!». Вы научитесь правильно использовать фразы в зависимости от ситуации.
          </p>
          <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=60" alt="Handshake" class="intro-image" />
        </section>

        <section id="formal-greetings" class="section-greetings">
          <h2>Formal Greetings (Формальные приветствия)</h2>
          <ul class="greet-list">
            <li><strong>Good morning</strong> — Доброе утро (используется до полудня)</li>
            <li><strong>Good afternoon</strong> — Добрый день (от полудня до 6 вечера)</li>
            <li><strong>Good evening</strong> — Добрый вечер (после 6 вечера)</li>
            <li><strong>Hello</strong> — Здравствуйте (универсальное формальное приветствие)</li>
          </ul>
          <p>
            <strong>Пример диалога:</strong>
          </p>
          <div class="dialogue-box">
            <p><em>John:</em> Good morning, Ms. Smith. How are you today?</p>
            <p><em>Ms. Smith:</em> Good morning, John. I&apos;m doing well, thank you. And you?</p>
          </div>
          <p>
            <strong>Видео-пример:</strong>
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/WzgLYGyKnUc?si=IZevMW7ffTsze-lU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>

        <section id="informal-greetings" class="section-greetings">
          <h2>Informal Greetings (Неформальные приветствия)</h2>
          <ul class="greet-list">
            <li><strong>Hi</strong> — Привет</li>
            <li><strong>Hey / Hey there</strong> — Эй / Приветик</li>
            <li><strong>What’s up?</strong> — Как дела? (букв. «Что нового?»)</li>
            <li><strong>How’s it going?</strong> — Как идут дела?</li>
          </ul>
          <p>
            <strong>Пример диалога:</strong>
          </p>
          <div class="dialogue-box">
            <p><em>Anna:</em> Hey, Mike! What’s up?</p>
            <p><em>Mike:</em> Hi, Anna! Not much, just heading to the park. How about you?</p>
          </div>
          <p>
            <strong>Видео-пример:</strong>
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/WzgLYGyKnUc?si=KXmJZZluJhwNCxSm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>',
        '/* greetings.css */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Verdana", sans-serif;
        background-color: #f3f4f6;
        color: #2c2c2c;
        line-height: 1.6;
      }

      .section-intro {
        background-color: #fff;
        padding: 30px 20px;
        text-align: center;
      }

      .intro-image {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .section-greetings {
        padding: 30px 20px;
        background-color: #ffffff;
        margin-bottom: 20px;
      }

      .section-greetings h2 {
        font-size: 2rem;
        margin-bottom: 15px;
        color: #6a11cb;
      }

      .greet-list {
        list-style: none;
        margin-bottom: 20px;
      }

      .greet-list li {
        font-size: 1.1rem;
        margin-bottom: 8px;
      }

      .dialogue-box {
        background-color: #f9fafb;
        border-left: 4px solid #6a11cb;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
      }'),
       ('Advanced English Idiomatic Expressions',
        'C1-C2',
        'Урок по продвинутым идиоматическим выражениям, их значению и использованию в речи.',
        'Изучайте контекст и обращайте внимание на регистр. Старайтесь употреблять идиомы в устной речи.',
        '<section id="introduction" class="section-intro">
          <h2>Введение</h2>
          <p>
            Идиомы играют ключевую роль в носительном английском языке, особенно на продвинутых уровнях C1–C2. В этом уроке вы познакомитесь с выразительными фразами, которые сделают вашу речь более живой и естественной.
          </p>
          <p>
            Мы рассмотрим пять распространенных идиом, их происхождение, значение и примеры употребления.
          </p>
          <img src="https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=60" alt="Idioms Concept" class="intro-image" />
        </section>

        <section id="common-idioms" class="section-idioms">
          <h2>Five Common Idioms (Пять распространенных идиом)</h2>
          <ul class="idiom-list">
            <li>
              <h3>1. <em>Break the ice</em></h3>
              <p><strong>Значение:</strong> Начать разговор в непринужденной обстановке, чтобы снять напряжение.</p>
              <p><strong>Пример:</strong> At the party, John told a funny story to <strong>break the ice</strong> and everyone started laughing.</p>
              <img src="https://via.placeholder.com/400x200.png?text=Icebreaker" alt="Break the Ice" class="idiom-image" />
            </li>
            <li>
              <h3>2. <em>Once in a blue moon</em></h3>
              <p><strong>Значение:</strong> Очень редко.</p>
              <p><strong>Пример:</strong> I go to the cinema <strong>once in a blue moon</strong>, because I usually watch films at home.</p>
              <img src="https://via.placeholder.com/400x200.png?text=Blue+Moon" alt="Blue Moon" class="idiom-image" />
            </li>
            <li>
              <h3>3. <em>Hit the nail on the head</em></h3>
              <p><strong>Значение:</strong> Попасть в точку, точно описать ситуацию.</p>
              <p><strong>Пример:</strong> When Sarah said that the company needs more innovation, she really <strong>hit the nail on the head</strong>.</p>
              <img src="https://via.placeholder.com/400x200.png?text=Nail+on+Head" alt="Hit the Nail on the Head" class="idiom-image" />
            </li>
            <li>
              <h3>4. <em>Cost an arm and a leg</em></h3>
              <p><strong>Значение:</strong> Стоить очень дорого.</p>
              <p><strong>Пример:</strong> That designer dress <strong>cost an arm and a leg</strong>, but she bought it anyway.</p>
              <img src="https://via.placeholder.com/400x200.png?text=Expensive" alt="Cost an Arm and a Leg" class="idiom-image" />
            </li>
            <li>
              <h3>5. <em>Under the weather</em></h3>
              <p><strong>Значение:</strong> Плохо себя чувствовать.</p>
              <p><strong>Пример:</strong> I decided to stay home today because I am feeling <strong>under the weather</strong>.</p>
              <img src="https://via.placeholder.com/400x200.png?text=Under+Weather" alt="Under the Weather" class="idiom-image" />
            </li>
          </ul>
        </section>

        <section id="usage-examples" class="section-usage">
          <h2>Usage &amp; Examples (Употребление и примеры)</h2>
          <p>Чтобы лучше понять, как и когда использовать идиомы, рассмотрим примеры диалогов:</p>
          <div class="dialogue-box">
            <p><em>Emily:</em> I have to speak in front of 200 people tomorrow. I&apos;m so nervous.</p>
            <p><em>Mark:</em> Don&apos;t worry, just <strong>break the ice</strong> with a joke at the beginning, and they will relax.</p>
          </div>
          <div class="dialogue-box">
            <p><em>Paul:</em> Did you apply for that job?</p>
            <p><em>Lisa:</em> Yes, but who knows. <strong>Once in a blue moon</strong> do I get so many qualifications on my CV.</p>
          </div>
          <div class="dialogue-box">
            <p><em>Boss:</em> Why haven&apos;t you updated the report yet?</p>
            <p><em>Anna:</em> Because last night my computer crashed, and replacing it <strong>cost an arm and a leg</strong>.</p>
          </div>
          <p>Помимо разговорной речи, идиомы часто встречаются в СМИ и литературе. Посмотрите видео-обзор, где носители объясняют эти фразы:</p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Idioms Explained" frameborder="0" allowfullscreen></iframe>
        </section>',
        '/* idioms.css */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Segoe UI", sans-serif;
        background-color: #eef2f5;
        color: #2b2b2b;
        line-height: 1.6;
      }

      .section-intro {
        background-color: #fff;
        padding: 30px 20px;
        text-align: center;
        margin-bottom: 20px;
      }

      .intro-image {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .section-idioms {
        padding: 30px 20px;
        background-color: #ffffff;
        margin-bottom: 20px;
      }

      .section-idioms h2 {
        font-size: 2rem;
        margin-bottom: 15px;
        color: #11998e;
      }

      .idiom-list {
        list-style: none;
      }

      .idiom-list li {
        margin-bottom: 25px;
      }

      .idiom-list h3 {
        font-size: 1.3rem;
        margin-bottom: 8px;
        color: #333;
      }

      .idiom-image {
        width: 100%;
        max-width: 500px;
        margin-top: 10px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .section-usage {
        padding: 30px 20px;
        background-color: #ffffff;
        margin-bottom: 20px;
      }

      .dialogue-box {
        background-color: #f8fafb;
        border-left: 4px solid #11998e;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
      }');