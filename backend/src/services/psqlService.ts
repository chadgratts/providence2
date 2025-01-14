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

  addSession = async (id: number, data: string) => {
    try {
      const result = await this.pool.query(
        'INSERT INTO sessions (session_id, recording_data) VALUES ($1, $2) RETURNING *',
          [id, data]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Error adding session ${id} to PSQL`, error);
      throw error;
    }
  }
}