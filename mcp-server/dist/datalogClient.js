import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
export class DataStudioClient {
    constructor(apiKey, baseUrl = 'https://studio.igot.ai/v1/catalog') {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `ApiKey ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'x-request-source': 'web',
            },
        });
    }
    async listCatalogs() {
        const response = await this.client.get('/projects', {
            params: { limit: 100 },
        });
        return response.data;
    }
    async listCollections(catalogId) {
        const response = await this.client.get(`/projects/${catalogId}/tables`, {
            params: { limit: 200 },
        });
        return response.data;
    }
    async listAttributes(catalogName, collectionName) {
        const response = await this.client.get(`/columns/${catalogName}/${collectionName}`);
        return response.data;
    }
    async listDataAssets(catalogName, collectionName) {
        const response = await this.client.get(`/assets/${catalogName}/${collectionName}`);
        return response.data;
    }
    async uploadFile(catalogName, collectionName, filePath, transform = true) {
        const form = new FormData();
        form.append('upload_files', fs.createReadStream(filePath));
        const response = await this.client.post(`/upload/${catalogName}/${collectionName}`, form, {
            params: { transform },
            headers: { ...form.getHeaders() },
        });
        return response.data;
    }
    async ingestData(catalogName, collectionName, text, transform = true) {
        const form = new FormData();
        form.append('plain_text', text);
        const response = await this.client.post(`/upload/${catalogName}/${collectionName}`, form, {
            params: { transform },
            headers: { ...form.getHeaders() },
        });
        return response.data;
    }
}
