package br.com.bolao.backend.dto.partida;

public record PartidaPublicaDTO(
        Long id,
        String teamA,
        String teamB,
        String date,
        String dateISO,
        String phase,
        String status,
        String stadium,
        String group,
        Integer scoreA,
        Integer scoreB
) {
}