package com.example.usersmicroservice.repo;

import com.example.usersmicroservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IClientRepository extends JpaRepository<User, Integer> {
    Optional<User> getByEmail(String email);
}
