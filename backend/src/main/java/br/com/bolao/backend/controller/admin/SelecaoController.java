package br.com.bolao.backend.controller.admin;

import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.service.admin.SelecaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/selecoes")
public class SelecaoController {

    @Autowired
    private SelecaoService service;

    @GetMapping
    public ResponseEntity<List<Selecao>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Selecao> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Selecao> criar(@RequestBody Selecao selecao) {
        return ResponseEntity.ok(service.salvar(selecao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Selecao> atualizar(@PathVariable Long id, @RequestBody Selecao selecao) {
        try {
            return ResponseEntity.ok(service.atualizar(id, selecao));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}