DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS task;

CREATE TABLE user (
  userID TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE task (
  taskID TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  createdDate TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT NOT NULL,
  userId TEXT NOT NULL
);
