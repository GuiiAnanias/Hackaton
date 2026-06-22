package br.com.bolao.backend.service;

import br.com.bolao.backend.dto.palpite.PalpiteRequestDTO;
import br.com.bolao.backend.dto.palpite.PalpiteResponseDTO;
import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.model.Palpite;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.PartidaRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PalpiteService {

    private final PalpiteRepository palpiteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PartidaRepository partidaRepository;

    public PalpiteService(
            PalpiteRepository palpiteRepository,
            UsuarioRepository usuarioRepository,
            PartidaRepository partidaRepository) {
        this.palpiteRepository = palpiteRepository;
        this.usuarioRepository = usuarioRepository;
        this.partidaRepository = partidaRepository;
    }

    public List<PalpiteResponseDTO> listarTodos() {
        return palpiteRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public List<Palpite> listarDoUsuario(Usuario usuario) {
        return palpiteRepository.findByUsuarioId(usuario.getId());
    }

    public Palpite buscarDoUsuario(Long id, Usuario usuario) {
        return palpiteRepository.findById(id)
                .filter(palpite -> palpite.getUsuario().getId().equals(usuario.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Palpite nao encontrado"));
    }

    public Palpite criarOuAtualizarDoUsuario(
            Usuario usuario,
            Long partidaId,
            Integer golsMandante,
            Integer golsVisitante
    ) {
        Partida partida = buscarPartidaApi(partidaId);
        validarPlacarApi(golsMandante, golsVisitante);
        validarPartidaAbertaApi(partida);

        Palpite palpite = palpiteRepository.findByUsuarioIdAndPartidaId(usuario.getId(), partida.getId())
                .orElseGet(Palpite::new);

        palpite.setUsuario(usuario);
        palpite.setPartida(partida);
        palpite.setGolsMandante(golsMandante);
        palpite.setGolsVisitante(golsVisitante);
        palpite.setPontos(0);
        palpite.setCriterio(null);

        return palpiteRepository.save(palpite);
    }

    public Palpite atualizarDoUsuario(
            Usuario usuario,
            Long palpiteId,
            Integer golsMandante,
            Integer golsVisitante
    ) {
        Palpite palpite = buscarDoUsuario(palpiteId, usuario);

        validarPlacarApi(golsMandante, golsVisitante);
        validarPartidaAbertaApi(palpite.getPartida());

        palpite.setGolsMandante(golsMandante);
        palpite.setGolsVisitante(golsVisitante);
        palpite.setPontos(0);
        palpite.setCriterio(null);

        return palpiteRepository.save(palpite);
    }

    public List<PalpiteResponseDTO> listarPorUsuario(Long usuarioId) {
        return palpiteRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public List<PalpiteResponseDTO> listarPorPartida(Long partidaId) {
        return palpiteRepository.findByPartidaId(partidaId)
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public PalpiteResponseDTO buscarPorId(Long id) {
        Palpite palpite = palpiteRepository.findById(id)
                .orElseThrow(() -> new AdminException("Palpite não encontrado."));

        return converterParaResponse(palpite);
    }

    public PalpiteResponseDTO buscarPorUsuarioEPartida(Long usuarioId, Long partidaId) {
        Palpite palpite = palpiteRepository.findByUsuarioIdAndPartidaId(usuarioId, partidaId)
                .orElseThrow(() -> new AdminException("Palpite não encontrado."));

        return converterParaResponse(palpite);
    }

    public PalpiteResponseDTO criar(PalpiteRequestDTO request) {
        Usuario usuario = buscarUsuario(request.usuarioId());
        Partida partida = buscarPartida(request.partidaId());

        validarPartidaAberta(partida);

        if (palpiteRepository.existsByUsuarioIdAndPartidaId(usuario.getId(), partida.getId())) {
            throw new AdminException("Este usuário já possui palpite para esta partida.");
        }

        int golsMandante = converterGols(request.golsMandante());
        int golsVisitante = converterGols(request.golsVisitante());

        validarResultado(golsMandante, golsVisitante);

        Palpite palpite = new Palpite();
        palpite.setUsuario(usuario);
        palpite.setPartida(partida);
        palpite.setGolsMandante(golsMandante);
        palpite.setGolsVisitante(golsVisitante);
        palpite.setPontos(0);
        palpite.setCriterio(null);

        return converterParaResponse(palpiteRepository.save(palpite));
    }

    public PalpiteResponseDTO atualizar(Long id, PalpiteRequestDTO request) {
        Palpite palpite = palpiteRepository.findById(id)
                .orElseThrow(() -> new AdminException("Palpite não encontrado."));

        Usuario usuario = buscarUsuario(request.usuarioId());
        Partida partida = buscarPartida(request.partidaId());

        validarPartidaAberta(partida);
        validarDuplicidadeAoAtualizar(id, usuario.getId(), partida.getId());

        int golsMandante = converterGols(request.golsMandante());
        int golsVisitante = converterGols(request.golsVisitante());

        validarResultado(golsMandante, golsVisitante);

        palpite.setUsuario(usuario);
        palpite.setPartida(partida);
        palpite.setGolsMandante(golsMandante);
        palpite.setGolsVisitante(golsVisitante);
        palpite.setPontos(0);
        palpite.setCriterio(null);

        return converterParaResponse(palpiteRepository.save(palpite));
    }

    public long contarTodos() {
        return palpiteRepository.count();
    }

    private Partida buscarPartidaApi(Long partidaId) {
        if (partidaId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Partida e obrigatoria");
        }

        return partidaRepository.findById(partidaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida nao encontrada"));
    }

    private void validarPlacarApi(Integer golsMandante, Integer golsVisitante) {
        if (golsMandante == null || golsVisitante == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe os gols das duas selecoes");
        }

        if (golsMandante < 0 || golsVisitante < 0 || golsMandante > 20 || golsVisitante > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um placar valido entre 0 e 20 gols");
        }
    }

    private void validarPartidaAbertaApi(Partida partida) {
        if (partida.getDataHora() != null && !LocalDateTime.now().isBefore(partida.getDataHora())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Palpites ficam bloqueados apos o inicio da partida");
        }

        if (partida.getGolsMandante() != null || partida.getGolsVisitante() != null
                || "ENCERRADA".equalsIgnoreCase(partida.getStatus())
                || "EM_ANDAMENTO".equalsIgnoreCase(partida.getStatus())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Nao e possivel palpitar em partida iniciada ou encerrada");
        }
    }

    private Usuario buscarUsuario(Long usuarioId) {
        if (usuarioId == null) {
            throw new AdminException("Informe o usuário do palpite.");
        }

        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new AdminException("Usuário não encontrado."));
    }

    private Partida buscarPartida(Long partidaId) {
        if (partidaId == null) {
            throw new AdminException("Informe a partida do palpite.");
        }

        return partidaRepository.findById(partidaId)
                .orElseThrow(() -> new AdminException("Partida não encontrada."));
    }

    private void validarDuplicidadeAoAtualizar(Long palpiteId, Long usuarioId, Long partidaId) {
        palpiteRepository.findByUsuarioIdAndPartidaId(usuarioId, partidaId)
                .filter(palpite -> !palpite.getId().equals(palpiteId))
                .ifPresent(palpite -> {
                    throw new AdminException("Este usuário já possui palpite para esta partida.");
                });
    }

    private void validarPartidaAberta(Partida partida) {
        String status = partida.getStatus();

        if (partida.getGolsMandante() != null || partida.getGolsVisitante() != null) {
            throw new AdminException("Não é possível apostar em uma partida com resultado lançado.");
        }

        if (status != null && (status.equalsIgnoreCase("ENCERRADA") || status.equalsIgnoreCase("EM_ANDAMENTO"))) {
            throw new AdminException("Não é possível apostar em uma partida que já começou ou foi encerrada.");
        }

        if (partida.getDataHora() != null && !LocalDateTime.now().isBefore(partida.getDataHora())) {
            throw new AdminException("Não é possível apostar após o início da partida.");
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

    private void validarResultado(int golsMandante, int golsVisitante) {
        if (golsMandante < 0 || golsVisitante < 0) {
            throw new AdminException("Os gols não podem ser negativos.");
        }

        if (golsMandante > 20 || golsVisitante > 20) {
            throw new AdminException("Informe um placar válido. O limite é de 20 gols por seleção.");
        }
    }

    private PalpiteResponseDTO converterParaResponse(Palpite palpite) {
        return new PalpiteResponseDTO(
                palpite.getId(),
                palpite.getUsuario().getId(),
                palpite.getUsuario().getNome(),
                palpite.getPartida().getId(),
                obterNomeMandante(palpite.getPartida()),
                obterNomeVisitante(palpite.getPartida()),
                palpite.getGolsMandante(),
                palpite.getGolsVisitante(),
                palpite.getPontos(),
                palpite.getCriterio() == null ? null : palpite.getCriterio().name(),
                palpite.getCriadoEm(),
                palpite.getAtualizadoEm());
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
}