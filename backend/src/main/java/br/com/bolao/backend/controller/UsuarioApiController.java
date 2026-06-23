package br.com.bolao.backend.controller;

import br.com.bolao.backend.model.Perfil;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import br.com.bolao.backend.util.EmailValidator;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios/me")
public class UsuarioApiController {

    private final UsuarioRepository usuarioRepository;
    private final PalpiteRepository palpiteRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioApiController(UsuarioRepository usuarioRepository,
                                PalpiteRepository palpiteRepository,
                                PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.palpiteRepository = palpiteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public UsuarioResponse perfil(Authentication authentication) {
        return UsuarioResponse.from(usuarioLogado(authentication));
    }

    @PatchMapping
    public UsuarioResponse atualizarPerfil(@RequestBody AtualizarPerfilRequest request,
                                           Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);

        if (request.nome() == null || request.nome().isBlank()
                || request.email() == null || request.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome e e-mail sao obrigatorios");
        }

        if (!EmailValidator.isValid(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um e-mail valido");
        }

        String email = EmailValidator.normalize(request.email());
        if (!email.equals(usuario.getEmail()) && usuarioRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail ja cadastrado");
        }

        usuario.setNome(request.nome().trim());
        usuario.setEmail(email);
        usuario.setAvatarUrl(normalizarAvatarUrl(request.avatarUrl()));

        return UsuarioResponse.from(usuarioRepository.save(usuario));
    }

    @PatchMapping("/senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaRequest request,
                                          Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);

        if (request.senhaAtual() == null || request.senhaAtual().isBlank()
                || request.novaSenha() == null || request.novaSenha().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Senha atual e nova senha sao obrigatorias"));
        }

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Senha atual invalida"));
        }

        if (request.novaSenha().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("erro", "A nova senha deve ter pelo menos 6 caracteres"));
        }

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso"));
    }

    @PatchMapping("/desativar")
    public ResponseEntity<?> desativarConta(Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);
        if (usuario.getPerfil() == Perfil.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Contas ADMIN nao podem ser desativadas pelo app"));
        }

        usuario.setAtivo(false);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Conta desativada com sucesso"));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<?> excluirConta(Authentication authentication) {
        Usuario usuario = usuarioLogado(authentication);
        if (usuario.getPerfil() == Perfil.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Contas ADMIN nao podem ser excluidas pelo app"));
        }

        palpiteRepository.deleteByUsuarioId(usuario.getId());
        usuarioRepository.delete(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Conta e palpites excluidos com sucesso"));
    }

    private Usuario usuarioLogado(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado");
        }

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao encontrado"));

        if (!usuario.isAtivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario desativado");
        }

        return usuario;
    }

    private String normalizarAvatarUrl(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return null;
        }

        return avatarUrl.trim();
    }

    public record AtualizarPerfilRequest(String nome, String email, String avatarUrl) {
    }

    public record AlterarSenhaRequest(String senhaAtual, String novaSenha) {
    }

    public record UsuarioResponse(
            Long id,
            String nome,
            String email,
            String perfil,
            String avatarUrl,
            int pontuacaoTotal,
            int placaresExatos
    ) {
        static UsuarioResponse from(Usuario usuario) {
            return new UsuarioResponse(
                    usuario.getId(),
                    usuario.getNome(),
                    usuario.getEmail(),
                    usuario.getPerfil().name(),
                    usuario.getAvatarUrl(),
                    usuario.getPontuacaoTotal(),
                    usuario.getPlacaresExatos()
            );
        }
    }
}
