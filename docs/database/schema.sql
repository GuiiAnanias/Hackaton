CREATE DATABASE IF NOT EXISTS bolao_copa_2026 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bolao_copa_2026;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    perfil ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    bloqueado BOOLEAN NOT NULL DEFAULT FALSE,
    pontuacao_total INT NOT NULL DEFAULT 0,
    placares_exatos INT NOT NULL DEFAULT 0,
    ultimo_acesso DATETIME,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS selecoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    codigo_fifa VARCHAR(10) NOT NULL UNIQUE,
    bandeira_url VARCHAR(255),
    grupo VARCHAR(10),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partidas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    selecao_a_id BIGINT NOT NULL,
    selecao_b_id BIGINT NOT NULL,
    data_hora DATETIME NOT NULL,
    fase VARCHAR(60) NOT NULL,
    estadio VARCHAR(120),
    grupo VARCHAR(10),
    status ENUM('AGENDADA', 'EM_ANDAMENTO', 'ENCERRADA') NOT NULL DEFAULT 'AGENDADA',
    gols_selecao_a INT,
    gols_selecao_b INT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_partidas_selecao_a FOREIGN KEY (selecao_a_id) REFERENCES selecoes(id),
    CONSTRAINT fk_partidas_selecao_b FOREIGN KEY (selecao_b_id) REFERENCES selecoes(id)
);

CREATE TABLE IF NOT EXISTS palpites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    partida_id BIGINT NOT NULL,
    gols_selecao_a INT NOT NULL,
    gols_selecao_b INT NOT NULL,
    pontos_obtidos INT NOT NULL DEFAULT 0,
    criterio_pontuacao ENUM('PLACAR_EXATO', 'VENCEDOR_EMPATE', 'ERRO_TOTAL', 'PENDENTE') NOT NULL DEFAULT 'PENDENTE',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_palpites_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_palpites_partida FOREIGN KEY (partida_id) REFERENCES partidas(id),
    CONSTRAINT uk_palpites_usuario_partida UNIQUE (usuario_id, partida_id)
);

CREATE INDEX idx_usuarios_ranking ON usuarios (pontuacao_total DESC, placares_exatos DESC, criado_em ASC);
CREATE INDEX idx_partidas_status ON partidas (status);
CREATE INDEX idx_partidas_data_hora ON partidas (data_hora);
CREATE INDEX idx_palpites_usuario ON palpites (usuario_id);
CREATE INDEX idx_palpites_partida ON palpites (partida_id);