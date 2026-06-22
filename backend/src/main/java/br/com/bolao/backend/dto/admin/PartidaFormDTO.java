package br.com.bolao.backend.dto.admin;

import java.time.LocalDateTime;

public record PartidaFormDTO(
        Long id,
        Long selecaoMandanteId,
        Long selecaoVisitanteId,
        LocalDateTime dataHora,
        String fase,
        String estadio,
        String grupo
) {
}