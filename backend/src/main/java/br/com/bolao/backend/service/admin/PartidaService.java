package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importante para a RF-044

import java.util.List;
import java.util.Optional;

@Service
public class PartidaService {

    @Autowired
    private PartidaRepository repository;

    // --- MÉTODOS DO CRUD BÁSICO (RF-042) ---

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



    @Transactional // Garante transação única para a consistência exigida na Regra 4.3
    public Partida editarResultado(Long id, Integer golsMandante, Integer golsVisitante) {
        Partida partida = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        // Atualiza o placar e encerra a partida
        partida.setGolsMandante(golsMandante);
        partida.setGolsVisitante(golsVisitante);
        partida.setStatus("ENCERRADA");

        Partida partidaSalva = repository.save(partida);

        // Dispara o gatilho que o Integrante 1 vai usar para recalcular os pontos
        recalcularPontuacoes(partidaSalva);

        return partidaSalva;
    }

    private void recalcularPontuacoes(Partida partida) {
        // pronto para as regras oficiais do Integrante 1
        System.out.println("GATILHO ACIONADO: Recalculando pontuações para a Partida ID: " + partida.getId());
        System.out.println("Resultado oficial gravado: " + partida.getGolsMandante() + " x " + partida.getGolsVisitante());
    }
}