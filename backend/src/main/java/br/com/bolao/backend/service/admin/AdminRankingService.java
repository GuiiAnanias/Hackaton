package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.RankingLinhaDTO;
import br.com.bolao.backend.dto.admin.RankingPaginaDTO;
import br.com.bolao.backend.model.Perfil;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class AdminRankingService {

    private static final DateTimeFormatter DATA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final UsuarioRepository usuarioRepository;

    public AdminRankingService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<RankingLinhaDTO> listarRanking() {
        List<Usuario> usuariosOrdenados = listarUsuariosOrdenados();

        List<RankingLinhaDTO> ranking = new ArrayList<>();

        for (int i = 0; i < usuariosOrdenados.size(); i++) {
            Usuario usuario = usuariosOrdenados.get(i);

            ranking.add(new RankingLinhaDTO(
                    i + 1,
                    obterNome(usuario),
                    usuario.getPontuacaoTotal(),
                    usuario.getPlacaresExatos(),
                    formatarCriadoEm(usuario)
            ));
        }

        return ranking;
    }

    public List<Usuario> listarUsuariosOrdenados() {
        return usuarioRepository.findAll()
                .stream()
                .filter(Usuario::isAtivo)
                .filter(usuario -> usuario.getPerfil() == Perfil.USER)
                .sorted(criarOrdenacaoRanking())
                .toList();
    }

    public RankingPaginaDTO listarRankingPaginado(int page, int size) {
        List<RankingLinhaDTO> ranking = listarRanking();

        int tamanhoPagina = Math.max(size, 1);
        int totalUsuarios = ranking.size();
        int totalPaginas = calcularTotalPaginas(totalUsuarios, tamanhoPagina);
        int paginaAtual = ajustarPaginaAtual(page, totalPaginas);

        int inicio = paginaAtual * tamanhoPagina;
        int fim = Math.min(inicio + tamanhoPagina, totalUsuarios);

        List<RankingLinhaDTO> usuariosPagina = totalUsuarios == 0
                ? List.of()
                : ranking.subList(inicio, fim);

        boolean exibirTodas = totalPaginas <= 7;
        int inicioJanela = calcularInicioJanela(paginaAtual, totalPaginas, exibirTodas);
        int fimJanela = calcularFimJanela(paginaAtual, totalPaginas, exibirTodas);

        return new RankingPaginaDTO(
                usuariosPagina,
                paginaAtual,
                tamanhoPagina,
                totalPaginas,
                totalUsuarios,
                inicioJanela,
                fimJanela,
                exibirTodas,
                !exibirTodas && inicioJanela > 0,
                !exibirTodas && fimJanela < totalPaginas - 1
        );
    }

    private Comparator<Usuario> criarOrdenacaoRanking() {
        return Comparator
                .comparingInt(Usuario::getPontuacaoTotal)
                .reversed()
                .thenComparing(Comparator.comparingInt(Usuario::getPlacaresExatos).reversed())
                .thenComparing(Usuario::getCriadoEm, Comparator.nullsLast(Comparator.naturalOrder()));
    }

    private int calcularTotalPaginas(int totalUsuarios, int tamanhoPagina) {
        if (totalUsuarios == 0) {
            return 0;
        }

        return (int) Math.ceil((double) totalUsuarios / tamanhoPagina);
    }

    private int ajustarPaginaAtual(int page, int totalPaginas) {
        if (totalPaginas == 0) {
            return 0;
        }

        if (page < 0) {
            return 0;
        }

        if (page >= totalPaginas) {
            return totalPaginas - 1;
        }

        return page;
    }

    private int calcularInicioJanela(int paginaAtual, int totalPaginas, boolean exibirTodas) {
        if (totalPaginas == 0 || exibirTodas) {
            return 0;
        }

        if (paginaAtual <= 2) {
            return 0;
        }

        if (paginaAtual >= totalPaginas - 3) {
            return Math.max(0, totalPaginas - 5);
        }

        return Math.max(0, paginaAtual - 2);
    }

    private int calcularFimJanela(int paginaAtual, int totalPaginas, boolean exibirTodas) {
        if (totalPaginas == 0) {
            return 0;
        }

        if (exibirTodas) {
            return totalPaginas - 1;
        }

        if (paginaAtual <= 2) {
            return Math.min(totalPaginas - 1, 4);
        }

        if (paginaAtual >= totalPaginas - 3) {
            return totalPaginas - 1;
        }

        return Math.min(totalPaginas - 1, paginaAtual + 2);
    }

    private String obterNome(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            return "Usuário sem nome";
        }

        return usuario.getNome();
    }

    private String formatarCriadoEm(Usuario usuario) {
        LocalDateTime criadoEm = usuario.getCriadoEm();

        if (criadoEm == null) {
            return "-";
        }

        return criadoEm.format(DATA_FORMATTER);
    }
}
