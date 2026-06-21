package br.com.bolao.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com a Seleção Mandante
    @ManyToOne
    @JoinColumn(name = "selecao_mandante_id", nullable = false)
    private Selecao selecaoMandante;

    // Relacionamento com a Seleção Visitante
    @ManyToOne
    @JoinColumn(name = "selecao_visitante_id", nullable = false)
    private Selecao selecaoVisitante;

    private LocalDateTime dataHora;
    private String fase;
    private String estadio;
    private String grupo;

    // Campos para o RF-043 e RF-044 (Resultados)
    private Integer golsMandante;
    private Integer golsVisitante;

    // Status: AGENDADA, EM_ANDAMENTO, ENCERRADA
    private String status = "AGENDADA";

    // TODO: Gere os Getters e Setters (ou use @Data do Lombok se estiver usando)
    // Construtores vazio e com parâmetros...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Selecao getSelecaoMandante() {
        return selecaoMandante;
    }

    public void setSelecaoMandante(Selecao selecaoMandante) {
        this.selecaoMandante = selecaoMandante;
    }

    public Selecao getSelecaoVisitante() {
        return selecaoVisitante;
    }

    public void setSelecaoVisitante(Selecao selecaoVisitante) {
        this.selecaoVisitante = selecaoVisitante;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getFase() {
        return fase;
    }

    public void setFase(String fase) {
        this.fase = fase;
    }

    public String getEstadio() {
        return estadio;
    }

    public void setEstadio(String estadio) {
        this.estadio = estadio;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public Integer getGolsMandante() {
        return golsMandante;
    }

    public void setGolsMandante(Integer golsMandante) {
        this.golsMandante = golsMandante;
    }

    public Integer getGolsVisitante() {
        return golsVisitante;
    }

    public void setGolsVisitante(Integer golsVisitante) {
        this.golsVisitante = golsVisitante;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}