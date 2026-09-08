package com.cliniSys.gestionprets.controller;

import com.cliniSys.gestionprets.dto.ChatRequest;
import com.cliniSys.gestionprets.dto.ChatResponse;
import com.cliniSys.gestionprets.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reponse = chatService.repondre(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reponse));
    }
}