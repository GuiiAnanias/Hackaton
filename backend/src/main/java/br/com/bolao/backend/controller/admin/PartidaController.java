package br.com.bolao.backend.controller.admin;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.service.admin.PartidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/partidas")
public class PartidaController {

    @Autowired
    private PartidaService service;

    @GetMapping
    public ResponseEntity<List<Partida>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Partida> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Partida> criar(@RequestBody Partida partida) {
        return ResponseEntity.ok(service.salvar(partida));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Partida> atualizar(@PathVariable Long id, @RequestBody Partida partida) {
        try {
            return ResponseEntity.ok(service.atualizar(id, partida));
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