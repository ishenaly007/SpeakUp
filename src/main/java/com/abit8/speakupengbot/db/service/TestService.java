package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.lesson.Test;
import com.abit8.speakupengbot.db.repository.TestRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {
    @Autowired
    private TestRepository testRepository;

    public List<Test> findByLessonId(Long lessonId) {
        return testRepository.findByLessonId(lessonId);
    }

    public Test save(Test test) {
        return testRepository.save(test);
    }
}