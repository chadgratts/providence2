import { Pool } from 'pg';
import config from '../config/environment';

export class PsqlService {
  getSession = async (id: string) => {
    return `i went to a database and got your new salary: ${id}`
  }

  async addSession(id: string, data: any) {
    return [id, data]
  }
}r