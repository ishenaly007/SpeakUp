import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

const Register = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      alert('Ошибка регистрации: ' + err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Имя пользователя"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
