package br.com.bolao.backend.dto.admin;

import java.util.List;

public record RankingPaginaDTO(
        List<RankingLinhaDTO> usuarios,
        int paginaAtual,
        int tamanhoPagina,
        int totalPaginas,
        long totalUsuarios,
        int inicioJanela,
        int fimJanela,
        boolean exibirTodas,
        boolean exibirReticenciasInicio,
        boolean exibirReticenciasFim
) {
}