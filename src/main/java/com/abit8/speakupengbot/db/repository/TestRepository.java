package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.lesson.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByLessonId(Long lessonId);
}