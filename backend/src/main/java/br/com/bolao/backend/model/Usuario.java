package br.com.bolao.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha; // Parte do guilherme integrante 1

    private boolean ativo = true;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "ultimo_acesso_em")
    private LocalDateTime ultimoAcessoEm;

    @Column(name = "token_recuperacao_senha", length = 120)
    private String tokenRecuperacaoSenha;

    @Column(name = "token_recuperacao_expira_em")
    private LocalDateTime tokenRecuperacaoExpiraEm;

    // --- Campos do Integrante 1 (seguranca + pontuacao) ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil = Perfil.USER;

    @Column(name = "pontuacao_total", nullable = false)
    private int pontuacaoTotal = 0;

    @Column(name = "placares_exatos", nullable = false)
    private int placaresExatos = 0;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void aoCriar() {
        if (this.criadoEm == null) {
            this.criadoEm = LocalDateTime.now();
        }
        if (this.perfil == null) {
            this.perfil = Perfil.USER;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getUltimoAcessoEm() { return ultimoAcessoEm; }
    public void setUltimoAcessoEm(LocalDateTime ultimoAcessoEm) { this.ultimoAcessoEm = ultimoAcessoEm; }

    public String getTokenRecuperacaoSenha() { return tokenRecuperacaoSenha; }
    public void setTokenRecuperacaoSenha(String tokenRecuperacaoSenha) { this.tokenRecuperacaoSenha = tokenRecuperacaoSenha; }

    public LocalDateTime getTokenRecuperacaoExpiraEm() { return tokenRecuperacaoExpiraEm; }
    public void setTokenRecuperacaoExpiraEm(LocalDateTime tokenRecuperacaoExpiraEm) { this.tokenRecuperacaoExpiraEm = tokenRecuperacaoExpiraEm; }

    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }

    public int getPontuacaoTotal() { return pontuacaoTotal; }
    public void setPontuacaoTotal(int pontuacaoTotal) { this.pontuacaoTotal = pontuacaoTotal; }

    public int getPlacaresExatos() { return placaresExatos; }
    public void setPlacaresExatos(int placaresExatos) { this.placaresExatos = placaresExatos; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
