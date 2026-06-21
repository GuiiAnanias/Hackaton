package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.RankingLinhaDTO;
import br.com.bolao.backend.dto.admin.RankingPaginaDTO;
import br.com.bolao.backend.dto.admin.UsuarioRankingBaseDTO;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class AdminRankingService {

    private final AdminMockDataService adminMockDataService;

    public AdminRankingService(AdminMockDataService adminMockDataService) {
        this.adminMockDataService = adminMockDataService;
    }

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
        List<UsuarioRankingBaseDTO> usuariosOrdenados = adminMockDataService.listarUsuariosRanking()
                .stream()
                .sorted(
                        Comparator.comparingInt(UsuarioRankingBaseDTO::pontuacaoTotal).reversed()
                                .thenComparing(Comparator.comparingInt(UsuarioRankingBaseDTO::placaresExatos).reversed())
                                .thenComparing(UsuarioRankingBaseDTO::criadoEm)
                )
                .toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return IntStream.range(0, usuariosOrdenados.size())
                .mapToObj(index -> {
                    UsuarioRankingBaseDTO usuario = usuariosOrdenados.get(index);

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
}