package br.com.bolao.backend.controller;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.repository.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/partidas")
public class PartidaApiController {

    private final PartidaRepository partidaRepository;

    public PartidaApiController(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }

    @GetMapping
    public List<PartidaResponse> listar() {
        return partidaRepository.findAll()
                .stream()
                .map(PartidaResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartidaResponse> buscar(@PathVariable Long id) {
        return partidaRepository.findById(id)
                .map(PartidaResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record PartidaResponse(
            Long id,
            String mandante,
            String visitante,
            LocalDateTime dataHora,
            String fase,
            String estadio,
            String grupo,
            Integer golsMandante,
            Integer golsVisitante,
            String status
    ) {
        static PartidaResponse from(Partida partida) {
            return new PartidaResponse(
                    partida.getId(),
                    partida.getSelecaoMandante().getNome(),
                    partida.getSelecaoVisitante().getNome(),
                    partida.getDataHora(),
                    partida.getFase(),
                    partida.getEstadio(),
                    partida.getGrupo(),
                    partida.getGolsMandante(),
                    partida.getGolsVisitante(),
                    partida.getStatus()
            );
        }
    }
}
