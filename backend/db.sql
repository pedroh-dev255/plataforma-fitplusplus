-- -----------------------------------------------------
-- Banco de Dados: fitplusplus
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS fitplusplus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitplusplus;

-- -----------------------------------------------------
-- Tabela: usuarios
-- -----------------------------------------------------
CREATE TABLE usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('professor','aluno','praticante') NOT NULL,
  bio TEXT,
  foto_perfil VARCHAR(255),
  data_nascimento DATE,
  genero ENUM('M','F','Outro'),
  nivel INT DEFAULT 1,
  pontos INT DEFAULT 0,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: esportes
-- -----------------------------------------------------
CREATE TABLE esportes (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: professores
-- -----------------------------------------------------
CREATE TABLE professores (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  codigo_professor VARCHAR(50) NOT NULL UNIQUE,
  experiencia TEXT,
  especialidade VARCHAR(100),
  PRIMARY KEY (id),
  CONSTRAINT fk_professor_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: alunos
-- -----------------------------------------------------
CREATE TABLE alunos (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  professor_id INT DEFAULT NULL,
  objetivos TEXT,
  PRIMARY KEY (id),
  CONSTRAINT fk_aluno_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_aluno_professor FOREIGN KEY (professor_id)
    REFERENCES professores (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: usuario_esportes
-- -----------------------------------------------------
CREATE TABLE usuario_esportes (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  esporte_id INT NOT NULL,
  nivel ENUM('iniciante','intermediario','avancado') DEFAULT 'iniciante',
  PRIMARY KEY (id),
  CONSTRAINT fk_usuario_esportes_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id),
  CONSTRAINT fk_usuario_esportes_esporte FOREIGN KEY (esporte_id)
    REFERENCES esportes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: eventos
-- -----------------------------------------------------
CREATE TABLE eventos (
  id INT NOT NULL AUTO_INCREMENT,
  criador_id INT NOT NULL,
  esporte_id INT NOT NULL,
  titulo VARCHAR(150),
  descricao TEXT,
  local VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  data_hora DATETIME NOT NULL,
  max_participantes INT DEFAULT NULL,
  status ENUM('aberto','fechado','cancelado') DEFAULT 'aberto',
  PRIMARY KEY (id),
  CONSTRAINT fk_evento_criador FOREIGN KEY (criador_id)
    REFERENCES usuarios (id),
  CONSTRAINT fk_evento_esporte FOREIGN KEY (esporte_id)
    REFERENCES esportes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: evento_participantes
-- -----------------------------------------------------
CREATE TABLE evento_participantes (
  id INT NOT NULL AUTO_INCREMENT,
  evento_id INT NOT NULL,
  usuario_id INT NOT NULL,
  status ENUM('confirmado','pendente','recusado') DEFAULT 'pendente',
  PRIMARY KEY (id),
  CONSTRAINT fk_evento_participante_evento FOREIGN KEY (evento_id)
    REFERENCES eventos (id),
  CONSTRAINT fk_evento_participante_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabela: tokens_notificacao
-- -----------------------------------------------------
CREATE TABLE tokens_notificacao (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_token_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificacoes (
	id INT NOT NULL auto_increment,
    usuario_id int not null,
    title varchar(200),
    body varchar(200),
    primary key(id),
    foreign key(usuario_id) references usuarios(id)
);
select * from notificacoes;