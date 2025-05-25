import { useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Profile.module.scss';

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.id, user.token);
        setProfile(data.data || data);
      } catch (err) {
        alert('Ошибка при загрузке профиля: ' + err.message);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div className={styles.wrapper}>
      <h2>Профиль</h2>
      <p><strong>Имя пользователя:</strong> {profile.username}</p>
      <p><strong>Уровень:</strong> {profile.level || 'Не указан'}</p>

      <nav className={styles.nav}>
        <Link to="/quiz/start" className={styles.link}>Начать Квиз</Link>
        <Link to="/quiz/results" className={styles.link}>Результаты Квиза</Link>
        <Link to="/lessons" className={styles.link}>Уроки</Link>
        <Link to="/chat" className={styles.link}>Чаты</Link>
      </nav>

      <button className={styles.logoutBtn} onClick={logoutUser}>Выйти</button>
    </div>
  );
};

export default Profile;
