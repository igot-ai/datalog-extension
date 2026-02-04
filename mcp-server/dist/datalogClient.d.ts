import { Project, Table, Column, Asset } from './types.js';
export declare class DatalogClient {
    private client;
    constructor(apiKey: string, baseUrl?: string);
    listProjects(): Promise<Project[]>;
    listTables(projectId: string): Promise<Table[]>;
    listColumns(projectName: string, collectionName: string): Promise<Column[]>;
    listAssets(projectName: string, collectionName: string): Promise<Asset[]>;
    uploadFile(projectName: string, collectionName: string, filePath: string, transform?: boolean): Promise<any>;
    uploadPlainText(projectName: string, collectionName: string, text: string, transform?: boolean): Promise<any>;
}
