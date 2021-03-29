DROP TABLE IF EXISTS task;

CREATE TABLE task (
  taskId TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  createdDate TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT NOT NULL,
  userId TEXT NOT NULL
);
