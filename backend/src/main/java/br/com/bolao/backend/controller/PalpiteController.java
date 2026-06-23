package br.com.bolao.backend.controller;

import br.com.bolao.backend.dto.palpite.ApiErroDTO;
import br.com.bolao.backend.dto.palpite.PalpiteRequestDTO;
import br.com.bolao.backend.dto.palpite.PalpiteResponseDTO;
import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.service.PalpiteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/palpites")
public class PalpiteController {

    private final PalpiteService palpiteService;

    public PalpiteController(PalpiteService palpiteService) {
        this.palpiteService = palpiteService;
    }

    @GetMapping
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(palpiteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(palpiteService.buscarPorId(id));
        } catch (AdminException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(palpiteService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/partida/{partidaId}")
    public ResponseEntity<?> listarPorPartida(@PathVariable Long partidaId) {
        return ResponseEntity.ok(palpiteService.listarPorPartida(partidaId));
    }

    @GetMapping("/usuario/{usuarioId}/partida/{partidaId}")
    public ResponseEntity<?> buscarPorUsuarioEPartida(
            @PathVariable Long usuarioId,
            @PathVariable Long partidaId
    ) {
        try {
            return ResponseEntity.ok(palpiteService.buscarPorUsuarioEPartida(usuarioId, partidaId));
        } catch (AdminException exception) {
            return erro(HttpStatus.NOT_FOUND, exception.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody PalpiteRequestDTO request) {
        try {
            PalpiteResponseDTO response = palpiteService.criar(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (AdminException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody PalpiteRequestDTO request
    ) {
        try {
            return ResponseEntity.ok(palpiteService.atualizar(id, request));
        } catch (AdminException exception) {
            return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    private ResponseEntity<ApiErroDTO> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(new ApiErroDTO(mensagem));
    }
}