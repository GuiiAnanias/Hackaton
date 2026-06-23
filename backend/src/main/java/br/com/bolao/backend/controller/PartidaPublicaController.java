package br.com.bolao.backend.controller;

import br.com.bolao.backend.dto.partida.PartidaPublicaDTO;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.repository.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/partidas")
public class PartidaPublicaController {

    private static final DateTimeFormatter FORMATO_BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final PartidaRepository partidaRepository;

    public PartidaPublicaController(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }

    // RF-010: lista todas as partidas para o app mobile
    @GetMapping
    public List<PartidaPublicaDTO> listar() {
        return partidaRepository.findAll().stream()
                .sorted(Comparator.comparing(Partida::getDataHora,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::converter)
                .toList();
    }

    // RF-013: proximas partidas em que ainda da para palpitar
    @GetMapping("/proximas")
    public List<PartidaPublicaDTO> proximas() {
        LocalDateTime agora = LocalDateTime.now();
        return partidaRepository.findAll().stream()
                .filter(p -> "AGENDADA".equalsIgnoreCase(p.getStatus()))
                .filter(p -> p.getDataHora() != null && p.getDataHora().isAfter(agora))
                .sorted(Comparator.comparing(Partida::getDataHora))
                .map(this::converter)
                .toList();
    }

    // RF-011: detalhe de uma partida
    @GetMapping("/{id}")
    public ResponseEntity<PartidaPublicaDTO> buscarPorId(@PathVariable Long id) {
        return partidaRepository.findById(id)
                .map(this::converter)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private PartidaPublicaDTO converter(Partida p) {
        return new PartidaPublicaDTO(
                p.getId(),
                nome(p.getSelecaoMandante()),
                nome(p.getSelecaoVisitante()),
                codigoFifa(p.getSelecaoMandante()),
                codigoFifa(p.getSelecaoVisitante()),
                bandeira(p.getSelecaoMandante()),
                bandeira(p.getSelecaoVisitante()),
                p.getDataHora() == null ? null : p.getDataHora().format(FORMATO_BR),
                p.getDataHora() == null ? null : p.getDataHora().toString(),
                p.getFase(),
                p.getStatus(),
                p.getEstadio(),
                p.getGrupo(),
                p.getGolsMandante(),
                p.getGolsVisitante()
        );
    }

    private String nome(Selecao selecao) {
        return (selecao == null || selecao.getNome() == null) ? "?" : selecao.getNome();
    }

    private String codigoFifa(Selecao selecao) {
        return (selecao == null || selecao.getCodigoFifa() == null) ? null : selecao.getCodigoFifa();
    }

    private String bandeira(Selecao selecao) {
        return (selecao == null || selecao.getBandeira() == null) ? null : selecao.getBandeira();
    }
}
