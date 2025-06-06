import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/lessons');
  };

  return (
      <div className={styles.homeContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <img
              src="https://wallpapercave.com/wp/wp7406189.jpg"
              alt="Learning English"
              className={styles.heroImage}
          />
          <div className={styles.heroTextContainer}>
            <h1 className={`${styles.title} ${styles.fadeIn}`}>Добро пожаловать в SpeakUp!</h1>
            <p className={`${styles.subtitle} ${styles.fadeIn}`}>
              Начните свой путь к свободному владению английским уже сегодня.
            </p>
            <button onClick={handleStartLearning} className={`${styles.ctaButton} ${styles.fadeIn}`}>
              Начать учиться
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={`${styles.sectionTitle} ${styles.fadeIn}`}>Почему SpeakUp?</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.fadeIn}`}>
              <div className={styles.featureIcon}>📚</div>
              <h3 className={styles.featureTitle}>Интерактивные уроки</h3>
              <p className={styles.featureDescription}>
                Учитесь через игры, квизы и диалоги, которые делают процесс увлекательным.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.fadeIn}`}>
              <div className={styles.featureIcon}>🌍</div>
              <h3 className={styles.featureTitle}>Доступ 24/7</h3>
              <p className={styles.featureDescription}>
                Учитесь в любое время и в любом месте с доступом к материалам онлайн.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.fadeIn}`}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Персонализация</h3>
              <p className={styles.featureDescription}>
                Уроки подстраиваются под ваш уровень и цели обучения.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <h2 className={`${styles.sectionTitle} ${styles.fadeIn}`}>Как это работает</h2>
          <div className={styles.stepsContainer}>
            <div className={`${styles.step} ${styles.fadeIn}`}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Зарегистрируйтесь</h3>
              <p className={styles.stepDescription}>
                Создайте аккаунт за минуту и получите доступ ко всем материалам.
              </p>
            </div>
            <div className={`${styles.step} ${styles.fadeIn}`}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Пройдите тест</h3>
              <p className={styles.stepDescription}>
                Определите свой уровень английского с помощью нашего теста.
              </p>
            </div>
            <div className={`${styles.step} ${styles.fadeIn}`}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Учитесь</h3>
              <p className={styles.stepDescription}>
                Следуйте персональному плану и отслеживайте прогресс.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection}>
          <h2 className={`${styles.sectionTitle} ${styles.fadeIn}`}>Что говорят наши пользователи</h2>
          <div className={styles.testimonialsContainer}>
            <div className={`${styles.testimonialCard} ${styles.fadeIn}`}>
              <p className={styles.testimonialText}>
                "SpeakUp помог мне уверенно заговорить на английском за 3 месяца!"
              </p>
              <p className={styles.testimonialAuthor}>Анна, 28 лет</p>
            </div>
            <div className={`${styles.testimonialCard} ${styles.fadeIn}`}>
              <p className={styles.testimonialText}>
                "Уроки настолько увлекательные, что я жду их каждый день!"
              </p>
              <p className={styles.testimonialAuthor}>Михаил, 34 года</p>
            </div>
            <div className={`${styles.testimonialCard} ${styles.fadeIn}`}>
              <p className={styles.testimonialText}>
                "Платформа идеально подходит для занятых людей, всё просто и понятно."
              </p>
              <p className={styles.testimonialAuthor}>Екатерина, 22 года</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={`${styles.sectionTitle} ${styles.fadeIn}`}>Готовы начать?</h2>
          <p className={`${styles.sectionDescription} ${styles.fadeIn}`}>
            Присоединяйтесь к тысячам пользователей, которые уже улучшают свой английский с SpeakUp.
          </p>
          <button onClick={handleStartLearning} className={`${styles.ctaButton} ${styles.fadeIn}`}>
            Начать учиться
          </button>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <a href="/about">О нас</a>
            <a href="/contact">Контакты</a>
            <a href="/privacy">Политика конфиденциальности</a>
          </div>
          <p className={styles.footerText}>&copy; 2025 SpeakUp. Все права защищены.</p>
        </footer>
      </div>
  );
};

export default HomePage;