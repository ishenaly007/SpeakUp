//package com.abit8.speakupengbot.web.controller;
//
//import com.abit8.speakupengbot.db.service.QuizService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/quiz")
//public class QuizController {
//
//    @Autowired
//    private QuizService quizService;
//
//    @GetMapping("/start")
//    public ResponseEntity<QuizService.QuizStartResponse> startQuiz() {
//        QuizService.QuizStartResponse response = quizService.getQuizQuestions();
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/finish")
//    public ResponseEntity<QuizService.QuizFinishResponse> finishQuiz(@RequestBody List<QuizService.QuizAnswerDto> userAnswers) {
//        QuizService.QuizFinishResponse response = quizService.finishQuiz(userAnswers);
//        return ResponseEntity.ok(response);
//    }
//}