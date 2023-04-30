CREATE DATABASE pernbank;

CREATE TABLE transactionsTwo(
    transaction_id SERIAL PRIMARY KEY, name varchar(30), amount numeric(12,2), date varchar(30), category varchar(30)
);

CREATE TABLE sum(
    transaction_id SERIAL PRIMARY KEY, fundss decimal
);

CREATE TABLE myfunds(
    transaction_id SERIAL PRIMARY KEY, funds decimal
)

INSERT INTO sum (amount) VALUES ((SELECT SUM (amount) FROM transactions));

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('alex', 'parisialexander@gmail.com', 'crm18882' );
