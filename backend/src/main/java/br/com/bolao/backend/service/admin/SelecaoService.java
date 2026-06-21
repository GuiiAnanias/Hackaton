package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.repository.SelecaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SelecaoService {

    @Autowired
    private SelecaoRepository repository;

    public List<Selecao> listarTodas() {
        return repository.findAll();
    }

    public Optional<Selecao> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Selecao salvar(Selecao selecao) {
        return repository.save(selecao);
    }

    public Selecao atualizar(Long id, Selecao dadosAtualizados) {
        return repository.findById(id).map(selecao -> {
            selecao.setNome(dadosAtualizados.getNome());
            selecao.setCodigoFifa(dadosAtualizados.getCodigoFifa());
            selecao.setGrupo(dadosAtualizados.getGrupo());
            selecao.setBandeira(dadosAtualizados.getBandeira());
            return repository.save(selecao);
        }).orElseThrow(() -> new RuntimeException("Seleção não encontrada"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}