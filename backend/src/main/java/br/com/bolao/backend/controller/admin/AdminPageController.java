package br.com.bolao.backend.controller.admin;

import br.com.bolao.backend.model.EstadioCopa;
import br.com.bolao.backend.model.FaseCopa;
import br.com.bolao.backend.model.EstadioCopa;
import br.com.bolao.backend.model.FaseCopa;
import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.service.admin.AdminDashboardService;
import br.com.bolao.backend.service.admin.AdminPartidaService;
import br.com.bolao.backend.service.admin.AdminRankingService;
import br.com.bolao.backend.service.admin.AdminSelecaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminPageController {

    private final AdminDashboardService adminDashboardService;
    private final AdminRankingService adminRankingService;
    private final AdminPartidaService adminPartidaService;
    private final AdminSelecaoService adminSelecaoService;

    public AdminPageController(
            AdminDashboardService adminDashboardService,
            AdminRankingService adminRankingService,
            AdminPartidaService adminPartidaService,
            AdminSelecaoService adminSelecaoService) {
        this.adminDashboardService = adminDashboardService;
        this.adminRankingService = adminRankingService;
        this.adminPartidaService = adminPartidaService;
        this.adminSelecaoService = adminSelecaoService;
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
            Model model) {
        model.addAttribute("rankingPagina", adminRankingService.listarRankingPaginado(page, 50));
        return "admin/ranking";
    }

    @GetMapping("/partidas")
    public String partidas(Model model) {
        model.addAttribute("partidas", adminPartidaService.listarPartidas());
        return "admin/partidas";
    }

    @GetMapping("/partidas/nova")
    public String formularioNovaPartida(Model model) {
        model.addAttribute("selecoes", adminSelecaoService.listarSelecoes());
        model.addAttribute("fases", FaseCopa.values());
        model.addAttribute("estadios", EstadioCopa.values());
        return "admin/partidaForm";
    }

    @PostMapping("/partidas")
    public String criarPartida(
            @RequestParam Long selecaoMandanteId,
            @RequestParam Long selecaoVisitanteId,
            @RequestParam String dataHora,
            @RequestParam String fase,
            @RequestParam(required = false) String estadio,
            @RequestParam String grupo,
            RedirectAttributes redirectAttributes) {
        try {
            adminPartidaService.criarPartida(selecaoMandanteId, selecaoVisitanteId, dataHora, fase, estadio, grupo);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Partida cadastrada com sucesso.");
            return "redirect:/admin/partidas";
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
            return "redirect:/admin/partidas/nova";
        }
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
            redirectAttributes.addFlashAttribute(
                    "mensagemDetalhe",
                    resultado + ". A pontuação dos palpites foi recalculada.");

            return "redirect:/admin/ranking";
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
            return "redirect:/admin/partidas/" + id + "/resultado";
        }
    }

    @GetMapping("/partidas/{id}/editar")
    public String formularioEditarPartida(@PathVariable Long id, Model model) {
        model.addAttribute("partida", adminPartidaService.buscarParaFormulario(id));
        model.addAttribute("selecoes", adminSelecaoService.listarSelecoes());
        model.addAttribute("fases", FaseCopa.values());
        model.addAttribute("estadios", EstadioCopa.values());
        return "admin/partidaForm";
    }

    @PostMapping("/partidas/{id}/editar")
    public String editarPartida(
            @PathVariable Long id,
            @RequestParam Long selecaoMandanteId,
            @RequestParam Long selecaoVisitanteId,
            @RequestParam String dataHora,
            @RequestParam String fase,
            @RequestParam String estadio,
            @RequestParam String grupo,
            RedirectAttributes redirectAttributes) {
        try {
            adminPartidaService.editarPartida(id, selecaoMandanteId, selecaoVisitanteId, dataHora, fase, estadio,
                    grupo);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Partida atualizada com sucesso.");
            return "redirect:/admin/partidas";
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
            return "redirect:/admin/partidas/" + id + "/editar";
        }
    }

    @PostMapping("/partidas/{id}/excluir")
    public String excluirPartida(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes) {
        try {
            adminPartidaService.excluirPartida(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Partida excluída com sucesso.");
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
        }

        return "redirect:/admin/partidas";
    }

    @GetMapping("/selecoes")
    public String selecoes(Model model) {
        model.addAttribute("selecoes", adminSelecaoService.listarSelecoes());
        return "admin/selecoes";
    }

    @GetMapping("/selecoes/nova")
    public String formularioNovaSelecao() {
        return "admin/selecaoForm";
    }

    @PostMapping("/selecoes")
    public String criarSelecao(
            @RequestParam String nome,
            @RequestParam String codigoFifa,
            @RequestParam String grupo,
            RedirectAttributes redirectAttributes) {
        try {
            adminSelecaoService.criarSelecao(nome, codigoFifa, grupo);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Seleção cadastrada com sucesso.");
            return "redirect:/admin/selecoes";
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
            return "redirect:/admin/selecoes/nova";
        }
    }

    @GetMapping("/selecoes/{id}/editar")
    public String formularioEditarSelecao(@PathVariable Long id, Model model) {
        model.addAttribute("selecao", adminSelecaoService.buscarSelecao(id));
        return "admin/selecaoForm";
    }

    @PostMapping("/selecoes/{id}/editar")
    public String editarSelecao(
            @PathVariable Long id,
            @RequestParam String nome,
            @RequestParam String codigoFifa,
            @RequestParam String grupo,
            RedirectAttributes redirectAttributes) {
        try {
            adminSelecaoService.editarSelecao(id, nome, codigoFifa, grupo);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Seleção atualizada com sucesso.");
            return "redirect:/admin/selecoes";
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
            return "redirect:/admin/selecoes/" + id + "/editar";
        }
    }

    @PostMapping("/selecoes/{id}/excluir")
    public String excluirSelecao(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes) {
        try {
            adminSelecaoService.excluirSelecao(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Seleção excluída com sucesso.");
        } catch (AdminException exception) {
            redirectAttributes.addFlashAttribute("mensagemErro", exception.getMessage());
        }

        return "redirect:/admin/selecoes";
    }
}