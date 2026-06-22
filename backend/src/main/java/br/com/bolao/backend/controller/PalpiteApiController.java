package br.com.bolao.backend.controller;

import br.com.bolao.backend.model.Palpite;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import br.com.bolao.backend.service.PalpiteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/palpites")
public class PalpiteApiController {

    private final UsuarioRepository usuarioRepository;
    private final PalpiteService palpiteService;

    public PalpiteApiController(UsuarioRepository usuarioRepository,
                                PalpiteService palpiteService) {
        this.usuarioRepository = usuarioRepository;
        this.palpiteService = palpiteService;
    }

    @GetMapping("/me")
    public List<PalpiteResponse> listarMeus(Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);

        return palpiteService.listarDoUsuario(usuario)
                .stream()
                .map(PalpiteResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PalpiteResponse> buscar(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);

        return ResponseEntity.ok(PalpiteResponse.from(palpiteService.buscarDoUsuario(id, usuario)));
    }

    @PostMapping
    public ResponseEntity<PalpiteResponse> criarOuAtualizar(@RequestBody PalpiteRequest request,
                                                            Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);
        Palpite palpite = palpiteService.criarOuAtualizarDoUsuario(
                usuario,
                request.partidaId(),
                request.golsMandante(),
                request.golsVisitante());

        return ResponseEntity.ok(PalpiteResponse.from(palpite));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PalpiteResponse> atualizar(@PathVariable Long id,
                                                     @RequestBody PalpiteUpdateRequest request,
                                                     Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);
        Palpite palpite = palpiteService.atualizarDoUsuario(
                usuario,
                id,
                request.golsMandante(),
                request.golsVisitante());

        return ResponseEntity.ok(PalpiteResponse.from(palpite));
    }

    private Usuario usuarioLogado(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado");
        }

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao encontrado"));

        if (!usuario.isAtivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario desativado");
        }

        return usuario;
    }

    public record PalpiteRequest(Long partidaId, Integer golsMandante, Integer golsVisitante) {
    }

    public record PalpiteUpdateRequest(Integer golsMandante, Integer golsVisitante) {
    }

    public record PalpiteResponse(
            Long id,
            Long partidaId,
            String mandante,
            String visitante,
            LocalDateTime dataHora,
            Integer golsMandante,
            Integer golsVisitante,
            Integer pontos,
            String statusPartida,
            String criterio
    ) {
        static PalpiteResponse from(Palpite palpite) {
            Partida partida = palpite.getPartida();

            return new PalpiteResponse(
                    palpite.getId(),
                    partida.getId(),
                    partida.getSelecaoMandante().getNome(),
                    partida.getSelecaoVisitante().getNome(),
                    partida.getDataHora(),
                    palpite.getGolsMandante(),
                    palpite.getGolsVisitante(),
                    palpite.getPontos(),
                    partida.getStatus(),
                    palpite.getCriterio() == null ? null : palpite.getCriterio().name()
            );
        }
    }
}
