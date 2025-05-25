import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.scss'

const Login = () => {
	const [form, setForm] = useState({ username: '', password: '' })
	const navigate = useNavigate()
	const { loginUser } = useAuth()

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const res = await login(form)
			loginUser(res.data)
			navigate('/profile')
		} catch (err) {
			alert('Ошибка входа', err)
		}
	}

	return (
		<div className={styles.wrapper}>
			<form onSubmit={handleSubmit}>
				<h2>Вход</h2>
				<input
					placeholder='Почта'
					value={form.email}
					onChange={e => setForm({ ...form, email: e.target.value })}
				/>
				<input
					placeholder='Пароль'
					type='password'
					value={form.password}
					onChange={e => setForm({ ...form, password: e.target.value })}
				/>
				<button type='submit'>Войти</button>
			</form>
		</div>
	)
}

export default Login
