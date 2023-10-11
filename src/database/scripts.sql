CREATE DATABASE node_server;

CREATE TABLE public.words (
	id serial NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT newtable_pk PRIMARY KEY (id)
);

CREATE TABLE public.users (
	id serial NOT NULL,
	first_name varchar NULL,
	last_name varchar NULL,
	email varchar NULL,
	username varchar NOT NULL,
	password varchar NOT NULL,
	profile_image varchar NOT NULL,
	cover_image varchar NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE TABLE public.user_friend_requests (
	id serial NOT NULL,
	sender_id int NOT NULL,
	recipient_id int NOT NULL,
	status int NOT NULL,
	CONSTRAINT friend_requests_pk PRIMARY KEY (id),
	CONSTRAINT friend_requests_fk FOREIGN KEY (sender_id) REFERENCES public.users(id),
	CONSTRAINT friend_requests_fk_1 FOREIGN KEY (recipient_id) REFERENCES public.users(id)
);

CREATE TABLE public.user_friends (
	id serial NOT NULL,
	user_id int NOT NULL,
	friend_id int NOT NULL,
	CONSTRAINT user_friends_pk PRIMARY KEY (id),
	CONSTRAINT user_friends_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
	CONSTRAINT user_friends_fk_1 FOREIGN KEY (friend_id) REFERENCES public.users(id)
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    description TEXT,
    image VARCHAR(255)
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    author_id INTEGER REFERENCES author(id),
    cover_image VARCHAR(255),
    page_count INTEGER,
    publish_date DATE
);

CREATE TABLE book_ratings (
    user_id INT REFERENCES users(id),
    book_id INT REFERENCES books(id),
    rating INT CHECK(rating >= 1 AND rating <= 5),
    PRIMARY KEY (user_id, book_id)
);
