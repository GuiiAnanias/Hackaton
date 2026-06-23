package br.com.bolao.backend.dto.admin;

public record SelecaoAdminDTO(
        Long id,
        String nome,
        String codigoFifa,
        String grupo,
        String bandeira
) {
}
