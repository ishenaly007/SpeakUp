ALTER TABLE lessons
ADD COLUMN telegraph_url VARCHAR(255),
ADD COLUMN html_content TEXT,
ADD COLUMN css_content TEXT;

alter table lessons
    owner to ishenaly;