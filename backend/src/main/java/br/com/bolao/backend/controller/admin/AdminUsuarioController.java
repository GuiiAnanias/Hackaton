package br.com.bolao.backend.controller.admin;

import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.service.admin.AdminUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuarioController {

    @Autowired
    private AdminUsuarioService service;

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PatchMapping("/{id}/bloqueio")
    public ResponseEntity<Usuario> alternarBloqueio(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.alternarBloqueio(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}