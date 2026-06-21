package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.repository.PartidaRepository;
import br.com.bolao.backend.service.PontuacaoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PartidaService {

    private final PartidaRepository repository;
    private final PontuacaoService pontuacaoService;

    public PartidaService(PartidaRepository repository, PontuacaoService pontuacaoService) {
        this.repository = repository;
        this.pontuacaoService = pontuacaoService;
    }

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

    @Transactional
    public Partida editarResultado(Long id, Integer golsMandante, Integer golsVisitante) {
        Partida partida = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        partida.setGolsMandante(golsMandante);
        partida.setGolsVisitante(golsVisitante);
        partida.setStatus("ENCERRADA");

        Partida partidaSalva = repository.save(partida);

        pontuacaoService.processarResultado(partidaSalva.getId());

        return partidaSalva;
    }
}