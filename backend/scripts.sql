-- Database schema for programming blog

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    photo VARCHAR(200),
    modified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    google_id VARCHAR
);

CREATE TABLE tokens(
    id SERIAL PRIMARY KEY,
    access_token TEXT NOT NULL,
    profile_id TEXT UNIQUE,
    refresh_token TEXT
);

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles(
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, role_id)
);

CREATE TABLE session(
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON session (expire);

CREATE TABLE articles(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    comments_count BIGINT NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    updated_at TIMESTAMP,
    likes_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE comments_info(
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    comment TEXT,
    updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    comment_reply_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (comment_reply_id) REFERENCES comments_info(id)
);
