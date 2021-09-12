CREATE DATABASE escuela de vuelo;

CREATE TABLE registro(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    mail VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
);

INSERT INTO regisrto (name, last_name, mail, password) VALUES ('Santiago' 'Gonzalez' 'escuelaDeVuelo2021@hotmail.com' '$2b$10$AR8.IsOr4HROnPAagS4pfez.ragNjOFxGsiSblA0rT80rPjWBunPy' ) /* password: escuela1234*/

CREATE TABLE agenda(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    apellido VARCHAR(200) NOT NULL,
    telefono INT NOT NULL,
    mail VARCHAR(200) NOT NULL UNIQUE ,
    dia INT NOT NULL,
    mes VARCHAR(100) NOT NULL,
    hora INT NOT NULL,
    tipo_de_vuelo VARCHAR(200) NOT NULL,
    author_id BIGINT REFERENCES regisrto (id)
)

INSERT INTO agenda (name, apellido, telefono, mail, dia, mes, hora, tipo_de_vuelo) VALUES ('Santiago' 'Gonzalez' '098620' 'escuelaDeVuelo2021@hotmail.com' '10' 'OCTUBRE' '10:30' 'INSTRUCCION LOCAL' 1)