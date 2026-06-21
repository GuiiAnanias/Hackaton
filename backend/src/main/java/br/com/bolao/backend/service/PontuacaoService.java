package br.com.bolao.backend.service;

import br.com.bolao.backend.model.CriterioPontuacao;
import br.com.bolao.backend.model.Palpite;
import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PalpiteRepository;
import br.com.bolao.backend.repository.PartidaRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PontuacaoService {

    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;
    private final UsuarioRepository usuarioRepository;

    public PontuacaoService(PalpiteRepository palpiteRepository,
                            PartidaRepository partidaRepository,
                            UsuarioRepository usuarioRepository) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Calcula (ou recalcula) a pontuacao de TODOS os palpites de uma partida.
     * Chamar depois que o admin salvar o placar.
     * Serve tanto para o lancamento inicial (RF-030) quanto para a correcao
     * de um resultado ja lancado (RF-044). Tudo em uma transacao unica para
     * garantir consistencia (Regra 4.3).
     */
    @Transactional
    public void processarResultado(Long partidaId) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Partida nao encontrada: " + partidaId));

        if (partida.getGolsMandante() == null || partida.getGolsVisitante() == null) {
            throw new IllegalStateException("O resultado da partida ainda nao foi lancado.");
        }

        List<Palpite> palpites = palpiteRepository.findByPartidaId(partidaId);

        for (Palpite palpite : palpites) {
            int pontosAntigos = palpite.getPontos() == null ? 0 : palpite.getPontos();
            boolean eraExato = palpite.getCriterio() == CriterioPontuacao.PLACAR_EXATO;

            ResultadoCalculo calculo = calcular(palpite, partida);

            palpite.setPontos(calculo.pontos());
            palpite.setCriterio(calculo.criterio());
            palpiteRepository.save(palpite);

            Usuario usuario = palpite.getUsuario();
            usuario.setPontuacaoTotal(
                    usuario.getPontuacaoTotal() - pontosAntigos + calculo.pontos());

            int exatoNovo = calculo.criterio() == CriterioPontuacao.PLACAR_EXATO ? 1 : 0;
            int exatoAntigo = eraExato ? 1 : 0;
            usuario.setPlacaresExatos(
                    usuario.getPlacaresExatos() - exatoAntigo + exatoNovo);

            usuarioRepository.save(usuario);
        }

        partida.setStatus("ENCERRADA");
        partidaRepository.save(partida);
    }

    /**
     * Regra oficial (RF-031 / Regra 4.1):
     *  placar exato -> 10 | acertou vencedor/empate -> 5 | errou -> 0
     */
    private ResultadoCalculo calcular(Palpite palpite, Partida partida) {
        int pm = palpite.getGolsMandante();
        int pv = palpite.getGolsVisitante();
        int rm = partida.getGolsMandante();
        int rv = partida.getGolsVisitante();

        if (pm == rm && pv == rv) {
            return new ResultadoCalculo(10, CriterioPontuacao.PLACAR_EXATO);
        }
        if (Integer.signum(pm - pv) == Integer.signum(rm - rv)) {
            return new ResultadoCalculo(5, CriterioPontuacao.VENCEDOR);
        }
        return new ResultadoCalculo(0, CriterioPontuacao.ERRO);
    }

    private record ResultadoCalculo(int pontos, CriterioPontuacao criterio) {
    }
}