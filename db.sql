
DROP DATABASE IF EXISTS test;

CREATE DATABASE test;

USE test;

CREATE TABLE Users(
    userid INT PRIMARY KEY auto_increment,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);