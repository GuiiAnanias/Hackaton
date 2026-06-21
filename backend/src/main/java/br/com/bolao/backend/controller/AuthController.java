package br.com.bolao.backend.controller;

import br.com.bolao.backend.dto.auth.LoginRequest;
import br.com.bolao.backend.dto.auth.LoginResponse;
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

        Usuario usuario = usuarioRepository.findByEmail(request.email()).orElse(null);

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
}