package br.com.bolao.backend.service;

import br.com.bolao.backend.model.CriterioPontuacao;
import br.com.bolao.backend.model.Palpite;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PontuacaoService {

    private final PalpiteRepository palpiteRepository;
    private final UsuarioRepository usuarioRepository;

    public PontuacaoService(PalpiteRepository palpiteRepository, UsuarioRepository usuarioRepository) {
        this.palpiteRepository = palpiteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public void processarResultado(Long partidaId) {
        List<Palpite> palpites = palpiteRepository.findByPartidaId(partidaId);

        palpites.forEach(this::calcularPontuacaoDoPalpite);

        palpiteRepository.saveAll(palpites);

        palpites.stream()
                .map(Palpite::getUsuario)
                .map(Usuario::getId)
                .distinct()
                .forEach(this::recalcularPontuacaoUsuario);
    }

    private void calcularPontuacaoDoPalpite(Palpite palpite) {
        Partida partida = palpite.getPartida();

        if (partida.getGolsMandante() == null || partida.getGolsVisitante() == null) {
            palpite.setPontos(0);
            palpite.setCriterio(CriterioPontuacao.ERRO);
            return;
        }

        if (palpite.getGolsMandante().equals(partida.getGolsMandante())
                && palpite.getGolsVisitante().equals(partida.getGolsVisitante())) {
            palpite.setPontos(10);
            palpite.setCriterio(CriterioPontuacao.PLACAR_EXATO);
            return;
        }

        if (compararResultado(palpite.getGolsMandante(), palpite.getGolsVisitante())
                == compararResultado(partida.getGolsMandante(), partida.getGolsVisitante())) {
            palpite.setPontos(5);
            palpite.setCriterio(CriterioPontuacao.VENCEDOR);
            return;
        }

        palpite.setPontos(0);
        palpite.setCriterio(CriterioPontuacao.ERRO);
    }

    private int compararResultado(Integer golsMandante, Integer golsVisitante) {
        return Integer.compare(golsMandante, golsVisitante);
    }

    private void recalcularPontuacaoUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Palpite> palpites = palpiteRepository.findByUsuarioId(usuarioId);

        int pontuacaoTotal = palpites.stream()
                .map(Palpite::getPontos)
                .mapToInt(pontos -> pontos == null ? 0 : pontos)
                .sum();

        int placaresExatos = (int) palpites.stream()
                .filter(palpite -> palpite.getCriterio() == CriterioPontuacao.PLACAR_EXATO)
                .count();

        usuario.setPontuacaoTotal(pontuacaoTotal);
        usuario.setPlacaresExatos(placaresExatos);

        usuarioRepository.save(usuario);
    }
}