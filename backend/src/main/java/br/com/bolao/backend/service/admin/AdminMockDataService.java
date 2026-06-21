package br.com.bolao.backend.service.admin;

import br.com.bolao.backend.dto.admin.UsuarioRankingBaseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminMockDataService {
    public List<UsuarioRankingBaseDTO> listarUsuariosRanking() {
        return List.of(
                new UsuarioRankingBaseDTO("Ana Silva", 150, 8, LocalDate.of(2026, 2, 10)),
                new UsuarioRankingBaseDTO("João Pereira", 150, 6, LocalDate.of(2026, 2, 8)),
                new UsuarioRankingBaseDTO("Bruno Costa", 150, 8, LocalDate.of(2026, 2, 5)),
                new UsuarioRankingBaseDTO("Marcos Lima", 135, 7, LocalDate.of(2026, 2, 15)),
                new UsuarioRankingBaseDTO("Carla Souza", 120, 5, LocalDate.of(2026, 2, 20)),
                new UsuarioRankingBaseDTO("Pedro Alves", 110, 4, LocalDate.of(2026, 2, 23)),
                new UsuarioRankingBaseDTO("Lucas Santos", 95, 3, LocalDate.of(2026, 3, 1)),
                new UsuarioRankingBaseDTO("Fernanda Rocha", 90, 3, LocalDate.of(2026, 3, 3)),
                new UsuarioRankingBaseDTO("Rafael Nunes", 85, 2, LocalDate.of(2026, 3, 5)),
                new UsuarioRankingBaseDTO("Juliana Martins", 80, 2, LocalDate.of(2026, 3, 7)),
                new UsuarioRankingBaseDTO("Gustavo Mendes", 75, 2, LocalDate.of(2026, 3, 10)),
                new UsuarioRankingBaseDTO("Camila Ferreira", 70, 1, LocalDate.of(2026, 3, 12))
        );
    }
}