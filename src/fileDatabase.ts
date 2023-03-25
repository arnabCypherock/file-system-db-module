import * as fs from 'fs/promises';

import { Logger } from './utils/logger';

interface Database {
  [key: string]: any;
}

const logger = new Logger();

export class FileDatabase {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async readData(): Promise<Database> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      logger.log(`Read data from file: ${this.filePath}`);
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.log(
          `File "${this.filePath}" does not exist, creating a new one`
        );
        return {};
      } else {
        // Other error occurred, throw it
        throw error;
      }
    }
  }

  private async writeData(data: Database): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await fs.writeFile(this.filePath, jsonData);
      logger.log(`Wrote data to file: ${this.filePath}`);
    } catch (error) {
      logger.log(`Error writing data to file: ${this.filePath}`);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const data = await this.readData();
      logger.log(`Got data from file: ${this.filePath}`);
      return data[key];
    } catch (error) {
      logger.log(`Error getting data from file: ${this.filePath}`);
      throw error;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const data = await this.readData();
      data[key] = value;
      await this.writeData(data);
      logger.log(`Set data from file: ${this.filePath}`);
    } catch (error) {
      logger.log(`Error setting data from file: ${this.filePath}`);
      throw error;
    }
  }

  async update(key: string, value: any): Promise<void> {
    const data = await this.readData();
    if (data.hasOwnProperty(key)) {
      data[key] = value;
      await this.writeData(data);
      logger.log(`Updated data from file: ${this.filePath}`);
    } else {
      logger.log(`Key "${key}" does not exist`);
      throw new Error(`Key "${key}" does not exist`);
    }
  }

  async delete(key: string): Promise<void> {
    const data = await this.readData();
    if (data.hasOwnProperty(key)) {
      delete data[key];
      await this.writeData(data);
      logger.log(`Deleted data from file: ${this.filePath}`);
    } else {
      logger.log(`Key "${key}" does not exist`);
      throw new Error(`Key "${key}" does not exist`);
    }
  }
}
