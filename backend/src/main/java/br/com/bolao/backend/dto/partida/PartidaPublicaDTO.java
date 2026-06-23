package br.com.bolao.backend.dto.partida;

public record PartidaPublicaDTO(
        Long id,
        String mandante,
        String visitante,
        String codigoFifaMandante,
        String codigoFifaVisitante,
        String bandeiraMandante,
        String bandeiraVisitante,
        String dataHoraFormatada,
        String dataHora,
        String fase,
        String status,
        String estadio,
        String grupo,
        Integer golsMandante,
        Integer golsVisitante
) {
}
