DROP TABLE usuarios;
DROP TABLE ingredientes;
DROP TABLE recetas;
DROP TABLE despensa;
DROP TABLE contiene;
DROP TABLE sesiones;

CREATE TABLE usuarios (
  id int AUTO_INCREMENT PRIMARY KEY,
  username varchar(50) NOT NULL UNIQUE CHECK (TRIM(username) != "" AND username NOT LIKE "% %"),
  password varchar(255) NOT NULL CHECK (TRIM(password) != "" AND password NOT LIKE "% %")
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ingredientes (
  id int AUTO_INCREMENT PRIMARY KEY,
  nombre varchar(50) NOT NULL UNIQUE,
  tipoUnidad varchar(50) NOT NULL    
);

CREATE TABLE recetas (
  id int AUTO_INCREMENT PRIMARY KEY,
  nombre varchar(255) NOT NULL UNIQUE,
  descripcion TEXT
);


CREATE TABLE despensa (
  id_usuario INT ,
  id_ingrediente INT,
  caducidad varchar(10) NOT NULL, 
  cantidad INT NOT NULL CHECK (cantidad > 0),
  PRIMARY KEY (id_usuario, id_ingrediente),
  CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE
);

CREATE table contiene (
  id_receta INT,
  id_ingrediente INT,
  unidades INT CHECK (unidades > 0),
  PRIMARY KEY (id_receta, id_ingrediente),
  CONSTRAINT fk_receta FOREIGN KEY (id_receta) REFERENCES recetas(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE
);

CREATE TABLE sesiones (
  id VARCHAR(128) PRIMARY KEY,         
  usuario_id INT NULL,              
  datos TEXT NOT NULL,             
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  fecha_expiracion TIMESTAMP NOT NULL, 
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
