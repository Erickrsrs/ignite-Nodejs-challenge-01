import { randomUUID } from 'node:crypto';
import { Database } from './database/database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const { title, description } = req.body;
        const now = new Date();

        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        };

        database.insert('tasks', task);
        return res.writeHead(201).end();
      } catch (e) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Title and description not found.' }));
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      try {
        const { title, description } = req.body;
        const now = new Date();

        const task = database.update('tasks', id, {
          title,
          description,
          updated_at: now.toISOString(),
        });

        if (!task) {
          return res
            .writeHead(404)
            .end(
              JSON.stringify({ message: 'Task not found, try another id.' })
            );
        }

        return res.writeHead(200).end();
      } catch (e) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Title or description not found.' }));
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.delete('tasks', id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found, try another id.' }));
      }

      return res.writeHead(200).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const now = new Date();

      const task = database.selectById('tasks', id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found, try another id.' }));
      }

      database.update('tasks', id, {
        completed_at: task.completed_at ? null : now.toISOString(),
        updated_at: now.toISOString(),
      });

      return res.writeHead(200).end();
    },
  },
];
