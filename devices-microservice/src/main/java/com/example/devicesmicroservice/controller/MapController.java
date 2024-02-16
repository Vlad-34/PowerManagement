package com.example.devicesmicroservice.controller;

import com.example.devicesmicroservice.dto.MapDto;
import com.example.devicesmicroservice.repo.MapRepo;
import com.example.devicesmicroservice.repo.TokenRepository;
import com.example.devicesmicroservice.service.MapService;
import com.example.devicesmicroservice.model.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
public class MapController {
    private final MapService mapService;
    private final TokenRepository tokenRepository;
    private final MapRepo mapRepo;

    @PostMapping("/map")
    public ResponseEntity<Map> add(
            @RequestHeader("Authorization") String token,
            @RequestBody MapDto map
    ) {
        tokenRepository.authorizeToken(token);
        return mapService.map(map, token);
    }

    @GetMapping("/getDevicesId")
    public ResponseEntity<List<Map>> getDevicesIdByUserId(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer id
    ) {
        tokenRepository.authorizeToken(token);
        return mapService.getDevicesIdByUserId(id);
    }

    @PostMapping("/deleteMaps")
    public ResponseEntity<Void> deleteMaps(
            @RequestHeader("Authorization") String token,
            @RequestBody Integer id
    ) {
        tokenRepository.authorizeToken(token);
        List<Map> maps = mapRepo.findMapByUserId(id);
        mapRepo.deleteAll(maps);
        return ResponseEntity.noContent().build();
    }
}
