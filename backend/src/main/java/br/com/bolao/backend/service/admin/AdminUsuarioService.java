package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.UsuarioAdminDTO;
import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.model.Perfil;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AdminUsuarioService {

    private static final DateTimeFormatter DATA_HORA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter DATA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final UsuarioRepository repository;
    private final PalpiteRepository palpiteRepository;

    public AdminUsuarioService(UsuarioRepository repository, PalpiteRepository palpiteRepository) {
        this.repository = repository;
        this.palpiteRepository = palpiteRepository;
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public List<UsuarioAdminDTO> listarParaAdmin(String busca) {
        String termoBusca = normalizarBusca(busca);

        return repository.findAll()
                .stream()
                .filter(usuario -> correspondeBusca(usuario, termoBusca))
                .sorted(Comparator.comparing(this::obterNomeOrdenacao, String.CASE_INSENSITIVE_ORDER))
                .map(this::converterParaDTO)
                .toList();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public UsuarioAdminDTO buscarDetalhe(Long id) {
        return repository.findById(id)
                .map(this::converterParaDTO)
                .orElseThrow(() -> new AdminException("Usuario nao encontrado."));
    }

    public long contarTodos() {
        return repository.count();
    }

    public long contarAtivos() {
        return repository.findAll()
                .stream()
                .filter(Usuario::isAtivo)
                .count();
    }

    public long contarAtivosUltimas24h() {
        LocalDateTime limite = LocalDateTime.now().minusHours(24);

        return repository.findAll()
                .stream()
                .filter(Usuario::isAtivo)
                .filter(usuario -> usuario.getUltimoAcessoEm() != null)
                .filter(usuario -> !usuario.getUltimoAcessoEm().isBefore(limite))
                .count();
    }

    private UsuarioAdminDTO converterParaDTO(Usuario usuario) {
        return new UsuarioAdminDTO(
                usuario.getId(),
                obterNome(usuario),
                usuario.getEmail(),
                usuario.getPerfil() == null ? "-" : usuario.getPerfil().name(),
                usuario.isAtivo(),
                usuario.getPontuacaoTotal(),
                usuario.getPlacaresExatos(),
                formatarData(usuario.getCriadoEm()),
                formatarDataHora(usuario.getUltimoAcessoEm()),
                usuario.getAvatarUrl(),
                palpiteRepository.countByUsuarioId(usuario.getId())
        );
    }

    private String normalizarBusca(String busca) {
        if (busca == null || busca.isBlank()) {
            return "";
        }

        return busca.trim().toLowerCase();
    }

    private boolean correspondeBusca(Usuario usuario, String busca) {
        if (busca.isBlank()) {
            return true;
        }

        return contem(usuario.getNome(), busca)
                || contem(usuario.getEmail(), busca)
                || contem(usuario.getPerfil() == null ? null : usuario.getPerfil().name(), busca);
    }

    private boolean contem(String valor, String busca) {
        return valor != null && valor.toLowerCase().contains(busca);
    }

    private String obterNomeOrdenacao(Usuario usuario) {
        return obterNome(usuario);
    }

    private String obterNome(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            return "Usuario sem nome";
        }

        return usuario.getNome();
    }

    private String formatarData(LocalDateTime data) {
        if (data == null) {
            return "-";
        }

        return data.format(DATA_FORMATTER);
    }

    private String formatarDataHora(LocalDateTime data) {
        if (data == null) {
            return "Nunca acessou";
        }

        return data.format(DATA_HORA_FORMATTER);
    }

    public Usuario alternarBloqueio(Long id) {
        return repository.findById(id).map(usuario -> {
            if (usuario.getPerfil() == Perfil.ADMIN) {
                throw new AdminException("Usuarios ADMIN nao podem ser bloqueados.");
            }

            usuario.setAtivo(!usuario.isAtivo());
            return repository.save(usuario);
        }).orElseThrow(() -> new AdminException("Usuário não encontrado."));
    }
}
