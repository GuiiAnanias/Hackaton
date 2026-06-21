package br.com.bolao.backend.dto.admin;

import java.time.LocalDate;

public record UsuarioRankingBaseDTO(
        String nome,
        int pontuacaoTotal,
        int placaresExatos,
        LocalDate criadoEm
) {
}