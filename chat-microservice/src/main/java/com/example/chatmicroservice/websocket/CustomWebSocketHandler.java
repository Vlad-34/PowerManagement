package com.example.chatmicroservice.websocket;

import jakarta.annotation.Nonnull;
import org.json.JSONObject;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

public class CustomWebSocketHandler extends TextWebSocketHandler {

    private final Map<WebSocketSession, List<String>> sessions = new HashMap<>();

    public void afterConnectionEstablished(@Nonnull WebSocketSession session) {
        List<String> queryParam = List.of(Objects.requireNonNull(session.getUri()).getQuery().split("[=&]"));
        String from = queryParam.get(1);
        String role = queryParam.get(7);
        List<String> values = new ArrayList<>();
        values.add(from);
        values.add(role);
        if(!sessions.containsValue(values)) {
            sessions.put(session, values);
            try {
                session.sendMessage(new TextMessage(convertMessage("server", from, "assigned", "ROLE_ADMIN", "server").toString()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            for (Map.Entry<WebSocketSession, List<String>> assigned : sessions.entrySet()) {
                for (Map.Entry<WebSocketSession, List<String>> assignee : sessions.entrySet()) {
                    if ((assigned.getKey().equals(session) || assignee.getKey().equals(session)) && (assigned.getValue().get(1).equals("ROLE_ADMIN") && assignee.getValue().get(1).equals("ROLE_CLIENT") || assigned.getValue().get(1).equals("ROLE_CLIENT") && assignee.getValue().get(1).equals("ROLE_ADMIN"))) {
                        try {
                            assigned.getKey().sendMessage(new TextMessage(convertMessage(assignee.getValue().get(0), assigned.getValue().getFirst(), "assigned", assignee.getValue().get(1), assignee.getValue().get(0)).toString()));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }
            }
        }
    }

    private static final CustomWebSocketHandler handler = new CustomWebSocketHandler();
    private CustomWebSocketHandler(){}

    public static CustomWebSocketHandler getInstance(){
        return handler;
    }

    @Override
    public void afterConnectionClosed(@Nonnull WebSocketSession session, @Nonnull CloseStatus status) {
        sessions.remove(session);
    }

    private JSONObject convertMessage(String from, String to, String status, String role, String content){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("from", from);
        jsonObject.put("to", to);
        jsonObject.put("status", status);
        jsonObject.put("role", role);
        jsonObject.put("content", content);
        return jsonObject;
    }

    public void sendMessageToOne(String from, String to, String status, String role, String message) {
        for (Map.Entry<WebSocketSession, List<String>> entry : sessions.entrySet())
            if(entry.getValue().getFirst().equals(to)){
                try {
                    entry.getKey().sendMessage(new TextMessage(convertMessage(from, to, status, role, message).toString()));
                } catch (Exception e) {
                    System.out.println("Send message from server via WebSocket failed");
                }
            }
    }

    @Override
    public void handleMessage(@Nonnull WebSocketSession session, @Nonnull WebSocketMessage<?> message) {
        JSONObject messageConverted = new JSONObject(message.getPayload().toString());
        String from = messageConverted.getString("from");
        String to = messageConverted.getString("to");
        String status = messageConverted.getString("status");
        String role = messageConverted.getString("role");
        String content = messageConverted.getString("content");
        if(to.isEmpty()) to = content;
        sendMessageToOne(from, to, status, role, content);
    }

    public void handleMessageFromServer(String message, String userMail) {
        sendMessageToOne("server", userMail, "content", "ROLE_MANAGER", message);
    }
}