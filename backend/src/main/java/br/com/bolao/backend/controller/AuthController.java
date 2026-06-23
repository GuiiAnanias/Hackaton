package br.com.bolao.backend.controller;

import br.com.bolao.backend.dto.auth.LoginRequest;
import br.com.bolao.backend.dto.auth.LoginResponse;
import br.com.bolao.backend.model.Perfil;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import br.com.bolao.backend.security.JwtService;
import br.com.bolao.backend.util.EmailValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_EXPIRACAO_MINUTOS = 30;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.email().isBlank()
                || request.senha() == null || request.senha().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "E-mail e senha sao obrigatorios"));
        }

        if (!EmailValidator.isValid(request.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Informe um e-mail valido"));
        }

        Usuario usuario = usuarioRepository.findByEmail(EmailValidator.normalize(request.email())).orElse(null);

        if (usuario == null || !passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", "E-mail ou senha invalidos"));
        }

        if (!usuario.isAtivo()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Usuario bloqueado"));
        }

        usuario.setUltimoAcessoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario);

        LoginResponse response = new LoginResponse(
                token, "Bearer", usuario.getId(),
                usuario.getNome(), usuario.getPerfil().name(), usuario.getAvatarUrl());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequest request) {
        if (request.nome() == null || request.nome().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.senha() == null || request.senha().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Nome, e-mail e senha sao obrigatorios"));
        }

        if (request.senha().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "A senha deve ter pelo menos 6 caracteres"));
        }

        if (!EmailValidator.isValid(request.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Informe um e-mail valido"));
        }

        String email = EmailValidator.normalize(request.email());
        if (usuarioRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("erro", "E-mail ja cadastrado"));
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario.setPerfil(Perfil.USER);
        usuario.setAtivo(true);
        usuario.setUltimoAcessoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new LoginResponse(token, "Bearer", usuario.getId(), usuario.getNome(), usuario.getPerfil().name(), usuario.getAvatarUrl()));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> solicitarRecuperacaoSenha(@RequestBody RecuperarSenhaRequest request) {
        if (request.email() == null || request.email().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "E-mail e obrigatorio"));
        }

        if (!EmailValidator.isValid(request.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Informe um e-mail valido"));
        }

        Usuario usuario = usuarioRepository.findByEmail(EmailValidator.normalize(request.email())).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuario nao encontrado"));
        }

        String tokenRecuperacao = gerarTokenRecuperacao();
        LocalDateTime expiraEm = LocalDateTime.now().plusMinutes(TOKEN_EXPIRACAO_MINUTOS);

        usuario.setTokenRecuperacaoSenha(tokenRecuperacao);
        usuario.setTokenRecuperacaoExpiraEm(expiraEm);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Token de recuperacao gerado com sucesso",
                "token", tokenRecuperacao,
                "expiraEm", expiraEm.toString()));
    }

    @PostMapping("/recuperar-senha/confirmar")
    public ResponseEntity<?> confirmarRecuperacaoSenha(@RequestBody ConfirmarRecuperacaoSenhaRequest request) {
        if (request.email() == null || request.email().isBlank()
                || request.token() == null || request.token().isBlank()
                || request.novaSenha() == null || request.novaSenha().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "E-mail, token e nova senha sao obrigatorios"));
        }

        if (request.novaSenha().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "A nova senha deve ter pelo menos 6 caracteres"));
        }

        if (!EmailValidator.isValid(request.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Informe um e-mail valido"));
        }

        Usuario usuario = usuarioRepository.findByEmail(EmailValidator.normalize(request.email())).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuario nao encontrado"));
        }

        if (usuario.getTokenRecuperacaoSenha() == null
                || usuario.getTokenRecuperacaoExpiraEm() == null
                || usuario.getTokenRecuperacaoExpiraEm().isBefore(LocalDateTime.now())
                || !usuario.getTokenRecuperacaoSenha().equals(request.token().trim())) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("erro", "Token de recuperacao invalido ou expirado"));
        }

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuario.setTokenRecuperacaoSenha(null);
        usuario.setTokenRecuperacaoExpiraEm(null);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Senha atualizada com sucesso"));
    }

    private String gerarTokenRecuperacao() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public record CadastroRequest(String nome, String email, String senha) {
    }

    public record RecuperarSenhaRequest(String email) {
    }

    public record ConfirmarRecuperacaoSenhaRequest(String email, String token, String novaSenha) {
    }
}
