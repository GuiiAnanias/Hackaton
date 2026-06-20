package br.com.bolao.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.bolao.backend.dto.admin.DashboardResumoDTO;
import br.com.bolao.backend.dto.admin.PartidaAdminDTO;
import br.com.bolao.backend.dto.admin.RankingLinhaDTO;

@Service
public class AdminDashboardService {

    private final AdminRankingService adminRankingService;
    private final AdminPartidaService adminPartidaService;

    public AdminDashboardService(AdminRankingService adminRankingService, AdminPartidaService adminPartidaService) {
        this.adminRankingService = adminRankingService;
        this.adminPartidaService = adminPartidaService;
    }

    public DashboardResumoDTO buscarResumo() {
        return new DashboardResumoDTO(
                1248,
                15672,
                adminPartidaService.contarPartidasPendentes(),
                64
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