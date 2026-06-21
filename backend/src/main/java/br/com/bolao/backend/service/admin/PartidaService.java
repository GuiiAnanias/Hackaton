package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartidaService {

    @Autowired
    private PartidaRepository repository;

    public List<Partida> listarTodas() {
        return repository.findAll();
    }

    public Optional<Partida> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Partida salvar(Partida partida) {
        return repository.save(partida);
    }

    public Partida atualizar(Long id, Partida partidaAtualizada) {
        return repository.findById(id).map(partida -> {
            // Atualiza os relacionamentos e dados da partida
            partida.setSelecaoMandante(partidaAtualizada.getSelecaoMandante());
            partida.setSelecaoVisitante(partidaAtualizada.getSelecaoVisitante());
            partida.setDataHora(partidaAtualizada.getDataHora());
            partida.setFase(partidaAtualizada.getFase());
            partida.setEstadio(partidaAtualizada.getEstadio());
            partida.setGrupo(partidaAtualizada.getGrupo());
            partida.setGolsMandante(partidaAtualizada.getGolsMandante());
            partida.setGolsVisitante(partidaAtualizada.getGolsVisitante());
            partida.setStatus(partidaAtualizada.getStatus());

            return repository.save(partida);
        }).orElseThrow(() -> new RuntimeException("Partida não encontrada"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}