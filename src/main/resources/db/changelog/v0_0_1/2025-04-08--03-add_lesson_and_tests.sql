CREATE TABLE lessons
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    level       VARCHAR(10)  NOT NULL,
    description TEXT         NOT NULL,
    note        TEXT
);

alter table lessons
    owner to ishenaly;

CREATE TABLE tests
(
    id             SERIAL PRIMARY KEY,
    lesson_id      INTEGER      NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    question       TEXT         NOT NULL,
    correct_option VARCHAR(255) NOT NULL
);

alter table tests
    owner to ishenaly;

CREATE TABLE test_options
(
    test_id INTEGER NOT NULL REFERENCES tests (id) ON DELETE CASCADE,
    option  TEXT    NOT NULL
);

ALTER TABLE test_options
    OWNER TO ishenaly;

CREATE TABLE user_lessons
(
    id           SERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    lesson_id    INTEGER      NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    completed_at TIMESTAMP
);

ALTER TABLE user_lessons
    OWNER TO ishenaly;


ALTER TABLE lessons
    ADD COLUMN telegraph_url VARCHAR(255),
ADD COLUMN html_content TEXT,
ADD COLUMN css_content TEXT;

alter table lessons
    owner to ishenaly;