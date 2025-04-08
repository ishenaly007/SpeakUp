package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.UserWord;
import com.abit8.speakupengbot.db.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserWordRepository extends JpaRepository<UserWord, Long> {
    long countByUser(User user);
    boolean existsByUserAndWord(User user, Word word);
}