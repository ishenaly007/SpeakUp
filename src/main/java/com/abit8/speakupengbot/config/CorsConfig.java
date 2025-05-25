package com.abit8.speakupengbot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost",
                        "http://localhost:3000",
                        "http://localhost:4200",
                        "http://localhost:8084",
                        "http://localhost:5500",
                        "http://127.0.0.1",
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:5500"
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
