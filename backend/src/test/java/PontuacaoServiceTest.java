package br.com.bolao.backend;

import br.com.bolao.backend.model.*;
import br.com.bolao.backend.repository.*;
import br.com.bolao.backend.service.PontuacaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class PontuacaoServiceTest {

    @Autowired PontuacaoService pontuacaoService;
    @Autowired SelecaoRepository selecaoRepository;
    @Autowired PartidaRepository partidaRepository;
    @Autowired UsuarioRepository usuarioRepository;
    @Autowired PalpiteRepository palpiteRepository;

    @Test
    void placarExatoVale10() {
        Partida p = partida("Teste A", "TSA", "Teste B", "TSB", 2, 1);
        Usuario u = usuario("exato@teste.com");
        palpite(u, p, 2, 1);

        pontuacaoService.processarResultado(p.getId());

        Usuario salvo = usuarioRepository.findById(u.getId()).orElseThrow();
        assertEquals(10, salvo.getPontuacaoTotal());
        assertEquals(1, salvo.getPlacaresExatos());
    }

    @Test
    void acertarSoOVencedorVale5() {
        Partida p = partida("Teste C", "TSC", "Teste D", "TSD", 3, 0);
        Usuario u = usuario("vencedor@teste.com");
        palpite(u, p, 1, 0);

        pontuacaoService.processarResultado(p.getId());

        assertEquals(5, usuarioRepository.findById(u.getId()).orElseThrow().getPontuacaoTotal());
    }

    @Test
    void errarVale0() {
        Partida p = partida("Teste E", "TSE", "Teste F", "TSF", 0, 2);
        Usuario u = usuario("errou@teste.com");
        palpite(u, p, 1, 0);

        pontuacaoService.processarResultado(p.getId());

        assertEquals(0, usuarioRepository.findById(u.getId()).orElseThrow().getPontuacaoTotal());
    }

    @Test
    void corrigirResultadoRecalculaSemSomarEmDobro() {
        Partida p = partida("Teste G", "TSG", "Teste H", "TSH", 2, 1);
        Usuario u = usuario("recalc@teste.com");
        palpite(u, p, 2, 1);

        pontuacaoService.processarResultado(p.getId()); // 10 pontos (exato)
        assertEquals(10, usuarioRepository.findById(u.getId()).orElseThrow().getPontuacaoTotal());

        p.setGolsMandante(0);
        p.setGolsVisitante(0);
        partidaRepository.save(p);
        pontuacaoService.processarResultado(p.getId()); // recalculado -> 0

        Usuario salvo = usuarioRepository.findById(u.getId()).orElseThrow();
        assertEquals(0, salvo.getPontuacaoTotal());
        assertEquals(0, salvo.getPlacaresExatos());
    }

    // helpers
    private Partida partida(String nomeA, String codA, String nomeB, String codB, int golsA, int golsB) {
        Selecao a = new Selecao(); a.setNome(nomeA); a.setCodigoFifa(codA); a.setGrupo("Z");
        Selecao b = new Selecao(); b.setNome(nomeB); b.setCodigoFifa(codB); b.setGrupo("Z");
        selecaoRepository.save(a); selecaoRepository.save(b);
        Partida p = new Partida();
        p.setSelecaoMandante(a); p.setSelecaoVisitante(b);
        p.setFase("Teste"); p.setStatus("AGENDADA");
        p.setGolsMandante(golsA); p.setGolsVisitante(golsB);
        return partidaRepository.save(p);
    }

    private Usuario usuario(String email) {
        Usuario u = new Usuario();
        u.setNome("Teste"); u.setEmail(email); u.setSenha("x");
        u.setPerfil(Perfil.USER); u.setAtivo(true);
        return usuarioRepository.save(u);
    }

    private Palpite palpite(Usuario u, Partida p, int golsA, int golsB) {
        Palpite palpite = new Palpite();
        palpite.setUsuario(u); palpite.setPartida(p);
        palpite.setGolsMandante(golsA); palpite.setGolsVisitante(golsB);
        return palpiteRepository.save(palpite);
    }
}