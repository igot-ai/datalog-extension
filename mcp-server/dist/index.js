#!/usr/bin/env node
/**
 * MCP server for Datalog Studio integration
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DatalogClient } from './datalogClient.js';
class DatalogServer {
    constructor() {
        const apiKey = process.env.DATALOG_API_KEY || '';
        this.datalogClient = new DatalogClient(apiKey);
        this.server = new Server({
            name: 'datalog-studio-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'list_catalogs',
                        description: 'List all available data catalogs in Datalog Studio',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'list_collections',
                        description: 'List all collections (master data tables) within a specific catalog',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                catalog_id: {
                                    type: 'string',
                                    description: 'The UUID of the catalog (project)',
                                },
                            },
                            required: ['catalog_id'],
                        },
                    },
                    {
                        name: 'list_attributes',
                        description: 'List attributes and schema for a specific collection',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                catalog_name: {
                                    type: 'string',
                                    description: 'Name of the catalog',
                                },
                                collection_name: {
                                    type: 'string',
                                    description: 'Name of the collection',
                                },
                            },
                            required: ['catalog_name', 'collection_name'],
                        },
                    },
                    {
                        name: 'list_data_assets',
                        description: 'List all data assets (uploaded files) in a specific collection',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                catalog_name: {
                                    type: 'string',
                                    description: 'Name of the catalog',
                                },
                                collection_name: {
                                    type: 'string',
                                    description: 'Name of the collection',
                                },
                            },
                            required: ['catalog_name', 'collection_name'],
                        },
                    },
                    {
                        name: 'ingest_data',
                        description: 'Ingest plain text data into a catalog collection for master data processing',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                catalog_name: {
                                    type: 'string',
                                    description: 'Name of the catalog',
                                },
                                collection_name: {
                                    type: 'string',
                                    description: 'Name of the collection',
                                },
                                text: {
                                    type: 'string',
                                    description: 'Content to ingest',
                                },
                                transform: {
                                    type: 'boolean',
                                    description: 'Whether to trigger AI transformation immediately (default: true)',
                                    default: true,
                                },
                            },
                            required: ['catalog_name', 'collection_name', 'text'],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            // Validate API key exists before execution
            if (!process.env.DATALOG_API_KEY) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Error: DATALOG_API_KEY is not set. Please configure your API key in settings or as an environment variable.',
                        },
                    ],
                    isError: true,
                };
            }
            try {
                switch (name) {
                    case 'list_catalogs': {
                        const catalogs = await this.datalogClient.listCatalogs();
                        return {
                            content: [{ type: 'text', text: JSON.stringify(catalogs, null, 2) }],
                        };
                    }
                    case 'list_collections': {
                        const collections = await this.datalogClient.listCollections(args?.catalog_id);
                        return {
                            content: [{ type: 'text', text: JSON.stringify(collections, null, 2) }],
                        };
                    }
                    case 'list_attributes': {
                        const attributes = await this.datalogClient.listAttributes(args?.catalog_name, args?.collection_name);
                        return {
                            content: [{ type: 'text', text: JSON.stringify(attributes, null, 2) }],
                        };
                    }
                    case 'list_data_assets': {
                        const assets = await this.datalogClient.listDataAssets(args?.catalog_name, args?.collection_name);
                        return {
                            content: [{ type: 'text', text: JSON.stringify(assets, null, 2) }],
                        };
                    }
                    case 'ingest_data': {
                        const result = await this.datalogClient.ingestData(args?.catalog_name, args?.collection_name, args?.text, args?.transform);
                        return {
                            content: [{ type: 'text', text: `Ingestion successful: ${JSON.stringify(result)}` }],
                        };
                    }
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error.message}${error.response ? `\nAPI Response: ${JSON.stringify(error.response.data)}` : ''}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[MCP Error]', error);
        };
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Datalog Studio MCP server running on stdio');
    }
}
const server = new DatalogServer();
server.run().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
