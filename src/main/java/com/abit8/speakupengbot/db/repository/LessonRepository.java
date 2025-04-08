package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.lesson.Lesson;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    default List<Lesson> findAllSortedById() {
        return findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}