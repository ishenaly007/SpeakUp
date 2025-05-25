import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import Chat from './pages/Chat'
// import Home from './pages/Home'
import LessonDetail from './pages/LessonsDetail'
import Lessons from './pages/Lessons'
import Login from './pages/Login'
import Profile from './pages/Profile'
import QuizResults from './pages/QuizResults'
import QuizStart from './pages/QuizStart'
import Register from './pages/Register'

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route
						path='/profile'
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
					<Route
						path='/lessons'
						element={
							<PrivateRoute>
								<Lessons />
							</PrivateRoute>
						}
					/>
					<Route
						path='/lessons/:lessonId'
						element={
							<PrivateRoute>
								<LessonDetail />
							</PrivateRoute>
						}
					/>
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
					<Route
						path='/quiz/start'
						element={
							<PrivateRoute>
								<QuizStart />
							</PrivateRoute>
						}
					/>
					<Route
						path='/quiz/results'
						element={
							<PrivateRoute>
								<QuizResults />
							</PrivateRoute>
						}
					/>
					<Route
						path='/chat'
						element={
							<PrivateRoute>
								<Chat />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
