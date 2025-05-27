--liquibase formatted sql

--changeset Jules (AI Agent):2025-05-28--10-add_javascript_content_to_lessons
--comment: Add javascript_content column to lessons table
ALTER TABLE lessons
ADD COLUMN javascript_content TEXT;

--rollback ALTER TABLE lessons DROP COLUMN javascript_content;
