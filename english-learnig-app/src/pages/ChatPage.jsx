import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToAI, fetchChatHistory } from '../services/chatService';
import styles from './Chat.module.scss';
import { FaPaperPlane, FaComments } from 'react-icons/fa'; // Imported icons

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user?.id) {
      setError('User not authenticated. Please login.');
      setLoadingHistory(false);
      return;
    }

    setLoadingHistory(true);
    fetchChatHistory(user.id)
        .then(history => {
          const formattedHistory = history.map(item => ({
            id: new Date(item.createdAt).getTime(),
            text: item.message,
            sender: item.isUserMessage ? 'user' : 'ai',
            timestamp: item.createdAt,
          })); // Не реверсируем, так как бэкенд возвращает новые сообщения первыми
          setMessages(formattedHistory);
          setError(null);
        })
        .catch(err => {
          console.error('Failed to load chat history:', err);
          setMessages([]); // Устанавливаем пустой массив при ошибке
          setError('Failed to load chat history. You can still send messages.');
        })
        .finally(() => {
          setLoadingHistory(false);
        });
  }, [user?.id]); // Зависимость только от user.id

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || sendingMessage) return;

    const userMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, userMsg]);
    const currentMessage = newMessage;
    setNewMessage('');
    setSendingMessage(true);
    setError(null);

    try {
      const aiResponse = await sendMessageToAI(user.id, currentMessage);
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponse.message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, aiMsg]);
    } catch (err) {
      setError(err.message || 'AI is not responding. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
      <div className={`${styles.animatedBackground}`}> {/* ADDED animatedBackground CLASS HERE */}
        <div className={styles.chatContainer}> {/* This is now the inner container for chat content */}
        <div className={styles.instructions}>
          <h2><FaComments /> Чат с ИИ</h2>
          <p>Это чат с искусственным интеллектом. Задавайте вопросы на английском или русском языке, просите объяснить грамматику или просто общайтесь! ИИ постарается помочь и поддержать вас в изучении языка.</p>
        </div>

        {loadingHistory && <p className={styles.loadingText}>Загрузка истории чата...</p>}
        {/* Error display: If error is just a string, it's shown. If it might be an object, ensure error.message is used if applicable */}
        {error && <p className={styles.errorText}>{typeof error === 'string' ? error : error.message || 'An error occurred.'}</p>}


        <div className={styles.messagesArea}>
          {messages.length === 0 && !loadingHistory && !error && ( // Also check for no error before showing "no messages"
              <p className={styles.noMessages}>Сообщений пока нет. Начните диалог!</p>
          )}
          {messages.map(msg => (
              <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                <p>{msg.text}</p>
                {/* Optional: Display timestamp if available and desired */}
                {/* msg.timestamp && <span className={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span> */}
              </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className={styles.inputArea}>
          <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите ваше сообщение..."
              disabled={sendingMessage || loadingHistory || !user?.id} // Check user.id for robustness
          />
          <button
              type="submit"
              disabled={sendingMessage || loadingHistory || !newMessage.trim() || !user?.id} // Check user.id
              aria-label={sendingMessage ? 'Отправка сообщения' : 'Отправить сообщение'} // Accessibility
          >
            {sendingMessage ? 'Отправка...' : <FaPaperPlane />} {/* Icon for Send */}
          </button>
        </form>
        </div>
      </div>
  );
};

export default ChatPage;