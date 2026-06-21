package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminUsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Usuario alternarBloqueio(Long id) {
        return repository.findById(id).map(usuario -> {
            usuario.setAtivo(!usuario.isAtivo()); // Inverte o status: true vira false, false vira true
            return repository.save(usuario);
        }).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}