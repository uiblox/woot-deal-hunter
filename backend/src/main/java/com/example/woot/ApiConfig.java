package com.example.woot;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiConfig {
    @Bean
    WebMvcConfigurer cors(WootProperties props) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry r) {
                r.addMapping("/api/**").allowedOrigins(props.allowedOrigin()).allowedMethods("GET", "POST");
            }
        };
    }

    @RestControllerAdvice
    static class Errors {
        @ExceptionHandler(RestClientResponseException.class)
        ResponseEntity<String> upstream(RestClientResponseException e) {
            HttpStatus s = e.getStatusCode().value() == 429 ? HttpStatus.TOO_MANY_REQUESTS : HttpStatus.BAD_GATEWAY;
            return ResponseEntity.status(s).body("Woot API error: " + e.getStatusCode());
        }
    }
}
