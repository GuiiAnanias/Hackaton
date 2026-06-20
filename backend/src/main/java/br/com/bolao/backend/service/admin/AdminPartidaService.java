package br.com.bolao.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.bolao.backend.dto.admin.PartidaAdminDTO;
import br.com.bolao.backend.dto.admin.PartidaResultadoDTO;

@Service
public class AdminPartidaService {

    public List<PartidaAdminDTO> listarPartidas() {
        return List.of(
                new PartidaAdminDTO(1L, "Brasil", "Argentina", "Final", "16/07/2026 16:00", "Pendente", "-"),
                new PartidaAdminDTO(2L, "França", "Alemanha", "Semifinal", "12/07/2026 15:00", "Pendente", "-"),
                new PartidaAdminDTO(3L, "Espanha", "Portugal", "Quartas", "08/07/2026 18:00", "Encerrada", "2 x 1"),
                new PartidaAdminDTO(4L, "Inglaterra", "Itália", "Oitavas", "04/07/2026 16:00", "Encerrada", "1 x 1"),
                new PartidaAdminDTO(5L, "Uruguai", "México", "Grupos", "25/06/2026 21:00", "Pendente", "-"));
    }

    public PartidaResultadoDTO buscarParaResultado(Long id) {
        PartidaAdminDTO partida = listarPartidas()
                .stream()
                .filter(item -> item.id().equals(id))
                .findFirst()
                .orElse(new PartidaAdminDTO(id, "Brasil", "Argentina", "Final", "16/07/2026 16:00", "Pendente", "-"));

        return new PartidaResultadoDTO(
                partida.id(),
                partida.selecaoA(),
                partida.selecaoB(),
                partida.fase(),
                partida.dataHora());
    }

    public int contarPartidasPendentes() {
        return (int) listarPartidas()
                .stream()
                .filter(partida -> partida.status().equals("Pendente"))
                .count();
    }

    public String lancarResultado(Long id, int golsA, int golsB) {
        PartidaResultadoDTO partida = buscarParaResultado(id);

        return partida.selecaoA() + " " + golsA + " x " + golsB + " " + partida.selecaoB();
    }
}