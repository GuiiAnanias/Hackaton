package br.com.bolao.backend.model;

public enum FaseCopa {

    FASE_DE_GRUPOS("Fase de grupos"),
    RODADA_DE_32("Rodada de 32"),
    OITAVAS_DE_FINAL("Oitavas de final"),
    QUARTAS_DE_FINAL("Quartas de final"),
    SEMIFINAL("Semifinal"),
    DISPUTA_TERCEIRO_LUGAR("Disputa de terceiro lugar"),
    FINAL("Final");

    private final String descricao;

    FaseCopa(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}