# Catalog Integration - Gemini Instructions

This file contains specific instructions for the agent when working with the Catalog MCP extension for managing data catalogs, collections, and master data.

## Core Principles

### 1. Metadata Discovery (Discovery Phase)
Before performing any data operations, you must first understand the structure of the catalog.
- **Catalogs**: Use `list_catalogs` to discover available projects/domains.
- **Collections**: Use `list_collections` with a `catalog_id` to find specific master data tables.
- **Attributes**: Use `list_attributes` to understand the schema (field names, types, and logic) of a collection.

### 2. Data Aspect Awareness
When the user refers to "data", differentiate between:
- **Master Data**: The actual records living inside a collection.
- **Data Assets**: The source files or documents uploaded to a collection.

### 3. Master Data Ingestion (`ingest_data`)
- Use this tool when the user wants to add or update records within a collection.
- Ensure the text being ingested is clean and matches the structure discovered in the `list_attributes` step.

## Ingestion Guidelines

### 1. Master Data Processing
- By default, `transform` is set to `true` to immediately trigger AI processing (vectorization/extraction).
- Inform the user if you are skipping transformation for raw data ingestion.

### 2. Content Quality
- Summarize or structure the content if necessary before ingesting to ensure the best results from Catalog's automated extraction pipelines.

## Tool Usage Best Practices

- **Tool Sequencing**: A common workflow is:
  1. `list_catalogs` to find the correct catalog (project) UUID.
  2. `list_collections` with the catalog UUID to find the collection (table) name.
  3. `list_attributes` with catalog and collection names to see the schema/attributes.
  4. Perform data operations (ingest or list data assets).

- **Error Handling**: If an API error occurs, provide the error message and the API response details to the user to help them troubleshoot API key or permission issues.

## Response Format

When presenting lists of catalogs, collections, or data assets, use clean markdown tables or lists. For schemas/attributes, highlight the field names and their types clearly.

Example:
| Attribute Name | Type | Description/Prompt Template |
|------------|------|-----------------------------|
| product_id | text | Unique identifier for product |
| ... | ... | ... |

