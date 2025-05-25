import { Link } from 'react-router-dom'
import styles from './Home.module.scss'

const Home = () => {
	return (
		<div className={styles.homeWrapper}>
			<h1>Добро пожаловать!</h1>
			<p>Пожалуйста, войдите или зарегистрируйтесь, чтобы начать.</p>
			<div className={styles.buttonGroup}>
				<Link to="/login" className={styles.btn}>Войти</Link>
				<Link to="/register" className={styles.btn}>Зарегистрироваться</Link>
			</div>
		</div>
	)
}

export default Home
