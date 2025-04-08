package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.lesson.UserLesson;
import com.abit8.speakupengbot.db.repository.UserLessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserLessonService {
    @Autowired
    private UserLessonRepository userLessonRepository;

    public boolean existsByUserIdAndLessonId(Long userId, Long lessonId) {
        return userLessonRepository.existsByUser_IdAndLesson_Id(userId, lessonId);
    }

    public UserLesson save(UserLesson userLesson) {
        return userLessonRepository.save(userLesson);
    }
}
