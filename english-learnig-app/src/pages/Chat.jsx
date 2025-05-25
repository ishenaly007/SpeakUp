import { useEffect, useState } from 'react';
import { getChatHistory, sendMessage } from '../api/chat';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  const fetchHistory = () => {
    getChatHistory(user.userId, user.token)
      .then((res) => setHistory(res.data))
      .catch(() => alert('Ошибка загрузки истории чата'));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = { userId: user.userId, message };

    try {
      const res = await sendMessage(newMessage, user.token);
      setHistory((prev) => [...prev, { sender: 'user', text: message }, { sender: 'bot', text: res.data.reply }]);
      setMessage('');
    } catch {
      alert('Ошибка отправки сообщения');
    }
  };

  return (
    <div>
      <h2>Чат</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'auto', marginBottom: 10 }}>
        {history.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.sender === 'user' ? 'Вы' : 'Бот'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
          style={{ width: '80%' }}
        />
        <button type="submit" style={{ width: '18%' }}>Отправить</button>
      </form>
    </div>
  );
};

export default Chat;
