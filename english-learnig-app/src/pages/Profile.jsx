import { useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        const data = await getProfile(user.userId, user.token);
        setProfile(data.data || data);
      } catch (err) {
        alert('Ошибка при загрузке профиля', err);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Профиль</h2>
      <p><strong>Имя пользователя:</strong> {profile.username}</p>
      <p><strong>Уровень:</strong> {profile.level}</p>
      <button onClick={logoutUser}>Выйти</button>
    </div>
  );
};

export default Profile;
