INSERT INTO usuarios (username, password) VALUES ("dummy", "dummy");

INSERT INTO ingredientes (nombre, tipoUnidad) VALUES
  ("Harina", "gramos"),
  ("Tomate", "unidades"),
  ("Mozzarella", "gramos"),
  ("Albahaca", "unidades"),
  ("Aceite de Oliva", "mililitros"),
  ("Pasta", "gramos"),
  ("Huevo", "unidades"),
  ("Panceta", "gramos"),
  ("Queso Pecorino", "gramos"),
  ("Pimienta Negra", "gramos"),
  ("Lechuga", "gramos"),
  ("Crutones", "gramos"),
  ("Aderezo César", "mililitros"),
  ("Queso Parmesano", "gramos"),
  ("Pollo", "gramos"),
  ("Tortilla", "unidades"),
  ("Cerdo", "gramos"),
  ("Piña", "gramos"),
  ("Cebolla", "unidades"),
  ("Cilantro", "gramos"),
  ("Arroz", "gramos"),
  ("Alga Nori", "unidades"),
  ("Pescado", "gramos"),
  ("Aguacate", "unidades"),
  ("Pepino", "gramos"),
  ("Pan", "unidades"),
  ("Carne de Res", "gramos"),
  ("Queso Cheddar", "gramos"),
  ("Pasta de Lasagna", "gramos"),
  ("Salsa Boloñesa", "gramos"),
  ("Queso Ricotta", "gramos"),
  ("Bechamel", "gramos"),
  ("Camarón", "unidades"),
  ("Limón", "unidades"),
  ("Berenjena", "gramos"),
  ("Calabacín", "gramos"),
  ("Pimiento", "gramos"),
  ("Chimichurri", "mililitros"),
  ("Sal", "gramos"),
  ("Ajo", "gramos");

INSERT INTO recetas (nombre, descripcion) VALUES
  ("Pizza Margherita", "Deliciosa pizza con tomate, mozzarella y albahaca."),
  ("Spaghetti Carbonara", "Pasta con huevo, queso, panceta y pimienta negra."),
  ("Ensalada César", "Lechuga romana, crutones y aderezo César."),
  ("Tacos al Pastor", "Tortilla con cerdo marinado y piña."),
  ("Sushi Roll", "Arroz, alga nori y pescado fresco en rollo."),
  ("Hamburguesa Clásica", "Carne de res, lechuga, tomate y pan brioche."),
  ("Lasagna Boloñesa", "Capas de pasta con salsa boloñesa y bechamel."),
  ("Ceviche de Camarón", "Camarones marinados en limón con cebolla y cilantro."),
  ("Ratatouille", "Guiso de verduras con berenjena, calabacín y tomate."),
  ("Churrasco Argentino", "Carne asada con chimichurri.");


INSERT INTO contiene (id_receta, id_ingrediente, unidades) VALUES
  -- Pizza Margherita
  (1, 1, 500),  -- Harina
  (1, 2, 200),  -- Tomate
  (1, 3, 150),  -- Mozzarella
  (1, 4, 10),   -- Albahaca
  (1, 5, 20),   -- Aceite de Oliva

  -- Spaghetti Carbonara
  (2, 6, 200),  -- Pasta
  (2, 7, 2),    -- Huevo
  (2, 8, 100),  -- Panceta
  (2, 9, 50),   -- Queso Pecorino
  (2, 10, 5),   -- Pimienta Negra

  -- Ensalada César
  (3, 11, 100),  -- Lechuga
  (3, 12, 50),   -- Crutones
  (3, 13, 30),   -- Aderezo César
  (3, 14, 40),   -- Queso Parmesano
  (3, 15, 150),  -- Pollo

  -- Tacos al Pastor
  (4, 16, 2),   -- Tortilla
  (4, 17, 200), -- Cerdo
  (4, 18, 50),  -- Piña
  (4, 19, 30),  -- Cebolla
  (4, 20, 20),  -- Cilantro

  -- Sushi Roll
  (5, 21, 150), -- Arroz
  (5, 22, 1),   -- Alga Nori
  (5, 23, 100), -- Pescado
  (5, 24, 50),  -- Aguacate
  (5, 25, 30),  -- Pepino

  -- Hamburguesa Clásica
  (6, 26, 1),   -- Pan
  (6, 27, 200), -- Carne de Res
  (6, 11, 50),  -- Lechuga (ya existe en Ensalada César)
  (6, 2, 50),   -- Tomate (ya existe en Pizza)
  (6, 28, 50),  -- Queso Cheddar

  -- Lasagna Boloñesa
  (7, 29, 200), -- Pasta de Lasagna
  (7, 30, 300), -- Salsa Boloñesa
  (7, 31, 150), -- Queso Ricotta
  (7, 32, 200), -- Bechamel

  -- Ceviche de Camarón
  (8, 33, 250), -- Camarón
  (8, 34, 100), -- Limón
  (8, 19, 50),  -- Cebolla (ya existe en Tacos al Pastor)
  (8, 20, 30),  -- Cilantro (ya existe en Tacos al Pastor)
  (8, 2, 50),   -- Tomate (ya existe en Pizza)

  -- Ratatouille
  (9, 35, 100), -- Berenjena
  (9, 36, 100), -- Calabacín
  (9, 37, 100), -- Pimiento
  (9, 19, 50),  -- Cebolla (ya existe en varias recetas)
  (9, 2, 100),  -- Tomate (ya existe en varias recetas)

  -- Churrasco Argentino
  (10, 27, 300), -- Carne de Res (ya existe en Hamburguesa)
  (10, 38, 50),  -- Chimichurri
  (10, 39, 10),  -- Sal
  (10, 40, 5);   -- Ajo

INSERT INTO despensa (id_usuario, id_ingrediente, caducidad, cantidad) VALUES
  (1, 1, '2025-12-31', 1000),  -- Harina
  (1, 2, '2025-10-15', 500),   -- Tomate
  (1, 3, '2025-09-20', 300),   -- Mozzarella
  (1, 4, '2025-08-10', 50),    -- Albahaca
  (1, 5, '2025-11-25', 100),   -- Aceite de Oliva

  (1, 6, '2025-07-05', 500),   -- Pasta
  (1, 7, '2025-06-30', 12),    -- Huevo
  (1, 8, '2025-09-15', 200),   -- Panceta
  (1, 9, '2025-12-10', 150),   -- Queso Pecorino
  (1, 10, '2026-01-01', 50),   -- Pimienta Negra

  (1, 11, '2025-05-20', 300),  -- Lechuga
  (1, 12, '2025-09-01', 200),  -- Crutones
  (1, 13, '2025-10-10', 100),  -- Aderezo César
  (1, 14, '2025-08-15', 150),  -- Queso Parmesano
  (1, 15, '2025-06-22', 400),  -- Pollo

  (1, 16, '2025-07-01', 10),   -- Tortilla
  (1, 17, '2025-06-18', 500),  -- Cerdo
  (1, 18, '2025-06-25', 200),  -- Piña
  (1, 19, '2025-06-12', 150),  -- Cebolla
  (1, 20, '2025-07-10', 100),  -- Cilantro

  (1, 21, '2025-09-30', 1000), -- Arroz
  (1, 22, '2026-02-01', 20),   -- Alga Nori
  (1, 23, '2025-06-05', 300),  -- Pescado
  (1, 24, '2025-05-28', 200),  -- Aguacate
  (1, 25, '2025-06-08', 150),  -- Pepino

  (1, 26, '2025-07-15', 5),    -- Pan
  (1, 27, '2025-06-10', 800),  -- Carne de Res
  (1, 28, '2025-05-29', 200),  -- Queso Cheddar

  (1, 29, '2025-12-31', 500),  -- Pasta de Lasagna
  (1, 30, '2025-10-10', 600),  -- Salsa Boloñesa
  (1, 31, '2025-09-20', 300),  -- Queso Ricotta
  (1, 32, '2025-08-25', 400),  -- Bechamel

  (1, 33, '2025-06-18', 500),  -- Camarón
  (1, 34, '2025-07-30', 250),  -- Limón

  (1, 35, '2025-06-15', 400),  -- Berenjena
  (1, 36, '2025-06-20', 300),  -- Calabacín
  (1, 37, '2025-06-25', 350),  -- Pimiento

  (1, 38, '2026-01-10', 100),  -- Chimichurri
  (1, 39, '2026-12-31', 500),  -- Sal
  (1, 40, '2025-09-15', 200);  -- Ajo

