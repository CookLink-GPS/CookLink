DROP TABLE contiene;
DROP TABLE despensa;
DROP TABLE usuarios;
DROP TABLE ingredientes;
DROP TABLE recetas;

CREATE TABLE usuarios (
  id int PRIMARY KEY AUTO_INCREMENT,
  username varchar(50) UNIQUE NOT NULL CHECK (trim(username) <> '' and username not like '% %'),
  password varchar(255) NOT NULL CHECK (trim(password) <> '' and password not like '% %')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ingredientes (
  id int PRIMARY KEY AUTO_INCREMENT,
  nombre varchar(50) UNIQUE NOT NULL,
  tipoUnidad varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE recetas (
  id int PRIMARY KEY AUTO_INCREMENT,
  nombre varchar(255) UNIQUE NOT NULL,
  descripcion text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE contiene (
  id_receta int NOT NULL,
  id_ingrediente int NOT NULL,
  unidades int DEFAULT NULL CHECK (unidades > 0),
  PRIMARY KEY (id_receta, id_ingrediente),
  CONSTRAINT fk_ingrediente_contiene FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_receta_contiene FOREIGN KEY (id_receta) REFERENCES recetas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE despensa (
  id_despensa int PRIMARY KEY AUTO_INCREMENT,
  id_usuario int NOT NULL,
  id_ingrediente int NOT NULL,
  cantidad float NOT NULL CHECK (cantidad >= 0),
  CONSTRAINT fk_ingrediente_despensa FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_despensa FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE listacompra (
  id_lista int PRIMARY KEY AUTO_INCREMENT,
  id_usuario int NOT NULL,
  id_ingrediente int NOT NULL,
  cantidad INT float NOT NULL CHECK (cantidad > 0),
  CONSTRAINT fk_usuario_compra FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingrediente_compra FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE lista_compra (
    id_lista_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_ingrediente INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id),
    UNIQUE (id_usuario, id_ingrediente)
);
