package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.DashboardResumoDTO;
import br.com.bolao.backend.dto.admin.PartidaAdminDTO;
import br.com.bolao.backend.dto.admin.RankingLinhaDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardService {

    private final AdminRankingService adminRankingService;
    private final AdminPartidaService adminPartidaService;
    private final AdminMockDataService adminMockDataService;
    private final AdminUsuarioService adminUsuarioService;

    public AdminDashboardService(
            AdminRankingService adminRankingService,
            AdminPartidaService adminPartidaService,
            AdminMockDataService adminMockDataService,
            AdminUsuarioService adminUsuarioService
    ) {
        this.adminRankingService = adminRankingService;
        this.adminPartidaService = adminPartidaService;
        this.adminMockDataService = adminMockDataService;
        this.adminUsuarioService = adminUsuarioService;
    }

    public DashboardResumoDTO buscarResumo() {
        return new DashboardResumoDTO(
                Math.toIntExact(adminUsuarioService.contarTodos()),
                adminMockDataService.buscarTotalPalpites(),
                adminPartidaService.contarPartidasPendentes(),
                Math.toIntExact(adminUsuarioService.contarAtivos())
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
}