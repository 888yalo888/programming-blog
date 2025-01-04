-- Active: 1727714445205@@127.0.0.1@5432@blog

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email varchar(100) NOT NULL UNIQUE,
    hash_password varchar(200) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    verification_code varchar(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    photo VARCHAR(200),
    modified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE tokens(
    id SERIAL PRIMARY Key,
    user_id BIGINT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users (id)
);


CREATE TABLE articles(
    id SERIAL PRIMARY Key,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    comments_count BIGINT NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    updated_at TIMESTAMP,
    -- view_count BIGINT NOT NULL DEFAULT 0,
    likes_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
)

CREATE TABLE likes(
    id SERIAL PRIMARY Key,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
)

CREATE TABLE comments_info(
    id SERIAL PRIMARY Key,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    comment TEXT,
    updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    comment_reply_id BIGINT,
    -- FOREIGN KEY (comment_reply_id) REFERENCES comment_info (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
);

ALTER TABLE comments_info ADD CONSTRAINT fk_comment_reply_id FOREIGN KEY (comment_reply_id) REFERENCES comments_info (id)
