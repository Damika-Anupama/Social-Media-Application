package com.pali.palindromebackend;

import com.pali.palindromebackend.service.Exception.GlobalExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PalindromeBackendApplication {

    public static void main(String[] args) {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(handler);
        SpringApplication.run(PalindromeBackendApplication.class, args);
    }
}
