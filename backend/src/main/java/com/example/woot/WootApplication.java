package com.example.woot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class WootApplication {
    public static void main(String[] args) {
        SpringApplication.run(WootApplication.class, args);
    }
}
