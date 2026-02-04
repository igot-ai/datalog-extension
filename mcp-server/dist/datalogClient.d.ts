import { Project, Table, Column, Asset } from './types.js';
export declare class DataStudioClient {
    private client;
    constructor(apiKey: string, baseUrl?: string);
    listCatalogs(): Promise<Project[]>;
    listCollections(catalogId: string): Promise<Table[]>;
    listAttributes(catalogName: string, collectionName: string): Promise<Column[]>;
    listDataAssets(catalogName: string, collectionName: string): Promise<Asset[]>;
    uploadFile(catalogName: string, collectionName: string, filePath: string, transform?: boolean): Promise<any>;
    ingestData(catalogName: string, collectionName: string, text: string, transform?: boolean): Promise<any>;
}
