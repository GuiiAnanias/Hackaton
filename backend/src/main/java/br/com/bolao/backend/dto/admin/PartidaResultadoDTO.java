package br.com.bolao.backend.dto.admin;

public record PartidaResultadoDTO(
        Long id,
        String selecaoA,
        String selecaoB,
        String fase,
        String dataHora
) {
}