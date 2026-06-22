package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.PartidaAdminDTO;
import br.com.bolao.backend.dto.admin.PartidaFormDTO;
import br.com.bolao.backend.dto.admin.PartidaResultadoDTO;
import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.model.EstadioCopa;
import br.com.bolao.backend.model.FaseCopa;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;

@Service
public class AdminPartidaService {

    private static final DateTimeFormatter DATA_HORA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final PartidaService partidaService;
    private final SelecaoRepository selecaoRepository;
    private final PalpiteRepository palpiteRepository;

    public AdminPartidaService(
            PartidaService partidaService,
            SelecaoRepository selecaoRepository,
            PalpiteRepository palpiteRepository
    ) {
        this.partidaService = partidaService;
        this.selecaoRepository = selecaoRepository;
        this.palpiteRepository = palpiteRepository;
    }

    public List<PartidaAdminDTO> listarPartidas() {
        return partidaService.listarTodas()
                .stream()
                .sorted(Comparator.comparing(Partida::getDataHora, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::converterParaDTO)
                .toList();
    }

    public PartidaFormDTO buscarParaFormulario(Long id) {
        Partida partida = partidaService.buscarPorId(id)
                .orElseThrow(() -> new AdminException("Partida não encontrada."));

        return new PartidaFormDTO(
                partida.getId(),
                partida.getSelecaoMandante() == null ? null : partida.getSelecaoMandante().getId(),
                partida.getSelecaoVisitante() == null ? null : partida.getSelecaoVisitante().getId(),
                partida.getDataHora(),
                partida.getFase(),
                partida.getEstadio(),
                partida.getGrupo()
        );
    }

    public void criarPartida(
            Long selecaoMandanteId,
            Long selecaoVisitanteId,
            String dataHora,
            String fase,
            String estadio,
            String grupo
    ) {
        Selecao selecaoMandante = buscarSelecao(selecaoMandanteId, "Informe a seleção mandante.");
        Selecao selecaoVisitante = buscarSelecao(selecaoVisitanteId, "Informe a seleção visitante.");
        LocalDateTime dataHoraConvertida = converterDataHora(dataHora);
        FaseCopa faseCopa = converterFase(fase);
        EstadioCopa estadioCopa = converterEstadio(estadio);

        if (selecaoMandante.getId().equals(selecaoVisitante.getId())) {
            throw new AdminException("A partida precisa ter duas seleções diferentes.");
        }

        validarTexto(grupo, "Informe o grupo da partida.");

        Partida partida = new Partida();
        partida.setSelecaoMandante(selecaoMandante);
        partida.setSelecaoVisitante(selecaoVisitante);
        partida.setDataHora(dataHoraConvertida);
        partida.setFase(faseCopa.getDescricao());
        partida.setEstadio(estadioCopa.getDescricao());
        partida.setGrupo(grupo.trim().toUpperCase());
        partida.setStatus(definirStatusInicial(dataHoraConvertida));
        partida.setGolsMandante(null);
        partida.setGolsVisitante(null);

        partidaService.salvar(partida);
    }

    public void editarPartida(
            Long id,
            Long selecaoMandanteId,
            Long selecaoVisitanteId,
            String dataHora,
            String fase,
            String estadio,
            String grupo
    ) {
        Partida partida = partidaService.buscarPorId(id)
                .orElseThrow(() -> new AdminException("Partida não encontrada."));

        validarPartidaEditavel(partida);

        Selecao selecaoMandante = buscarSelecao(selecaoMandanteId, "Informe a seleção mandante.");
        Selecao selecaoVisitante = buscarSelecao(selecaoVisitanteId, "Informe a seleção visitante.");
        LocalDateTime dataHoraConvertida = converterDataHora(dataHora);
        FaseCopa faseCopa = converterFase(fase);
        EstadioCopa estadioCopa = converterEstadio(estadio);

        if (selecaoMandante.getId().equals(selecaoVisitante.getId())) {
            throw new AdminException("A partida precisa ter duas seleções diferentes.");
        }

        validarTexto(grupo, "Informe o grupo da partida.");

        partida.setSelecaoMandante(selecaoMandante);
        partida.setSelecaoVisitante(selecaoVisitante);
        partida.setDataHora(dataHoraConvertida);
        partida.setFase(faseCopa.getDescricao());
        partida.setEstadio(estadioCopa.getDescricao());
        partida.setGrupo(grupo.trim().toUpperCase());
        partida.setStatus(definirStatusInicial(dataHoraConvertida));

        partidaService.salvar(partida);
    }

    public void excluirPartida(Long id) {
        Partida partida = partidaService.buscarPorId(id)
                .orElseThrow(() -> new AdminException("Partida não encontrada."));

        validarPartidaExcluivel(partida);

        try {
            partidaService.deletar(id);
        } catch (RuntimeException exception) {
            throw new AdminException("Não foi possível excluir a partida.");
        }
    }

    public PartidaResultadoDTO buscarParaResultado(Long id) {
        Partida partida = partidaService.buscarPorId(id)
                .orElseThrow(() -> new AdminException("Partida não encontrada."));

        return new PartidaResultadoDTO(
                partida.getId(),
                obterNomeMandante(partida),
                obterNomeVisitante(partida),
                formatarTexto(partida.getFase()),
                formatarDataHora(partida)
        );
    }

    public String lancarResultado(Long id, String golsA, String golsB) {
        int golsMandante = converterGols(golsA);
        int golsVisitante = converterGols(golsB);

        validarResultado(golsMandante, golsVisitante);

        Partida partidaSalva = editarResultado(id, golsMandante, golsVisitante);

        return obterNomeMandante(partidaSalva) + " " + golsMandante + " x " + golsVisitante + " " + obterNomeVisitante(partidaSalva);
    }

    public int contarPartidasPendentes() {
        return (int) listarPartidas()
                .stream()
                .filter(partida -> partida.status().equals("Pendente"))
                .count();
    }

    private Partida editarResultado(Long id, int golsMandante, int golsVisitante) {
        try {
            return partidaService.editarResultado(id, golsMandante, golsVisitante);
        } catch (RuntimeException exception) {
            if (exception.getMessage() != null && exception.getMessage().contains("Partida não encontrada")) {
                throw new AdminException("Partida não encontrada.");
            }

            throw new AdminException("Não foi possível lançar o resultado da partida.");
        }
    }

    private void validarPartidaEditavel(Partida partida) {
        if (partida.getGolsMandante() != null || partida.getGolsVisitante() != null) {
            throw new AdminException("Não é possível editar uma partida com resultado lançado.");
        }

        if (!palpiteRepository.findByPartidaId(partida.getId()).isEmpty()) {
            throw new AdminException("Não é possível editar uma partida que já possui palpites.");
        }
    }

    private void validarPartidaExcluivel(Partida partida) {
        if (partida.getGolsMandante() != null || partida.getGolsVisitante() != null) {
            throw new AdminException("Não é possível excluir uma partida com resultado lançado.");
        }

        if (!palpiteRepository.findByPartidaId(partida.getId()).isEmpty()) {
            throw new AdminException("Não é possível excluir uma partida que já possui palpites.");
        }
    }

    private Selecao buscarSelecao(Long id, String mensagem) {
        if (id == null) {
            throw new AdminException(mensagem);
        }

        return selecaoRepository.findById(id)
                .orElseThrow(() -> new AdminException("Seleção não encontrada."));
    }

    private PartidaAdminDTO converterParaDTO(Partida partida) {
        return new PartidaAdminDTO(
                partida.getId(),
                obterNomeMandante(partida),
                obterNomeVisitante(partida),
                formatarTexto(partida.getFase()),
                formatarDataHora(partida),
                formatarStatus(partida.getStatus()),
                formatarResultado(partida)
        );
    }

    private String obterNomeMandante(Partida partida) {
        if (partida.getSelecaoMandante() == null || partida.getSelecaoMandante().getNome() == null) {
            return "Seleção mandante";
        }

        return partida.getSelecaoMandante().getNome();
    }

    private String obterNomeVisitante(Partida partida) {
        if (partida.getSelecaoVisitante() == null || partida.getSelecaoVisitante().getNome() == null) {
            return "Seleção visitante";
        }

        return partida.getSelecaoVisitante().getNome();
    }

    private String formatarDataHora(Partida partida) {
        if (partida.getDataHora() == null) {
            return "-";
        }

        return partida.getDataHora().format(DATA_HORA_FORMATTER);
    }

    private String formatarStatus(String status) {
        if (status == null || status.isBlank()) {
            return "Pendente";
        }

        return switch (status.trim().toUpperCase()) {
            case "ENCERRADA" -> "Encerrada";
            case "EM_ANDAMENTO" -> "Em andamento";
            default -> "Pendente";
        };
    }

    private String formatarResultado(Partida partida) {
        if (partida.getGolsMandante() == null || partida.getGolsVisitante() == null) {
            return "-";
        }

        return partida.getGolsMandante() + " x " + partida.getGolsVisitante();
    }

    private String formatarTexto(String valor) {
        if (valor == null || valor.isBlank()) {
            return "-";
        }

        return valor;
    }

    private void validarTexto(String valor, String mensagem) {
        if (valor == null || valor.isBlank()) {
            throw new AdminException(mensagem);
        }
    }

    private LocalDateTime converterDataHora(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new AdminException("Informe a data e hora da partida.");
        }

        try {
            return LocalDateTime.parse(valor);
        } catch (DateTimeParseException exception) {
            throw new AdminException("Informe uma data e hora válidas.");
        }
    }

    private FaseCopa converterFase(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new AdminException("Informe a fase da partida.");
        }

        try {
            return FaseCopa.valueOf(valor);
        } catch (IllegalArgumentException exception) {
            throw new AdminException("Informe uma fase válida.");
        }
    }

    private EstadioCopa converterEstadio(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new AdminException("Informe o estádio da partida.");
        }

        try {
            return EstadioCopa.valueOf(valor);
        } catch (IllegalArgumentException exception) {
            throw new AdminException("Informe um estádio válido.");
        }
    }

    private String definirStatusInicial(LocalDateTime dataHora) {
        if (dataHora.isBefore(LocalDateTime.now())) {
            return "ENCERRADA";
        }

        return "AGENDADA";
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

    private void validarResultado(int golsMandante, int golsVisitante) {
        if (golsMandante < 0 || golsVisitante < 0) {
            throw new AdminException("Os gols não podem ser negativos.");
        }

        if (golsMandante > 20 || golsVisitante > 20) {
            throw new AdminException("Informe um placar válido. O limite é de 20 gols por seleção.");
        }
    }
}