import React from 'react';
import styles from './Contacts.module.scss';

const ContactsPage = () => {
  return (
    <div className={styles.contactsContainer}>
      <h1>Контакты</h1>
      <p>Свяжитесь с нами:</p>
      <ul>
        <li>Email: <a href="mailto:ishennarkozuev07@gmail.com">ishennarkozuev07@gmail.com</a></li>
        <li>Telegram: <a href="https://t.me/Ishenaly" target="_blank" rel="noopener noreferrer">@Ishenaly</a></li>
      </ul>
    </div>
  );
};

export default ContactsPage;
