package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.DashboardResumoDTO;
import br.com.bolao.backend.dto.admin.PartidaAdminDTO;
import br.com.bolao.backend.dto.admin.RankingLinhaDTO;
import br.com.bolao.backend.service.PalpiteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardService {

    private final AdminRankingService adminRankingService;
    private final AdminPartidaService adminPartidaService;
    private final AdminUsuarioService adminUsuarioService;
    private final PalpiteService palpiteService;

    public AdminDashboardService(
            AdminRankingService adminRankingService,
            AdminPartidaService adminPartidaService,
            AdminUsuarioService adminUsuarioService,
            PalpiteService palpiteService
    ) {
        this.adminRankingService = adminRankingService;
        this.adminPartidaService = adminPartidaService;
        this.adminUsuarioService = adminUsuarioService;
        this.palpiteService = palpiteService;
    }

    public DashboardResumoDTO buscarResumo() {
        return new DashboardResumoDTO(
                converterParaInt(adminUsuarioService.contarTodos()),
                converterParaInt(palpiteService.contarTodos()),
                adminPartidaService.contarPartidasPendentes(),
                converterParaInt(adminUsuarioService.contarAtivosUltimas24h())
        );
    }

    public List<RankingLinhaDTO> listarTopRanking() {
        return adminRankingService.listarRanking()
                .stream()
                .limit(5)
                .toList();
    }

    public List<PartidaAdminDTO> listarPartidasPendentes() {
        return adminPartidaService.listarPartidas()
                .stream()
                .filter(partida -> partida.status().equals("Pendente"))
                .limit(5)
                .toList();
    }

    public List<PartidaAdminDTO> listarUltimosResultados() {
        return adminPartidaService.listarPartidas()
                .stream()
                .filter(partida -> partida.status().equals("Encerrada"))
                .limit(5)
                .toList();
    }

    private int converterParaInt(long valor) {
        if (valor > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }

        return (int) valor;
    }
}
