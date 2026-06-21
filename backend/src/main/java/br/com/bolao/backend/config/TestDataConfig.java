package br.com.bolao.backend.config;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PartidaRepository;
import br.com.bolao.backend.repository.SelecaoRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class TestDataConfig {

    @Bean
    public CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            SelecaoRepository selecaoRepository,
            PartidaRepository partidaRepository
    ) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario usuario = new Usuario();
                usuario.setNome("João Hackathon");
                usuario.setEmail("joao@email.com");
                usuario.setSenha("senha123");
                usuario.setAtivo(true);

                usuarioRepository.save(usuario);
            }

            if (selecaoRepository.count() == 0) {
                Selecao brasil = criarSelecao("Brasil", "BRA", "G", "brasil.png");
                Selecao argentina = criarSelecao("Argentina", "ARG", "G", "argentina.png");
                Selecao franca = criarSelecao("França", "FRA", "H", "franca.png");
                Selecao alemanha = criarSelecao("Alemanha", "ALE", "H", "alemanha.png");
                Selecao espanha = criarSelecao("Espanha", "ESP", "B", "espanha.png");
                Selecao portugal = criarSelecao("Portugal", "POR", "B", "portugal.png");

                selecaoRepository.save(brasil);
                selecaoRepository.save(argentina);
                selecaoRepository.save(franca);
                selecaoRepository.save(alemanha);
                selecaoRepository.save(espanha);
                selecaoRepository.save(portugal);
            }

            if (partidaRepository.count() == 0) {
                Selecao brasil = selecaoRepository.findAll()
                        .stream()
                        .filter(selecao -> selecao.getCodigoFifa().equals("BRA"))
                        .findFirst()
                        .orElseThrow();

                Selecao argentina = selecaoRepository.findAll()
                        .stream()
                        .filter(selecao -> selecao.getCodigoFifa().equals("ARG"))
                        .findFirst()
                        .orElseThrow();

                Selecao franca = selecaoRepository.findAll()
                        .stream()
                        .filter(selecao -> selecao.getCodigoFifa().equals("FRA"))
                        .findFirst()
                        .orElseThrow();

                Selecao alemanha = selecaoRepository.findAll()
                        .stream()
                        .filter(selecao -> selecao.getCodigoFifa().equals("ALE"))
                        .findFirst()
                        .orElseThrow();

                Selecao espanha = selecaoRepository.findAll()
                        .stream()
                        .filter(selecao -> selecao.getCodigoFifa().equals("ESP"))
                        .findFirst()
                        .orElseThrow();

                Selecao portugal = selecaoRepository.findAll()
                        .stream()
                        .filter(selecao -> selecao.getCodigoFifa().equals("POR"))
                        .findFirst()
                        .orElseThrow();

                partidaRepository.save(criarPartida(brasil, argentina, "Final", "MetLife Stadium", "G", LocalDateTime.of(2026, 7, 16, 16, 0), "AGENDADA", null, null));
                partidaRepository.save(criarPartida(franca, alemanha, "Semifinal", "AT&T Stadium", "H", LocalDateTime.of(2026, 7, 12, 15, 0), "AGENDADA", null, null));
                partidaRepository.save(criarPartida(espanha, portugal, "Quartas", "Hard Rock Stadium", "B", LocalDateTime.of(2026, 7, 8, 18, 0), "ENCERRADA", 2, 1));
            }
        };
    }

    private Selecao criarSelecao(String nome, String codigoFifa, String grupo, String bandeira) {
        Selecao selecao = new Selecao();
        selecao.setNome(nome);
        selecao.setCodigoFifa(codigoFifa);
        selecao.setGrupo(grupo);
        selecao.setBandeira(bandeira);
        return selecao;
    }

    private Partida criarPartida(
            Selecao mandante,
            Selecao visitante,
            String fase,
            String estadio,
            String grupo,
            LocalDateTime dataHora,
            String status,
            Integer golsMandante,
            Integer golsVisitante
    ) {
        Partida partida = new Partida();
        partida.setSelecaoMandante(mandante);
        partida.setSelecaoVisitante(visitante);
        partida.setFase(fase);
        partida.setEstadio(estadio);
        partida.setGrupo(grupo);
        partida.setDataHora(dataHora);
        partida.setStatus(status);
        partida.setGolsMandante(golsMandante);
        partida.setGolsVisitante(golsVisitante);
        return partida;
    }
}