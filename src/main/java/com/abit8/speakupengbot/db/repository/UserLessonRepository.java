package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.lesson.UserLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLessonRepository extends JpaRepository<UserLesson, Long> {
    boolean existsByUser_IdAndLesson_Id(Long userId, Long lessonId);
}