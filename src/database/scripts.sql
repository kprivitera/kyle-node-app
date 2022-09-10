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
	CONSTRAINT users_pk PRIMARY KEY (id)
);
