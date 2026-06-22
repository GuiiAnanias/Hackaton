package br.com.bolao.backend.controller;

import br.com.bolao.backend.dto.auth.LoginRequest;
import br.com.bolao.backend.dto.auth.LoginResponse;
import br.com.bolao.backend.model.Perfil;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import br.com.bolao.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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

        Usuario usuario = usuarioRepository.findByEmail(request.email().trim().toLowerCase()).orElse(null);

        if (usuario == null || !passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", "E-mail ou senha invalidos"));
        }

        if (!usuario.isAtivo()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Usuario bloqueado"));
        }

        String token = jwtService.gerarToken(usuario);

        LoginResponse response = new LoginResponse(
                token, "Bearer", usuario.getId(),
                usuario.getNome(), usuario.getPerfil().name());

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

        String email = request.email().trim().toLowerCase();
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
        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new LoginResponse(token, "Bearer", usuario.getId(), usuario.getNome(), usuario.getPerfil().name()));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody RecuperarSenhaRequest request) {
        if (request.email() == null || request.email().isBlank()
                || request.novaSenha() == null || request.novaSenha().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "E-mail e nova senha sao obrigatorios"));
        }

        if (request.novaSenha().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "A nova senha deve ter pelo menos 6 caracteres"));
        }

        Usuario usuario = usuarioRepository.findByEmail(request.email().trim().toLowerCase()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuario nao encontrado"));
        }

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Senha atualizada com sucesso"));
    }

    public record CadastroRequest(String nome, String email, String senha) {
    }

    public record RecuperarSenhaRequest(String email, String novaSenha) {
    }
}
