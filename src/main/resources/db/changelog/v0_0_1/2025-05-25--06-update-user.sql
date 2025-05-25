ALTER TABLE users
    ADD COLUMN email VARCHAR(255) NOT NULL,
    ADD COLUMN password VARCHAR(255) NOT NULL,
    ADD CONSTRAINT uk_email UNIQUE (email);

alter table users
    owner to ishenaly;

ALTER TABLE users
    ALTER COLUMN telegram_chat_id DROP NOT NULL;