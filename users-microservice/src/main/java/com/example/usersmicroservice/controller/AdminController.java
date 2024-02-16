package com.example.usersmicroservice.controller;

import com.example.usersmicroservice.model.Token;
import com.example.usersmicroservice.model.User;
import com.example.usersmicroservice.repo.ITokenRepository;
import com.example.usersmicroservice.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {
    private final UserServiceImpl userService;
    private final ITokenRepository tokenRepository;

    @GetMapping("/get")
    @PreAuthorize("hasAuthority('admin:read')")
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/getById")
    @PreAuthorize("hasAuthority('admin:read')")
    public ResponseEntity<User> getById(@RequestParam Integer id) {
        return userService.getById(id);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('admin:create')")
    public ResponseEntity<User> add(@RequestBody User user) {
        return userService.add(user);
    }

    @PatchMapping("/edit")
    @PreAuthorize("hasAuthority('admin:update')")
    public ResponseEntity<User> edit(@RequestParam Integer id, @RequestBody User userDetails) {
        List<Token> tokens = tokenRepository.findAllValidTokenByUser(id);
        tokenRepository.deleteAll(tokens);
        return userService.edit(id, userDetails);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('admin:delete')")
    public ResponseEntity<Void> delete(
            @RequestParam Integer id,
            @RequestHeader("Authorization") String token
    ) {
        List<Token> tokens = tokenRepository.findAllValidTokenByUser(id);
        tokenRepository.deleteAll(tokens);
        return userService.delete(id, token);
    }
}
