package br.com.bolao.backend.controller;

import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import br.com.bolao.backend.service.admin.AdminRankingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/ranking")
public class RankingApiController {

    private final AdminRankingService adminRankingService;
    private final UsuarioRepository usuarioRepository;

    public RankingApiController(AdminRankingService adminRankingService, UsuarioRepository usuarioRepository) {
        this.adminRankingService = adminRankingService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public RankingResponse listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Authentication authentication
    ) {
        List<Usuario> usuarios = adminRankingService.listarUsuariosOrdenados();
        int tamanhoPagina = Math.max(size, 50);
        int totalUsuarios = usuarios.size();
        int totalPaginas = totalUsuarios == 0 ? 0 : (int) Math.ceil((double) totalUsuarios / tamanhoPagina);
        int paginaAtual = ajustarPagina(page, totalPaginas);
        Long usuarioLogadoId = buscarUsuarioLogadoId(authentication);

        int inicio = totalUsuarios == 0 ? 0 : paginaAtual * tamanhoPagina;
        int fim = Math.min(inicio + tamanhoPagina, totalUsuarios);

        List<RankingUsuarioResponse> pagina = new ArrayList<>();
        for (int i = inicio; i < fim; i++) {
            pagina.add(converter(usuarios.get(i), i + 1, usuarioLogadoId));
        }

        RankingUsuarioResponse usuarioLogado = null;
        if (usuarioLogadoId != null) {
            for (int i = 0; i < usuarios.size(); i++) {
                Usuario usuario = usuarios.get(i);
                if (usuario.getId().equals(usuarioLogadoId)) {
                    usuarioLogado = converter(usuario, i + 1, usuarioLogadoId);
                    break;
                }
            }
        }

        return new RankingResponse(pagina, usuarioLogado, paginaAtual, tamanhoPagina, totalPaginas, totalUsuarios);
    }

    private int ajustarPagina(int page, int totalPaginas) {
        if (totalPaginas == 0 || page < 0) {
            return 0;
        }

        if (page >= totalPaginas) {
            return totalPaginas - 1;
        }

        return page;
    }

    private Long buscarUsuarioLogadoId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }

        return usuarioRepository.findByEmail(authentication.getName())
                .filter(Usuario::isAtivo)
                .map(Usuario::getId)
                .orElse(null);
    }

    private RankingUsuarioResponse converter(Usuario usuario, int posicao, Long usuarioLogadoId) {
        return new RankingUsuarioResponse(
                posicao,
                usuario.getId(),
                usuario.getNome(),
                usuario.getPontuacaoTotal(),
                usuario.getPlacaresExatos(),
                usuario.getCriadoEm(),
                usuarioLogadoId != null && usuario.getId().equals(usuarioLogadoId)
        );
    }

    public record RankingResponse(
            List<RankingUsuarioResponse> usuarios,
            RankingUsuarioResponse usuarioLogado,
            int paginaAtual,
            int tamanhoPagina,
            int totalPaginas,
            int totalUsuarios
    ) {
    }

    public record RankingUsuarioResponse(
            int posicao,
            Long usuarioId,
            String nome,
            int pontuacaoTotal,
            int placaresExatos,
            LocalDateTime criadoEm,
            boolean destaque
    ) {
    }
}
