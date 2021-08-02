var db = require('../db');

module.exports = async function() {
  let client = await db.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id                SERIAL PRIMARY KEY,
        username          TEXT UNIQUE NOT NULL,
        hashed_password   BYTEA NOT NULL,
        salt              BYTEA NOT NULL,
        name              TEXT
    );

    CREATE TABLE IF NOT EXISTS docs (
        id								SERIAL PRIMARY KEY,
        user_id						INTEGER NOT NULL,
        url								VARCHAR(200) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clippings (
        id								SERIAL PRIMARY KEY,
        user_id						INTEGER NOT NULL,
        doc_id						INTEGER NOT NULL,
        ocr_text					TEXT,
        translated_text		TEXT,
        image_url					VARCHAR(200),
        tts_url						VARCHAR(200),
        position_x				INTEGER NOT NULL,
        position_y				INTEGER NOT NULL,
        width							INTEGER NOT NULL,
        height						INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY NOT DEFERRABLE INITIALLY IMMEDIATE,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  `);
};
