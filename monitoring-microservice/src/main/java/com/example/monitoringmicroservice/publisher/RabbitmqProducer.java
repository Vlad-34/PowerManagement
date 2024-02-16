package com.example.monitoringmicroservice.publisher;

import com.example.monitoringmicroservice.dto.SensorData;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
@RequiredArgsConstructor
public class RabbitmqProducer {
    @Value("${spring.rabbitmq.exchange.name}")
    private String exchange;

    @Value("${spring.rabbitmq.routing_key.name}")
    private String routingKey;

    private final RabbitTemplate amqpTemplate;
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitmqProducer.class);

    public void sendMessage(SensorData sensorData){
        amqpTemplate.convertAndSend(exchange, routingKey, sensorData);
    }
}
