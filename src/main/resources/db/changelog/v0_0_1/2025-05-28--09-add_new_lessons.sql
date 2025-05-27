--liquibase formatted sql

--changeset Jules (AI Agent):2025-05-28--09-add_new_lessons
--comment: Add 10 new lessons

INSERT INTO lessons (title, level, description, note, telegraph_url, html_content, css_content) VALUES
('The Magic of Colors', 'Beginner', 'Explore the vibrant world of colors and how they make our world beautiful.', 'Focus on primary and secondary colors.', '', '<h1>The Magic of Colors</h1><p>Content coming soon...</p>', '/* The Magic of Colors styles coming soon */'),
('Journey Through Space', 'Intermediate', 'Embark on an exciting journey through our solar system and beyond.', '', '', '<h1>Journey Through Space</h1><p>Content coming soon...</p>', '/* Journey Through Space styles coming soon */'),
('The Art of Storytelling', 'Advanced', 'Learn the techniques of crafting compelling narratives and engaging your audience.', 'Includes character development and plot structure.', '', '<h1>The Art of Storytelling</h1><p>Content coming soon...</p>', '/* The Art of Storytelling styles coming soon */'),
('Mysteries of the Deep Sea', 'Intermediate', 'Dive into the depths of the ocean and discover its hidden wonders and creatures.', '', '', '<h1>Mysteries of the Deep Sea</h1><p>Content coming soon...</p>', '/* Mysteries of the Deep Sea styles coming soon */'),
('Ancient Civilizations', 'Advanced', 'Uncover the secrets of past civilizations and their impact on our world.', 'Covers Egypt, Rome, and Maya.', '', '<h1>Ancient Civilizations</h1><p>Content coming soon...</p>', '/* Ancient Civilizations styles coming soon */'),
('The World of Music', 'Beginner', 'Discover different musical instruments and the joy of making music.', '', '', '<h1>The World of Music</h1><p>Content coming soon...</p>', '/* The World of Music styles coming soon */'),
('Poetry in Motion', 'Intermediate', 'Explore the beauty of poetry and learn to express yourself through verse.', 'Focus on different poetic forms.', '', '<h1>Poetry in Motion</h1><p>Content coming soon...</p>', '/* Poetry in Motion styles coming soon */'),
('Nature''s Wonders', 'Beginner', 'Learn about the amazing plants and animals that share our planet.', '', '', '<h1>Nature''s Wonders</h1><p>Content coming soon...</p>', '/* Nature''s Wonders styles coming soon */'),
('The Power of Dreams', 'Advanced', 'Delve into the subconscious mind and the significance of dreams.', 'Explores dream interpretation and psychology.', '', '<h1>The Power of Dreams</h1><p>Content coming soon...</p>', '/* The Power of Dreams styles coming soon */'),
('Adventures in Cooking', 'Beginner', 'Learn basic cooking skills and create delicious dishes from around the world.', 'Simple recipes for kids.', '', '<h1>Adventures in Cooking</h1><p>Content coming soon...</p>', '/* Adventures in Cooking styles coming soon */');
--rollback DELETE FROM lessons WHERE title IN ('The Magic of Colors', 'Journey Through Space', 'The Art of Storytelling', 'Mysteries of the Deep Sea', 'Ancient Civilizations', 'The World of Music', 'Poetry in Motion', 'Nature''s Wonders', 'The Power of Dreams', 'Adventures in Cooking');
