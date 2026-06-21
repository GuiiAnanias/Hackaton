package br.com.bolao.backend.dto.palpite;

import java.time.LocalDateTime;

public record PalpiteResponseDTO(
        Long id,
        Long usuarioId,
        String usuarioNome,
        Long partidaId,
        String selecaoMandante,
        String selecaoVisitante,
        Integer golsMandante,
        Integer golsVisitante,
        Integer pontos,
        String criterio,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}