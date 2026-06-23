package br.com.bolao.backend.config;

import br.com.bolao.backend.model.Partida;
import br.com.bolao.backend.model.Perfil;
import br.com.bolao.backend.model.Selecao;
import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.PartidaRepository;
import br.com.bolao.backend.repository.SelecaoRepository;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Configuration
public class TestDataConfig {

    private static final String FLAG_CDN_BASE_URL = "https://flagcdn.com/w80/";

    private static final Map<String, String> FLAG_CDN_CODES = Map.ofEntries(
            Map.entry("MEX", "mx"),
            Map.entry("RSA", "za"),
            Map.entry("KOR", "kr"),
            Map.entry("CZE", "cz"),
            Map.entry("CAN", "ca"),
            Map.entry("BIH", "ba"),
            Map.entry("QAT", "qa"),
            Map.entry("SUI", "ch"),
            Map.entry("BRA", "br"),
            Map.entry("MAR", "ma"),
            Map.entry("HAI", "ht"),
            Map.entry("SCO", "gb-sct"),
            Map.entry("USA", "us"),
            Map.entry("PAR", "py"),
            Map.entry("AUS", "au"),
            Map.entry("TUR", "tr"),
            Map.entry("GER", "de"),
            Map.entry("CUW", "cw"),
            Map.entry("CIV", "ci"),
            Map.entry("ECU", "ec"),
            Map.entry("NED", "nl"),
            Map.entry("JPN", "jp"),
            Map.entry("SWE", "se"),
            Map.entry("TUN", "tn"),
            Map.entry("BEL", "be"),
            Map.entry("EGY", "eg"),
            Map.entry("IRN", "ir"),
            Map.entry("NZL", "nz"),
            Map.entry("ESP", "es"),
            Map.entry("CPV", "cv"),
            Map.entry("KSA", "sa"),
            Map.entry("URU", "uy"),
            Map.entry("FRA", "fr"),
            Map.entry("SEN", "sn"),
            Map.entry("IRQ", "iq"),
            Map.entry("NOR", "no"),
            Map.entry("ARG", "ar"),
            Map.entry("ALG", "dz"),
            Map.entry("AUT", "at"),
            Map.entry("JOR", "jo"),
            Map.entry("POR", "pt"),
            Map.entry("COD", "cd"),
            Map.entry("UZB", "uz"),
            Map.entry("COL", "co"),
            Map.entry("ENG", "gb-eng"),
            Map.entry("CRO", "hr"),
            Map.entry("GHA", "gh"),
            Map.entry("PAN", "pa")
    );

    @Bean
    public CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            SelecaoRepository selecaoRepository,
            PartidaRepository partidaRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario usuario = new Usuario();
                usuario.setNome("João Hackathon");
                usuario.setEmail("joao@email.com");
                usuario.setSenha(passwordEncoder.encode("senha123"));
                usuario.setPerfil(Perfil.USER);
                usuario.setAtivo(true);
                usuarioRepository.save(usuario);

                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail("admin@email.com");
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setPerfil(Perfil.ADMIN);
                admin.setAtivo(true);
                usuarioRepository.save(admin);
            }

            garantirSelecoesDaCopa(selecaoRepository);

            if (partidaRepository.count() == 0) {
                Selecao brasil = selecaoRepository.findAll().stream()
                        .filter(s -> s.getCodigoFifa().equals("BRA")).findFirst().orElseThrow();
                Selecao argentina = selecaoRepository.findAll().stream()
                        .filter(s -> s.getCodigoFifa().equals("ARG")).findFirst().orElseThrow();
                Selecao franca = selecaoRepository.findAll().stream()
                        .filter(s -> s.getCodigoFifa().equals("FRA")).findFirst().orElseThrow();
                Selecao alemanha = selecaoRepository.findAll().stream()
                        .filter(s -> s.getCodigoFifa().equals("GER")).findFirst().orElseThrow();
                Selecao espanha = selecaoRepository.findAll().stream()
                        .filter(s -> s.getCodigoFifa().equals("ESP")).findFirst().orElseThrow();
                Selecao portugal = selecaoRepository.findAll().stream()
                        .filter(s -> s.getCodigoFifa().equals("POR")).findFirst().orElseThrow();

                partidaRepository.save(criarPartida(brasil, argentina, "Final", "MetLife Stadium", "G", LocalDateTime.of(2026, 7, 16, 16, 0), "AGENDADA", null, null));
                partidaRepository.save(criarPartida(franca, alemanha, "Semifinal", "AT&T Stadium", "H", LocalDateTime.of(2026, 7, 12, 15, 0), "AGENDADA", null, null));
                partidaRepository.save(criarPartida(espanha, portugal, "Quartas", "Hard Rock Stadium", "B", LocalDateTime.of(2026, 7, 8, 18, 0), "ENCERRADA", 2, 1));
            }
        };
    }

    private void garantirSelecoesDaCopa(SelecaoRepository selecaoRepository) {
        List<SeedSelecao> selecoes = List.of(
                new SeedSelecao("México", "MEX", "A", "🇲🇽"),
                new SeedSelecao("África do Sul", "RSA", "A", "🇿🇦"),
                new SeedSelecao("Coreia do Sul", "KOR", "A", "🇰🇷"),
                new SeedSelecao("Tchéquia", "CZE", "A", "🇨🇿"),
                new SeedSelecao("Canadá", "CAN", "B", "🇨🇦"),
                new SeedSelecao("Bósnia e Herzegovina", "BIH", "B", "🇧🇦"),
                new SeedSelecao("Catar", "QAT", "B", "🇶🇦"),
                new SeedSelecao("Suíça", "SUI", "B", "🇨🇭"),
                new SeedSelecao("Brasil", "BRA", "C", "🇧🇷"),
                new SeedSelecao("Marrocos", "MAR", "C", "🇲🇦"),
                new SeedSelecao("Haiti", "HAI", "C", "🇭🇹"),
                new SeedSelecao("Escócia", "SCO", "C", "🏴"),
                new SeedSelecao("Estados Unidos", "USA", "D", "🇺🇸"),
                new SeedSelecao("Paraguai", "PAR", "D", "🇵🇾"),
                new SeedSelecao("Austrália", "AUS", "D", "🇦🇺"),
                new SeedSelecao("Turquia", "TUR", "D", "🇹🇷"),
                new SeedSelecao("Alemanha", "GER", "E", "🇩🇪"),
                new SeedSelecao("Curaçao", "CUW", "E", "🇨🇼"),
                new SeedSelecao("Costa do Marfim", "CIV", "E", "🇨🇮"),
                new SeedSelecao("Equador", "ECU", "E", "🇪🇨"),
                new SeedSelecao("Países Baixos", "NED", "F", "🇳🇱"),
                new SeedSelecao("Japão", "JPN", "F", "🇯🇵"),
                new SeedSelecao("Suécia", "SWE", "F", "🇸🇪"),
                new SeedSelecao("Tunísia", "TUN", "F", "🇹🇳"),
                new SeedSelecao("Bélgica", "BEL", "G", "🇧🇪"),
                new SeedSelecao("Egito", "EGY", "G", "🇪🇬"),
                new SeedSelecao("Irã", "IRN", "G", "🇮🇷"),
                new SeedSelecao("Nova Zelândia", "NZL", "G", "🇳🇿"),
                new SeedSelecao("Espanha", "ESP", "H", "🇪🇸"),
                new SeedSelecao("Cabo Verde", "CPV", "H", "🇨🇻"),
                new SeedSelecao("Arábia Saudita", "KSA", "H", "🇸🇦"),
                new SeedSelecao("Uruguai", "URU", "H", "🇺🇾"),
                new SeedSelecao("França", "FRA", "I", "🇫🇷"),
                new SeedSelecao("Senegal", "SEN", "I", "🇸🇳"),
                new SeedSelecao("Iraque", "IRQ", "I", "🇮🇶"),
                new SeedSelecao("Noruega", "NOR", "I", "🇳🇴"),
                new SeedSelecao("Argentina", "ARG", "J", "🇦🇷"),
                new SeedSelecao("Argélia", "ALG", "J", "🇩🇿"),
                new SeedSelecao("Áustria", "AUT", "J", "🇦🇹"),
                new SeedSelecao("Jordânia", "JOR", "J", "🇯🇴"),
                new SeedSelecao("Portugal", "POR", "K", "🇵🇹"),
                new SeedSelecao("RD Congo", "COD", "K", "🇨🇩"),
                new SeedSelecao("Uzbequistão", "UZB", "K", "🇺🇿"),
                new SeedSelecao("Colômbia", "COL", "K", "🇨🇴"),
                new SeedSelecao("Inglaterra", "ENG", "L", "🏴"),
                new SeedSelecao("Croácia", "CRO", "L", "🇭🇷"),
                new SeedSelecao("Gana", "GHA", "L", "🇬🇭"),
                new SeedSelecao("Panamá", "PAN", "L", "🇵🇦")
        );

        selecoes.forEach(selecao -> salvarOuAtualizarSelecao(selecaoRepository, selecao));
    }

    private void salvarOuAtualizarSelecao(SelecaoRepository selecaoRepository, SeedSelecao seed) {
        Optional<Selecao> existente = selecaoRepository.findAll()
                .stream()
                .filter(selecao -> seed.codigoFifa().equalsIgnoreCase(selecao.getCodigoFifa())
                        || seed.nome().equalsIgnoreCase(selecao.getNome()))
                .findFirst();

        Selecao selecao = existente.orElseGet(Selecao::new);
        selecao.setNome(seed.nome());
        selecao.setCodigoFifa(seed.codigoFifa());
        selecao.setGrupo(seed.grupo());
        selecao.setBandeira(obterUrlBandeira(seed));

        selecaoRepository.save(selecao);
    }

    private String obterUrlBandeira(SeedSelecao seed) {
        String flagCdnCode = FLAG_CDN_CODES.get(seed.codigoFifa());
        if (flagCdnCode == null) {
            return seed.bandeira();
        }

        return FLAG_CDN_BASE_URL + flagCdnCode + ".png";
    }

    private Partida criarPartida(Selecao mandante, Selecao visitante, String fase, String estadio,
                                 String grupo, LocalDateTime dataHora, String status,
                                 Integer golsMandante, Integer golsVisitante) {
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

    private record SeedSelecao(String nome, String codigoFifa, String grupo, String bandeira) {
    }
}
