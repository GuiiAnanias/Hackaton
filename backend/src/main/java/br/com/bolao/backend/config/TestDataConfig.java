package br.com.bolao.backend.config;

import br.com.bolao.backend.model.Usuario;
import br.com.bolao.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestDataConfig {

    @Bean
    public CommandLineRunner initDatabase(UsuarioRepository repository) {
        return args -> {
            // Só insere se o banco estiver vazio
            if (repository.count() == 0) {
                Usuario user = new Usuario();
                user.setNome("João Hackathon");
                user.setEmail("joao@email.com");
                user.setSenha("senha123");
                user.setAtivo(true);

                repository.save(user);
                System.out.println("✅ USUÁRIO DE TESTE INSERIDO COM SUCESSO!");
            }
        };
    }
}