package com.example.usersmicroservice.controller;

import com.example.usersmicroservice.model.User;
import com.example.usersmicroservice.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
@RequiredArgsConstructor
@CrossOrigin
public class ClientController {
    private final UserServiceImpl userService;

    @GetMapping("/getByEmail")
    @PreAuthorize("hasAnyAuthority('admin:read', 'client:read')")
    public ResponseEntity<User> getByEmail(@RequestParam String email) {
        return userService.getByEmail(email);
    }

}
