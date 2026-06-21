package br.com.bolao.backend.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.service.admin.AdminDashboardService;
import br.com.bolao.backend.service.admin.AdminPartidaService;
import br.com.bolao.backend.service.admin.AdminRankingService;

@Controller
@RequestMapping("/admin")
public class AdminPageController {

    private final AdminDashboardService adminDashboardService;
    private final AdminRankingService adminRankingService;
    private final AdminPartidaService adminPartidaService;

    public AdminPageController(
            AdminDashboardService adminDashboardService,
            AdminRankingService adminRankingService,
            AdminPartidaService adminPartidaService) {
        this.adminDashboardService = adminDashboardService;
        this.adminRankingService = adminRankingService;
        this.adminPartidaService = adminPartidaService;
    }

    @GetMapping("/login")
    public String login() {
        return "admin/login";
    }

    @GetMapping({ "", "/", "/dashboard" })
    public String dashboard(Model model) {
        model.addAttribute("dashboard", adminDashboardService.buscarResumo());
        model.addAttribute("topRanking", adminDashboardService.listarTopRanking());
        model.addAttribute("partidasPendentes", adminDashboardService.listarPartidasPendentes());
        model.addAttribute("ultimosResultados", adminDashboardService.listarUltimosResultados());
        return "admin/dashboard";
    }

    @GetMapping("/ranking")
    public String ranking(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            Model model) {
        model.addAttribute("rankingPagina", adminRankingService.listarRankingPaginado(page, size));
        return "admin/ranking";
    }

    @GetMapping("/partidas")
    public String partidas(Model model) {
        model.addAttribute("partidas", adminPartidaService.listarPartidas());
        return "admin/partidas";
    }

    @GetMapping("/partidas/{id}/resultado")
    public String formularioResultado(@PathVariable Long id, Model model) {
        model.addAttribute("partida", adminPartidaService.buscarParaResultado(id));
        return "admin/resultadoForm";
    }

    @PostMapping("/partidas/{id}/resultado")
    public String salvarResultado(
            @PathVariable Long id,
            @RequestParam String golsA,
            @RequestParam String golsB,
            RedirectAttributes redirectAttributes) {
        try {
            String resultado = adminPartidaService.lancarResultado(id, golsA, golsB);

            redirectAttributes.addFlashAttribute("mensagemSucesso", "Resultado lançado com sucesso.");
            redirectAttributes.addFlashAttribute("mensagemDetalhe",
                    resultado + ". A pontuação dos palpites foi recalculada.");

            return "redirect:/admin/ranking";
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());

            return "redirect:/admin/partidas/" + id + "/resultado";
        }
    }
}
