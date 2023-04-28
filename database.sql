CREATE DATABASE pernbank;

CREATE TABLE transactions(
    transaction_id SERIAL PRIMARY KEY, name varchar(30), amount numeric(12,2), date varchar(30), category varchar(30)
);

CREATE TABLE sum(
    transaction_id SERIAL PRIMARY KEY, fundss decimal
);

CREATE TABLE myfunds(
    transaction_id SERIAL PRIMARY KEY, funds decimal
)

INSERT INTO sum (amount) VALUES ((SELECT SUM (amount) FROM transactions));
