package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {

}