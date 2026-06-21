package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.exception.AdminException;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminUsuarioService {

    private final UsuarioRepository repository;

    public AdminUsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id);
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

    public Usuario alternarBloqueio(Long id) {
        return repository.findById(id).map(usuario -> {
            usuario.setAtivo(!usuario.isAtivo());
            return repository.save(usuario);
        }).orElseThrow(() -> new AdminException("Usuário não encontrado."));
    }
}