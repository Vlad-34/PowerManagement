package com.example.usersmicroservice.service;

import com.example.usersmicroservice.model.User;
import com.example.usersmicroservice.repo.IClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final IClientRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DeviceService deviceService;

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public ResponseEntity<User> getById(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if(user != null)
            return ResponseEntity.ok(user);
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<User> getByEmail(String email) {
        Optional<User> user = userRepository.getByEmail(email);
        if(user.isPresent())
            return ResponseEntity.ok(user.orElseThrow(
                    () -> new UsernameNotFoundException("Username not found."))
            );
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<User> add(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.created(URI.create("/user/" + user.getId())).body(user);
    }

    @Override
    public ResponseEntity<User> edit(Integer id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if(user != null) {
            user = User.builder()
                    .id(id)
                    .name(userDetails.getName().isEmpty() ? user.getName() : userDetails.getName())
                    .email(userDetails.getEmail().isEmpty() ? user.getEmail() : userDetails.getEmail())
                    .password(passwordEncoder.encode(userDetails.getPassword().isEmpty() ? user.getPassword() : userDetails.getPassword()))
                    .role((userDetails.getRole() == null) ? user.getRole() : userDetails.getRole())
                    .build();
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> delete(Integer id, String token) {
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()) {
            userRepository.deleteById(id);
            deviceService.deleteDevices(id, token);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}