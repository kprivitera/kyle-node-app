CREATE TABLE public.words (
	id serial NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT newtable_pk PRIMARY KEY (id)
);