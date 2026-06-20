package br.com.bolao.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.bolao.backend.dto.admin.PartidaAdminDTO;
import br.com.bolao.backend.dto.admin.PartidaResultadoDTO;
import br.com.bolao.backend.exception.AdminException;

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
                .orElseThrow(() -> new AdminException("Partida não encontrada."));

        return new PartidaResultadoDTO(
                partida.id(),
                partida.selecaoA(),
                partida.selecaoB(),
                partida.fase(),
                partida.dataHora());
    }

    public String lancarResultado(Long id, String golsA, String golsB) {
        int golsSelecaoA = converterGols(golsA);
        int golsSelecaoB = converterGols(golsB);

        validarResultado(golsSelecaoA, golsSelecaoB);

        PartidaResultadoDTO partida = buscarParaResultado(id);

        return partida.selecaoA() + " " + golsSelecaoA + " x " + golsSelecaoB + " " + partida.selecaoB();
    }

    public int contarPartidasPendentes() {
        return (int) listarPartidas()
                .stream()
                .filter(partida -> partida.status().equals("Pendente"))
                .count();
    }

    private void validarResultado(int golsA, int golsB) {
        if (golsA < 0 || golsB < 0) {
            throw new AdminException("Os gols não podem ser negativos.");
        }

        if (golsA > 20 || golsB > 20) {
            throw new AdminException("Informe um placar válido.");
        }
    }

    private int converterGols(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new AdminException("Informe os gols das duas seleções.");
        }

        if (!valor.matches("\\d+")) {
            throw new AdminException("Os gols devem ser números inteiros positivos.");
        }

        if (valor.length() > 2) {
            throw new AdminException("Informe um placar válido. O limite é de 20 gols por seleção.");
        }

        return Integer.parseInt(valor);
    }
}