package com.example.monitoringmicroservice.publisher;

import com.example.monitoringmicroservice.dto.Map;
import com.example.monitoringmicroservice.dto.SensorData;
import com.example.monitoringmicroservice.dto.SensorDto;
import com.example.monitoringmicroservice.repo.Request;
import lombok.Data;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Scanner;

@Data
public class SensorThread implements Runnable{
    private final String userMail;
    private final Integer mappingId;
    private final Scanner scanner;
    private boolean running;

    private final Request request = new Request();

    public SensorThread(Map mapping){
        this.running = false;
        this.userMail = mapping.getUserMail();
        this.mappingId = mapping.getMappingId();
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("sensor.csv");
        if (inputStream == null) {
            throw new RuntimeException("File not recognized");
        }
        this.scanner = new Scanner(inputStream);
        scanner.useDelimiter("\n");
    }

    @Override
    public void run() {
        while(scanner.hasNext()){
            double value = Math.round(Double.parseDouble(scanner.nextLine()) * 100.0) / 100.0;
            try {
                Thread.sleep(20000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            LocalTime localTime = LocalTime.now();
            SensorData sensorData = new SensorDto(mappingId, userMail, value, localTime.getHour() + ":" + (localTime.getMinute() < 10 ? ("0" + localTime.getMinute()) : localTime.getMinute()), LocalDate.now().format(DateTimeFormatter.ofPattern("E MMM dd yyyy", Locale.ENGLISH))).map();
            request.sendSensorData(sensorData, userMail);
        }
        Thread.currentThread().interrupt();
    }

    public void interrupt() {
        Thread.currentThread().interrupt();
    }
}
