package br.com.bolao.backend.dto.auth;

public record LoginResponse(
        String token,
        String tipo,
        Long id,
        String nome,
        String perfil
) {
}