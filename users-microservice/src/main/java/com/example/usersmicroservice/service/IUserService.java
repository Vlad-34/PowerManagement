package com.example.usersmicroservice.service;

import com.example.usersmicroservice.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IUserService {
    List<User> getAll();
    ResponseEntity<User> getById(Integer id);
    ResponseEntity<User> getByEmail(String email);
    ResponseEntity<User> add(User user);
    ResponseEntity<User> edit(Integer id, User userDetails);
    ResponseEntity<Void> delete(Integer id, String token);
}
