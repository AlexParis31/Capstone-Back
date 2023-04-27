CREATE DATABASE pernbank;

CREATE TABLE transactions(
    transaction_id SERIAL PRIMARY KEY, name varchar(30), amount numeric(12,2), date varchar(30)
);

