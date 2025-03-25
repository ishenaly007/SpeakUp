package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.SupportRequest;
import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.repository.SupportRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupportRequestService {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    public void saveSupportRequest(User user, String username, String requestText) {
        SupportRequest supportRequest = new SupportRequest(user, username, requestText);
        supportRequestRepository.save(supportRequest);
    }
}