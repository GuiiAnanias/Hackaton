package br.com.bolao.backend.service.admin;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import br.com.bolao.backend.dto.admin.RankingLinhaDTO;
import br.com.bolao.backend.dto.admin.RankingPaginaDTO;

@Service
public class AdminRankingService {

    public RankingPaginaDTO listarRankingPaginado(int pagina, int tamanho) {
        List<RankingLinhaDTO> rankingCompleto = listarRanking();

        int tamanhoSeguro = Math.max(1, tamanho);
        int totalUsuarios = rankingCompleto.size();
        int totalPaginas = Math.max(1, (int) Math.ceil((double) totalUsuarios / tamanhoSeguro));
        int paginaSegura = Math.max(0, Math.min(pagina, totalPaginas - 1));

        int inicio = paginaSegura * tamanhoSeguro;
        int fim = Math.min(inicio + tamanhoSeguro, totalUsuarios);

        List<RankingLinhaDTO> usuarios = inicio >= totalUsuarios
                ? List.of()
                : rankingCompleto.subList(inicio, fim);

        boolean exibirTodas = totalPaginas <= 10;

        int inicioJanela;
        int fimJanela;

        if (exibirTodas) {
            inicioJanela = 0;
            fimJanela = totalPaginas - 1;
        } else {
            inicioJanela = Math.max(1, paginaSegura - 2);
            fimJanela = Math.min(totalPaginas - 2, paginaSegura + 2);

            if (paginaSegura <= 4) {
                inicioJanela = 1;
                fimJanela = 6;
            }

            if (paginaSegura >= totalPaginas - 5) {
                inicioJanela = totalPaginas - 7;
                fimJanela = totalPaginas - 2;
            }
        }

        boolean exibirReticenciasInicio = !exibirTodas && inicioJanela > 1;
        boolean exibirReticenciasFim = !exibirTodas && fimJanela < totalPaginas - 2;

        return new RankingPaginaDTO(
                usuarios,
                paginaSegura,
                tamanhoSeguro,
                totalPaginas,
                totalUsuarios,
                inicioJanela,
                fimJanela,
                exibirTodas,
                exibirReticenciasInicio,
                exibirReticenciasFim
        );
    }

    public List<RankingLinhaDTO> listarRanking() {
        List<UsuarioRankingMock> usuariosOrdenados = usuariosMock()
                .stream()
                .sorted(
                        Comparator.comparingInt(UsuarioRankingMock::pontuacaoTotal).reversed()
                                .thenComparing(Comparator.comparingInt(UsuarioRankingMock::placaresExatos).reversed())
                                .thenComparing(UsuarioRankingMock::criadoEm)
                )
                .toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return IntStream.range(0, usuariosOrdenados.size())
                .mapToObj(index -> {
                    UsuarioRankingMock usuario = usuariosOrdenados.get(index);

                    return new RankingLinhaDTO(
                            index + 1,
                            usuario.nome(),
                            usuario.pontuacaoTotal(),
                            usuario.placaresExatos(),
                            usuario.criadoEm().format(formatter)
                    );
                })
                .toList();
    }

    private List<UsuarioRankingMock> usuariosMock() {
        return List.of(
                new UsuarioRankingMock("Ana Silva", 150, 8, LocalDate.of(2026, 2, 10)),
                new UsuarioRankingMock("João Pereira", 150, 6, LocalDate.of(2026, 2, 8)),
                new UsuarioRankingMock("Bruno Costa", 150, 8, LocalDate.of(2026, 2, 5)),
                new UsuarioRankingMock("Marcos Lima", 135, 7, LocalDate.of(2026, 2, 15)),
                new UsuarioRankingMock("Carla Souza", 120, 5, LocalDate.of(2026, 2, 20)),
                new UsuarioRankingMock("Pedro Alves", 110, 4, LocalDate.of(2026, 2, 23)),
                new UsuarioRankingMock("Lucas Santos", 95, 3, LocalDate.of(2026, 3, 1)),
                new UsuarioRankingMock("Fernanda Rocha", 90, 3, LocalDate.of(2026, 3, 3)),
                new UsuarioRankingMock("Rafael Nunes", 85, 2, LocalDate.of(2026, 3, 5)),
                new UsuarioRankingMock("Juliana Martins", 80, 2, LocalDate.of(2026, 3, 7)),
                new UsuarioRankingMock("Gustavo Mendes", 75, 2, LocalDate.of(2026, 3, 10)),
                new UsuarioRankingMock("Camila Ferreira", 70, 1, LocalDate.of(2026, 3, 12))
        );
    }

    private record UsuarioRankingMock(
            String nome,
            int pontuacaoTotal,
            int placaresExatos,
            LocalDate criadoEm
    ) {
    }
}