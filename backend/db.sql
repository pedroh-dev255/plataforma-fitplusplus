-- Active: 1760465922950@@phsolucoes.space@3306@fitplusplus
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
  lesao BOOLEAN not null,
  nivel INT DEFAULT 1,
  pontos INT DEFAULT 0,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
select * from usuarios;

alter TABLE usuarios
  add COLUMN lesao BOOLEAN not null;
-- -----------------------------------------------------
-- Tabela: Lesões
-- -----------------------------------------------------
CREATE TABLE lesoes (
  id int NOT NULL AUTO_INCREMENT,
  id_usuario int not null,
  cabeca      BOOLEAN,
  pescoco     BOOLEAN,
  ombros      BOOLEAN,
  peito       BOOLEAN,
  bracos      BOOLEAN,
  torco       BOOLEAN,
  maos        BOOLEAN,
  pernas      BOOLEAN,
  joelho      BOOLEAN,
  panturrilha BOOLEAN,
  pes         BOOLEAN,

  PRIMARY KEY(id),
  Foreign Key (id_usuario) REFERENCES usuarios(id)
);

-- -----------------------------------------------------
-- Tabela: Redefinição de senhas
-- -----------------------------------------------------
CREATE TABLE resetPass(
	id int not null auto_increment,
    usuario_id int not null,
    token varchar(10) not null unique,
    expires_at datetime not null,
	creat_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    primary key(id),
    foreign key(usuario_id) references usuarios(id)
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
select * from esportes;
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

select * from professores;
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
  tipo ENUM('publico','particular') DEFAULT 'publico',
  status ENUM('aberto','fechado','cancelado') DEFAULT 'aberto',
  PRIMARY KEY (id),
  FOREIGN KEY (criador_id) REFERENCES usuarios (id),
  FOREIGN KEY (esporte_id) REFERENCES esportes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
alter table eventos
  add COLUMN tipo ENUM('publico','particular') DEFAULT 'publico';
drop table eventos;
drop table evento_participantes;
-- -----------------------------------------------------
-- Tabela: evento_participantes
-- -----------------------------------------------------
CREATE TABLE evento_participantes (
  id INT NOT NULL AUTO_INCREMENT,
  evento_id INT NOT NULL,
  usuario_id INT NOT NULL,
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

/*
INSERT INTO esportes (nome, descricao) VALUES
('Futebol', 'Esporte coletivo jogado com uma bola entre duas equipes de 11 jogadores.'),
('Basquete', 'Jogado por duas equipes de cinco jogadores que tentam acertar a bola em uma cesta.'),
('Vôlei', 'Disputado entre duas equipes separadas por uma rede, com o objetivo de fazer a bola tocar o chão adversário.'),
('Tênis', 'Esporte individual ou em duplas, com raquetes e uma bola em quadra dividida por rede.'),
('Tênis de Mesa', 'Versão de mesa do tênis, praticada com pequenas raquetes e bola leve.'),
('Beisebol', 'Esporte coletivo com taco e bola, popular nos EUA e Japão.'),
('Softbol', 'Variante do beisebol, geralmente jogado por mulheres.'),
('Golfe', 'Jogo em que o objetivo é acertar bolas em buracos com o menor número de tacadas possível.'),
('Hóquei no Gelo', 'Jogado em pistas de gelo com tacos e disco de borracha.'),
('Hóquei sobre Grama', 'Versão do hóquei jogada em campo, com tacos e bola.'),
('Rúgbi', 'Jogado com uma bola oval, mistura força, velocidade e estratégia.'),
('Críquete', 'Esporte com taco e bola, muito popular na Inglaterra e na Índia.'),
('Handebol', 'Esporte coletivo jogado com as mãos, em quadra, com o objetivo de marcar gols.'),
('Futebol Americano', 'Esporte de contato com bola oval, muito popular nos EUA.'),
('Futebol de Salão', 'Versão do futebol jogada em quadra coberta, com times de 5 jogadores.'),
('Boxe', 'Esporte de combate entre dois atletas que usam luvas.'),
('MMA', 'Artes marciais mistas, combinando diversas técnicas de luta.'),
('Jiu-Jitsu', 'Arte marcial focada em alavancas, imobilizações e finalizações.'),
('Judô', 'Arte marcial japonesa que enfatiza arremessos e controle.'),
('Karatê', 'Arte marcial japonesa baseada em golpes com mãos e pés.'),
('Taekwondo', 'Arte marcial coreana com ênfase em chutes rápidos e precisos.'),
('Muay Thai', 'Arte marcial tailandesa que utiliza punhos, cotovelos, joelhos e canelas.'),
('Esgrima', 'Esporte de combate com espadas, exige agilidade e precisão.'),
('Ciclismo', 'Modalidade que envolve corridas de bicicleta em estrada ou pista.'),
('Mountain Bike', 'Versão do ciclismo em terrenos acidentados.'),
('Atletismo', 'Conjunto de esportes que inclui corrida, salto e arremesso.'),
('Maratona', 'Corrida de longa distância com 42,195 km.'),
('Caminhada Atlética', 'Prova de atletismo onde um pé deve sempre tocar o solo.'),
('Salto em Altura', 'Atleta deve ultrapassar uma barra na maior altura possível.'),
('Salto com Vara', 'Atleta usa uma vara para saltar uma grande altura.'),
('Arremesso de Peso', 'Competição de força onde se lança uma esfera pesada.'),
('Natação', 'Esporte aquático com diferentes estilos de nado.'),
('Polo Aquático', 'Esporte coletivo jogado em piscina, semelhante ao handebol.'),
('Saltos Ornamentais', 'Saltos em piscina com acrobacias e estilo.'),
('Surfe', 'Esporte praticado sobre ondas com prancha.'),
('Bodyboard', 'Similar ao surfe, mas com prancha menor e deitado.'),
('Skate', 'Praticado sobre prancha com rodas em rampas ou ruas.'),
('Snowboard', 'Esporte de neve com prancha descendo montanhas.'),
('Esqui', 'Deslizar sobre a neve com esquis presos aos pés.'),
('Escalada', 'Atividade de subir rochas, paredes ou estruturas artificiais.'),
('Alpinismo', 'Escalada em montanhas de grande altitude.'),
('Canoagem', 'Uso de canoa ou caiaque para navegar em rios ou mares.'),
('Remo', 'Esporte aquático com barcos movidos a remos.'),
('Vela', 'Esporte náutico que utiliza embarcações movidas pelo vento.'),
('Mergulho', 'Atividade subaquática recreativa ou esportiva.'),
('Tiro com Arco', 'Esporte de precisão com arco e flecha.'),
('Tiro Esportivo', 'Uso de armas de fogo ou ar comprimido para acertar alvos.'),
('Hipismo', 'Equitação esportiva com obstáculos.'),
('Ginástica Artística', 'Modalidade com acrobacias em aparelhos.'),
('Ginástica Rítmica', 'Combina dança, música e aparelhos leves.'),
('Ginástica de Trampolim', 'Saltos e acrobacias em trampolim elástico.'),
('Patinação Artística', 'Dança e acrobacias sobre o gelo.'),
('Patinação de Velocidade', 'Corridas em patins no gelo ou asfalto.'),
('Triatlo', 'Combinação de natação, ciclismo e corrida.'),
('Duatlo', 'Combinação de corrida e ciclismo.'),
('Pentatlo Moderno', 'Cinco provas: natação, hipismo, tiro, esgrima e corrida.'),
('Corrida de Orientação', 'Corrida com mapa e bússola em terreno variado.'),
('Automobilismo', 'Corridas de carros em circuitos.'),
('Kart', 'Categoria base do automobilismo, com pequenos veículos.'),
('Motocross', 'Corrida de motos em terrenos acidentados.'),
('Rali', 'Corridas de carros em estradas abertas e off-road.'),
('Drift', 'Técnica de direção onde o carro desliza nas curvas.'),
('Skiboard', 'Esporte de inverno que combina esqui e snowboard.'),
('Corrida de Rua', 'Corridas urbanas de curta ou longa distância.'),
('Corrida de Montanha', 'Corrida em trilhas e terrenos irregulares.'),
('Arco e Flecha Tradicional', 'Versão clássica do tiro com arco.'),
('Cabo de Guerra', 'Competição de força entre duas equipes puxando uma corda.'),
('Esportes Eletrônicos (eSports)', 'Competições de videogames organizadas.'),
('Xadrez', 'Jogo de estratégia considerado esporte mental.'),
('Damas', 'Jogo de tabuleiro com movimentos diagonais e capturas.'),
('Sinuca', 'Jogo de mesa com tacos e bolas numeradas.'),
('Bilhar', 'Variante da sinuca com regras específicas.'),
('Boliche', 'Derrubar pinos com uma bola pesada em pista.'),
('Frisbee', 'Jogo recreativo ou competitivo com disco plástico.'),
('Ultimate Frisbee', 'Versão competitiva do frisbee em equipe.'),
('Paintball', 'Jogo de simulação de combate com marcadores de tinta.'),
('Airsoft', 'Simulação de combate com réplicas de armas que disparam esferas.'),
('Corrida de Obstáculos', 'Provas que combinam corrida e obstáculos físicos.'),
('Parkour', 'Movimento livre em ambientes urbanos superando obstáculos.'),
('Capoeira', 'Arte marcial brasileira que combina luta, dança e música.'),
('Pólo', 'Jogado a cavalo com tacos e bola.'),
('Pesca Esportiva', 'Captura de peixes por lazer ou competição.'),
('Tirolesa', 'Descida controlada em cabos suspensos.'),
('Slackline', 'Equilíbrio sobre uma fita esticada.'),
('Corrida de Cavalos', 'Provas de velocidade entre cavalos.'),
('Corrida de Barcos', 'Competições náuticas de velocidade.'),
('Corrida de Drones', 'Provas de velocidade com drones controlados remotamente.'),
('Parapente', 'Voo livre com equipamento semelhante a um paraquedas.'),
('Asa-Delta', 'Voo não motorizado usando estrutura rígida.'),
('Paraquedismo', 'Salto de aeronave com paraquedas.'),
('BMX', 'Ciclismo acrobático e de corrida em pistas curtas.'),
('Kitesurf', 'Esporte aquático com prancha e pipa controlável.'),
('Windsurf', 'Combina vela e prancha em movimento sobre a água.'),
('Wakeboard', 'Esporte aquático com prancha puxada por barco.'),
('Escalada Esportiva', 'Versão competitiva da escalada com rotas definidas.'),
('Corrida de Revezamento', 'Corrida em equipe com passagem de bastão.'),
('Badminton', 'Esporte com raquete e peteca leve.'),
('Squash', 'Jogo em quadra fechada com raquete e bola pequena.'),
('Frescobol', 'Jogo de praia com raquetes e bola de borracha.'),
('Bocha', 'Jogo de precisão com bolas arremessadas próximas a um alvo.'),
('Luta Olímpica', 'Esporte de combate corpo a corpo com técnicas de projeção.'),
('Sumô', 'Luta tradicional japonesa entre atletas de grande porte.'),
('Corrida de Patins', 'Provas de velocidade em patins inline.'),
('Corrida de Canoas', 'Prova de velocidade em embarcações leves.'),
('Rafting', 'Descida de rios com corredeiras em bote inflável.');
