package br.com.bolao.backend.dto.admin;

public record RankingLinhaDTO(
        int posicao,
        String nome,
        int pontuacaoTotal,
        int placaresExatos,
        String criadoEm
) {
}