import api from './axios'

export const sendMessage = (message, token) => {
	api.post('/chat', message, {
		headers: { Authorization: `Bearer ${token}` },
	})
}

export const getChatHistory = (userId, token) => {
	api.get(`/chat/${userId}/history`, {
		headers: { Authorization: `Bearer ${token}` },
	})
}
