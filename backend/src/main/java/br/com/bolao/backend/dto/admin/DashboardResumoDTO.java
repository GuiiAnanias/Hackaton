package br.com.bolao.backend.dto.admin;

public record DashboardResumoDTO(
        int totalUsuarios,
        int totalPalpites,
        int partidasPendentes,
        int usuariosAtivos
) {
}