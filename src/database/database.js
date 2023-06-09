import fs from 'node:fs/promises';

const databasePath = new URL('../../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]
            .toLowerCase()
            .split(' ')
            .join('')
            .includes(value.toLowerCase().replace(/%20/g, ''));
        });
      });
    }
    return data;
  }

  selectById(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    if (rowIndex > -1) return this.#database[table][rowIndex];
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      for (const key in data) {
        if (data[key] !== undefined) {
          this.#database[table][rowIndex][key] = data[key];
          return this.#database[table][rowIndex];
        }
      }
      this.#persist();
    }
  }

  delete(table, id) {
    const rowindex = this.#database[table].findIndex((row) => row.id === id);

    if (rowindex > -1) {
      const task = this.#database[table].splice(rowindex, 1);
      this.#persist();
      return task;
    }
  }
}
