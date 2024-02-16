package com.example.monitoringmicroservice.consumer;
import com.example.monitoringmicroservice.dto.SensorData;
import com.example.monitoringmicroservice.repo.SensorRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitmqConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitmqConsumer.class);
    private final SensorRepo sensorRepo;

    @RabbitListener(queues = {"${spring.rabbitmq.queue.name}"})
    public void consume(SensorData sensorData) {
        sensorRepo.save(sensorData);
        LOGGER.info(sensorData.toString());
    }
}