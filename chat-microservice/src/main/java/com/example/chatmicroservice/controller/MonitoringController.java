package com.example.chatmicroservice.controller;

import com.example.chatmicroservice.websocket.CustomWebSocketHandler;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/v1/chat")
public class MonitoringController {

    private final CustomWebSocketHandler socketHandler = CustomWebSocketHandler.getInstance();

    @Data
    @Getter
    public static class Chat {
        String message;
        String userMail;
    }

    @PostMapping()
    public ResponseEntity<String> handleMessages(
        Chat chat
    ) {
        socketHandler.handleMessageFromServer(chat.message, chat.userMail);
        return ResponseEntity.ok("");
    }
}
