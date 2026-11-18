package com.example.woot;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "woot")
public record WootProperties(String baseUrl, String apiKey, int cacheSeconds, String allowedOrigin) {}
