import { Pool } from 'pg';
// import config from '../config/environment';

export class PsqlService {
  getSession = async (id: string) => {
    return id
  }

  async addSession(id: string, data: any) {
    return [id, data]
  }
}