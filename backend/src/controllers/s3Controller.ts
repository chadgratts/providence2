import { Request, Response } from 'express';
import { S3Service } from '../services/s3Service';

export class S3Controller {
  private s3Service: S3Service;
  
  constructor() {
    this.s3Service = new S3Service();
  }

  getFile = async (req: Request, res: Response) => { // add Promise<void> to the function signature
    const id = req.params.id;
    try {
      const data = await this.s3Service.getFile(id);
      res.send(data);
    } catch (error) {
      res.status(500).send('Failed to fetch data');
    }
  };

  addFile = async (req: Request, res: Response) => { // add Promise<void> to the function signature
    const { fileName, fileContent } = req.body;
    try {
      const location = await this.s3Service.addFile(fileName, fileContent);
      res.send(location);
    } catch (error) {
      res.status(500).send('Failed to save data');
    }
  };
}