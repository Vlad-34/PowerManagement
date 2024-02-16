package com.example.usersmicroservice.service;

import com.example.usersmicroservice.dto.AuthenticationResponse;
import com.example.usersmicroservice.dto.LoginRequest;
import com.example.usersmicroservice.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface IAuthenticationService {
    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws Exception;
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse login(LoginRequest request);
    ResponseEntity<Boolean> authenticateToken(String httpToken) throws Exception;
}
