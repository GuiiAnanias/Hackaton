package br.com.bolao.backend.dto.admin;

public record UsuarioAdminDTO(
        Long id,
        String nome,
        String email,
        String perfil,
        boolean ativo,
        int pontuacaoTotal,
        int placaresExatos,
        String criadoEm,
        String ultimoAcessoEm,
        String avatarUrl,
        long totalPalpites
) {
}
