-- Events Table using postgresql DB System
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    strt_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    txt TEXT NOT NULL,
    color TEXT NOT NULL,
    bg TEXT NOT NULL
);

--Create indices for strt & end columns
CREATE INDEX idx_strt_date ON events (strt_date);
CREATE INDEX idx_end_date ON events (end_date);



-- Table Configuration for SQLITE DB System
--CREATE TABLE events (
--  id INTEGER,
--  strt_date DATETIME,
--  end_date DATETIME,
--  text TEXT NOT NULL,
--  color TEXT NOT NULL,
--  bg TEXT NOT NULL,
--  PRIMARY KEY("id" AUTOINCREMENT)
--);
--CREATE INDEX idx_start ON events (strt_date);
--CREATE INDEX idx_end ON events (end_date);


--Table configuration for MYSQL DB System (InnoDB)

--CREATE TABLE events ((
--   id int NOT NULL AUTO_INCREMENT,
--   strt_date DATETIME NOT NULL,
--   end_date DATETIME NOT NULL,
--   details text NOT NULL,
--   color TEXT NOT NULL,
--   bg TEXT NOT NULL,
--  PRIMARY KEY (id)
--   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--);