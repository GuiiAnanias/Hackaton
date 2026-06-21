package br.com.bolao.backend.dto.admin;

public record PartidaAdminDTO(
        Long id,
        String selecaoA,
        String selecaoB,
        String fase,
        String dataHora,
        String status,
        String resultado
) {
}