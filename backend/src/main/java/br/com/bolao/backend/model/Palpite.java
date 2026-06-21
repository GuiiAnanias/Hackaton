package br.com.bolao.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "palpites",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_palpite_usuario_partida",
                columnNames = {"usuario_id", "partida_id"}
        )
)
public class Palpite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "partida_id", nullable = false)
    private Partida partida;

    @Column(name = "gols_mandante", nullable = false)
    private Integer golsMandante;

    @Column(name = "gols_visitante", nullable = false)
    private Integer golsVisitante;

    private Integer pontos;

    @Enumerated(EnumType.STRING)
    private CriterioPontuacao criterio;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void aoCriar() {
        LocalDateTime agora = LocalDateTime.now();
        this.criadoEm = agora;
        this.atualizadoEm = agora;
    }

    @PreUpdate
    public void aoAtualizar() {
        this.atualizadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Partida getPartida() { return partida; }
    public void setPartida(Partida partida) { this.partida = partida; }

    public Integer getGolsMandante() { return golsMandante; }
    public void setGolsMandante(Integer golsMandante) { this.golsMandante = golsMandante; }

    public Integer getGolsVisitante() { return golsVisitante; }
    public void setGolsVisitante(Integer golsVisitante) { this.golsVisitante = golsVisitante; }

    public Integer getPontos() { return pontos; }
    public void setPontos(Integer pontos) { this.pontos = pontos; }

    public CriterioPontuacao getCriterio() { return criterio; }
    public void setCriterio(CriterioPontuacao criterio) { this.criterio = criterio; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}