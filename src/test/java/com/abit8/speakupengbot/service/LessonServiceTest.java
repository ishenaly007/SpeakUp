package com.abit8.speakupengbot.service;

import com.abit8.speakupengbot.db.entity.UserProgress;
import com.abit8.speakupengbot.db.entity.lesson.Lesson;
import com.abit8.speakupengbot.db.repository.LessonRepository;
import com.abit8.speakupengbot.db.repository.UserProgressRepository;
import com.abit8.speakupengbot.db.service.LessonService;
import com.abit8.speakupengbot.dto.LessonDetailsResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @InjectMocks
    private LessonService lessonService;

    @Test
    void testGetLessonDetailsById_shouldIncludeJavascriptContent() {
        // Arrange
        Long lessonId = 1L;
        Long userId = 1L;
        String expectedJsContent = "console.log('Test JS Content');";
        String expectedHtmlContent = "<h1>Test HTML</h1>";
        String expectedCssContent = ".test { color: red; }";
        String expectedTitle = "Test Lesson Title";

        Lesson mockLesson = new Lesson();
        mockLesson.setId(lessonId);
        mockLesson.setTitle(expectedTitle);
        mockLesson.setLevel("Beginner");
        mockLesson.setDescription("Test Description");
        mockLesson.setHtmlContent(expectedHtmlContent);
        mockLesson.setCssContent(expectedCssContent);
        mockLesson.setJavascriptContent(expectedJsContent);
        mockLesson.setTests(new ArrayList<>()); // Assuming tests might be needed

        UserProgress mockUserProgress = new UserProgress();
        mockUserProgress.setUserId(userId);
        mockUserProgress.setLessonId(lessonId);
        mockUserProgress.setCompleted(true);

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(mockLesson));
        when(userProgressRepository.findByUserIdAndLessonId(userId, lessonId)).thenReturn(Optional.of(mockUserProgress));
        // If getLessonDetailsById also fetches all progress for a user to calculate overall progress or similar:
        // when(userProgressRepository.findByUserId(userId)).thenReturn(Collections.singletonList(mockUserProgress));

        // Act
        LessonDetailsResponse response = lessonService.getLessonDetailsById(lessonId, userId);

        // Assert
        assertNotNull(response);
        assertEquals(lessonId, response.getId());
        assertEquals(expectedTitle, response.getTitle());
        assertEquals(expectedHtmlContent, response.getHtmlContent());
        assertEquals(expectedCssContent, response.getCssContent());
        assertEquals(expectedJsContent, response.getJavascriptContent());
        assertTrue(response.getCompleted(), "Lesson should be marked as completed based on UserProgress");
    }
    
    @Test
    void testGetLessonDetailsById_whenLessonNotFound_shouldThrowException() {
        // Arrange
        Long lessonId = 2L;
        Long userId = 1L;
        when(lessonRepository.findById(lessonId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            lessonService.getLessonDetailsById(lessonId, userId);
        }, "Должно быть выброшено исключение, если урок не найден");
    }

    @Test
    void testGetLessonDetailsById_whenUserProgressNotFound_shouldMarkAsNotCompleted() {
        // Arrange
        Long lessonId = 3L;
        Long userId = 1L;
        Lesson mockLesson = new Lesson("Test Lesson 3", "Intermediate", "Description 3", null, null, "<p>HTML3</p>", "css3", "js3");
        mockLesson.setId(lessonId);
        mockLesson.setTests(new ArrayList<>());


        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(mockLesson));
        when(userProgressRepository.findByUserIdAndLessonId(userId, lessonId)).thenReturn(Optional.empty());

        // Act
        LessonDetailsResponse response = lessonService.getLessonDetailsById(lessonId, userId);

        // Assert
        assertNotNull(response);
        assertEquals(lessonId, response.getId());
        assertFalse(response.getCompleted(), "Lesson should be marked as not completed if UserProgress is not found");
        assertEquals("js3", response.getJavascriptContent());
    }
}
