package com.cliniSys.gestionprets.dto;

public class ChatResponse {
    private String reponse;

    public ChatResponse() {}

    public ChatResponse(String reponse) {
        this.reponse = reponse;
    }

    public String getReponse() {
        return reponse;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }
}