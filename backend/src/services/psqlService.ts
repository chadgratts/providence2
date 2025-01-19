import { Pool } from 'pg';

export class PsqlService {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });
  }
  
  getSession = async (id: string) => {
    try {
      const result = await this.pool.query('SELECT * FROM sessions WHERE session_id = $1', [id]);
      return result.rows;
    } catch (error) {
      console.error(`Error fetching session ${id} from PSQL`, error);
      throw error;
    }
  }

  addSession = async (project_id: string, session_id: string, session_start: string): Promise<any> => {
    try {
      const result = await this.pool.query(
        'INSERT INTO sessions (project_id, session_id, events_file_name, session_start) VALUES ($1, $2, $3, $4) RETURNING *',
          [project_id, session_id, `${session_id}-events.txt`, session_start]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Error adding session ${session_id} to PSQL`, error);
      throw error;
    }
  }
}

// CREATE TABLE sessions (
//   id PK SERIAL,
//   project_id FK INTEGER NOT NULL,
//   session_id VARCHAR(255),
//   events_file_name VARCHAR (255) NOT NULL,
//   session_summary VARCHAR (5000),                           
//   session_start TIMESTAMP NOT NULL,
//   session_end TIMESTAMP
// );