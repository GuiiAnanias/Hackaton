package br.com.bolao.backend.controller;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.repository.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/partidas")
public class PartidaPublicaController {

    private final PartidaRepository partidaRepository;

    public PartidaPublicaController(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }

    @GetMapping
    public List<PartidaResponse> listar() {
        return partidaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Partida::getDataHora, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(PartidaResponse::from)
                .toList();
    }

    @GetMapping("/proximas")
    public List<PartidaResponse> proximas() {
        LocalDateTime agora = LocalDateTime.now();

        return partidaRepository.findAll()
                .stream()
                .filter(partida -> "AGENDADA".equalsIgnoreCase(partida.getStatus()))
                .filter(partida -> partida.getDataHora() != null && partida.getDataHora().isAfter(agora))
                .sorted(Comparator.comparing(Partida::getDataHora))
                .map(PartidaResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartidaResponse> buscarPorId(@PathVariable Long id) {
        return partidaRepository.findById(id)
                .map(PartidaResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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
                    nome(partida.getSelecaoMandante()),
                    nome(partida.getSelecaoVisitante()),
                    partida.getDataHora(),
                    partida.getFase(),
                    partida.getEstadio(),
                    partida.getGrupo(),
                    partida.getGolsMandante(),
                    partida.getGolsVisitante(),
                    partida.getStatus()
            );
        }

        private static String nome(Selecao selecao) {
            if (selecao == null || selecao.getNome() == null) {
                return "?";
            }

            return selecao.getNome();
        }
    }
}