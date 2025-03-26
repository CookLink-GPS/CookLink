DROP TABLE usuarios;
DROP TABLE ingredientes;
DROP TABLE recetas;
DROP TABLE despensa;
DROP TABLE contiene;

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
<<<<<<< HEAD
id_despensa int AUTO_INCREMENT PRIMARY KEY,
=======
  id_despensa int AUTO_INCREMENT PRIMARY KEY,
>>>>>>> 142c896 (MAL)
  id_usuario INT NOT NULL,
  id_ingrediente INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE,
<<<<<<< HEAD
=======
  CONSTRAINT fk_usuario_ingrediente_caducidad UNIQUE (id_usuario, id_ingrediente, caducidad)
>>>>>>> 142c896 (MAL)
);

CREATE table contiene (
  id_receta INT,
  id_ingrediente INT,
  unidades INT CHECK (unidades > 0),
  PRIMARY KEY (id_receta, id_ingrediente),
  CONSTRAINT fk_receta FOREIGN KEY (id_receta) REFERENCES recetas(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingrediente_contiene FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id) ON DELETE CASCADE
<<<<<<< HEAD

);
=======
)
>>>>>>> 142c896 (MAL)
