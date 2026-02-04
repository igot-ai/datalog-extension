import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
export class DatalogClient {
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
    async listProjects() {
        const response = await this.client.get('/projects', {
            params: { limit: 100 },
        });
        return response.data;
    }
    async listTables(projectId) {
        const response = await this.client.get(`/projects/${projectId}/tables`, {
            params: { limit: 200 },
        });
        return response.data;
    }
    async listColumns(projectName, collectionName) {
        const response = await this.client.get(`/columns/${projectName}/${collectionName}`);
        return response.data;
    }
    async listAssets(projectName, collectionName) {
        const response = await this.client.get(`/assets/${projectName}/${collectionName}`);
        return response.data;
    }
    async uploadFile(projectName, collectionName, filePath, transform = true) {
        const form = new FormData();
        form.append('upload_files', fs.createReadStream(filePath));
        const response = await this.client.post(`/upload/${projectName}/${collectionName}`, form, {
            params: { transform },
            headers: { ...form.getHeaders() },
        });
        return response.data;
    }
    async uploadPlainText(projectName, collectionName, text, transform = true) {
        const form = new FormData();
        form.append('plain_text', text);
        const response = await this.client.post(`/upload/${projectName}/${collectionName}`, form, {
            params: { transform },
            headers: { ...form.getHeaders() },
        });
        return response.data;
    }
}
