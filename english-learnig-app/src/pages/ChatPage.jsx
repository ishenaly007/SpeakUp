import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToAI, fetchChatHistory } from '../services/chatService';
import styles from './Chat.module.scss'; // Create this file

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null); // For auto-scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll when new messages are added

  useEffect(() => {
    if (user?.id) {
      setLoadingHistory(true);
      fetchChatHistory(user.id)
        .then(history => {
          // Backend sends newest first, map to a common format, then reverse for display (oldest first)
          const formattedHistory = history.map(item => ({
            id: new Date(item.createdAt).getTime(), // Create a unique ID from timestamp
            text: item.message,
            sender: item.isUserMessage ? 'user' : 'ai',
            timestamp: item.createdAt,
          })).reverse(); // Reverse to show oldest messages first
          setMessages(formattedHistory);
          setError(null);
        })
        .catch(err => {
          setError(err.message || 'Failed to load chat history.');
          console.error(err);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    } else if (!user && !loadingHistory) { // Only set error if not already loading auth
        setError('User not authenticated. Please login.');
        setLoadingHistory(false);
    }
  }, [user, loadingHistory]); // Added loadingHistory to dependencies to avoid loop if user is null initially

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
    const currentMessage = newMessage; // Capture current message before clearing
    setNewMessage('');
    setSendingMessage(true);
    setError(null);

    try {
      const aiResponse = await sendMessageToAI(user.id, currentMessage); // Use captured message
      const aiMsg = {
        id: Date.now() + 1, // Ensure unique ID
        text: aiResponse.message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, aiMsg]);
    } catch (err) {
      setError(err.message || 'AI is not responding. Please try again.');
      // Optionally, remove the user's message or mark it as failed
      // Revert optimistic update by removing userMsg if AI call fails:
      // setMessages(prevMessages => prevMessages.filter(msg => msg.id !== userMsg.id));
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
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
            <p>{msg.text}</p>
            {/* Optional: Display timestamp */}
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
