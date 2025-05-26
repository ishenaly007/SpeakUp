import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToAI, fetchChatHistory } from '../services/chatService';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import styles from './Chat.module.scss';

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
      <div className={styles.chatContainer}>
        <div className={styles.instructions}>
          <h2>Чат с ИИ</h2>
          <p>Это чат с ИИ. Задавайте вопросы на английском или русском, просите объяснить грамматику, или просто пообщайтесь! ИИ постарается вам помочь и поддержать в изучении языка.</p>
        </div>

        {loadingHistory && <p className={styles.loadingText}>Loading chat history...</p>}
        {error && <p className={styles.errorText}>Error: {error}</p>}

        <div className={styles.messagesArea}>
          {messages.length === 0 && !loadingHistory && (
              <p className={styles.noMessages}>No messages yet. Start the conversation!</p>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
              {msg.sender === 'ai' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <p>{msg.text}</p> 
              )}
              {/* Consider adding timestamp here if needed, styled appropriately */}
              {/* <span className={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span> */}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className={styles.inputArea}>
          <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sendingMessage || loadingHistory || !user}
          />
          <button type="submit" disabled={sendingMessage || loadingHistory || !newMessage.trim() || !user}>
            {sendingMessage ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
  );
};

export default ChatPage;