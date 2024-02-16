package com.example.devicesmicroservice.service;

import com.example.devicesmicroservice.dto.MapDto;
import com.example.devicesmicroservice.model.Map;
import com.example.devicesmicroservice.repo.MapRepo;
import com.example.devicesmicroservice.repo.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MapService {
    private final MapRepo mapRepo;
    private final TokenRepository request;

    public ResponseEntity<Map> map(MapDto mapDto, String token) {
        Map map = new Map();
        map.setDeviceId(mapDto.getDeviceId());
        map.setUserId(mapDto.getUserId());
        mapRepo.save(map);
        request.createSensor(map.getId(), mapDto.getUserMail(), token);
        return ResponseEntity.created(URI.create("/device/" + map.getId())).body(map);
    }

    public ResponseEntity<List<Map>> getDevicesIdByUserId(Integer userId) {
        return ResponseEntity.ok(mapRepo.findDeviceIdByUserId(userId));
    }
}
