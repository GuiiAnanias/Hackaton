package br.com.bolao.backend.dto.palpite;

public record PalpiteRequestDTO(
        Long usuarioId,
        Long partidaId,
        String golsMandante,
        String golsVisitante
) {
}