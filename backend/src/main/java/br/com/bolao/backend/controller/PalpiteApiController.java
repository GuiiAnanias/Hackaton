package br.com.bolao.backend.controller;

import br.com.bolao.backend.model.Palpite;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.PartidaRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
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

    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;
    private final UsuarioRepository usuarioRepository;

    public PalpiteApiController(PalpiteRepository palpiteRepository,
                                PartidaRepository partidaRepository,
                                UsuarioRepository usuarioRepository) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/me")
    public List<PalpiteResponse> listarMeus(Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);

        return palpiteRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(PalpiteResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PalpiteResponse> buscar(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);

        return palpiteRepository.findById(id)
                .filter(palpite -> palpite.getUsuario().getId().equals(usuario.getId()))
                .map(PalpiteResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PalpiteResponse> criarOuAtualizar(@RequestBody PalpiteRequest request,
                                                            Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);
        if (request.partidaId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Partida e obrigatoria");
        }
        validarPlacar(request.golsMandante(), request.golsVisitante());

        Partida partida = partidaRepository.findById(request.partidaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida nao encontrada"));

        if (!"AGENDADA".equalsIgnoreCase(partida.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nao e possivel palpitar em partida encerrada");
        }

        Palpite palpite = palpiteRepository.findByUsuarioIdAndPartidaId(usuario.getId(), partida.getId())
                .orElseGet(Palpite::new);

        palpite.setUsuario(usuario);
        palpite.setPartida(partida);
        palpite.setGolsMandante(request.golsMandante());
        palpite.setGolsVisitante(request.golsVisitante());

        return ResponseEntity.ok(PalpiteResponse.from(palpiteRepository.save(palpite)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PalpiteResponse> atualizar(@PathVariable Long id,
                                                     @RequestBody PalpiteUpdateRequest request,
                                                     Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);
        validarPlacar(request.golsMandante(), request.golsVisitante());

        Palpite palpite = palpiteRepository.findById(id)
                .filter(p -> p.getUsuario().getId().equals(usuario.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Palpite nao encontrado"));

        if (!"AGENDADA".equalsIgnoreCase(palpite.getPartida().getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nao e possivel editar palpite de partida encerrada");
        }

        palpite.setGolsMandante(request.golsMandante());
        palpite.setGolsVisitante(request.golsVisitante());

        return ResponseEntity.ok(PalpiteResponse.from(palpiteRepository.save(palpite)));
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

    private void validarPlacar(Integer golsMandante, Integer golsVisitante) {
        if (golsMandante == null || golsVisitante == null || golsMandante < 0 || golsVisitante < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Placar invalido");
        }
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
            String statusPartida
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
                    partida.getStatus()
            );
        }
    }
}
