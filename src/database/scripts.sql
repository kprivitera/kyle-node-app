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

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE book_genres (
    book_id INTEGER REFERENCES books(id),
    genre_id INTEGER REFERENCES genres(id),
    PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE book_series (
    book_id INTEGER REFERENCES books(id),
    series_id INTEGER REFERENCES series(id),
	series_number INTEGER,
    PRIMARY KEY (book_id, series_id)
);

CREATE TABLE book_reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    review TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id, book_id) REFERENCES book_ratings(user_id, book_id)
    UNIQUE(user_id, book_id)
);

CREATE TABLE review_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    review_id INTEGER REFERENCES book_reviews(id),
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book_clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    leader_id INTEGER REFERENCES users(id),
    theme VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE club_books (
    id SERIAL PRIMARY KEY,
    book_club_id INTEGER REFERENCES book_clubs(id),
    book_id INTEGER REFERENCES books(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE club_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_club_id INTEGER REFERENCES book_clubs(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unique (user_id, book_club_id) -- this enforces the uniqueness of a member
);

CREATE TABLE club_schedules (
    id SERIAL PRIMARY KEY,
    book_club_id INTEGER REFERENCES book_clubs(id),
    book_id INTEGER REFERENCES books(id),
    start_date DATE,
    end_date DATE,
    recurring BOOLEAN,
    recurrence_pattern VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION make_rating(userId INTEGER, bookId INTEGER, rating INTEGER)
RETURNS VOID AS
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM book_ratings WHERE user_id = userId AND book_id = bookId) THEN
        INSERT INTO book_ratings (user_id, book_id, rating) VALUES (userId, bookId, rating);
    END IF;
END;
$$ LANGUAGE plpgsql;
