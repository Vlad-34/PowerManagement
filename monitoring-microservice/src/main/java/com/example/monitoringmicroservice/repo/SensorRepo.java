package com.example.monitoringmicroservice.repo;
import com.example.monitoringmicroservice.dto.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SensorRepo extends JpaRepository<SensorData, Integer> {
    @Query("SELECT sd FROM SensorData sd WHERE sd.sensorId IN :sensorIds AND sd.date = :date")
    List<SensorData> getSensorDataBySensorId(List<Integer> sensorIds, String date);

    @Query("SELECT sd FROM SensorData sd WHERE sd.sensorId = :id")
    List<SensorData> getBySensorId(Integer id);
}