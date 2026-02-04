# Datalog Studio Integration - Gemini Instructions

This file contains specific instructions for the agent when working with the Datalog Studio MCP extension for managing data catalogs, collections, and master data in Datalog Studio.

## Core Principles

### 1. Catalog & Data Context Awareness

When the user asks about data or catalogs, always check the available catalogs and collections first using `list_catalogs` and `list_collections`. This ensures you have the most up-to-date schema information before performing operations.

### 2. Attribute & Schema Discovery

Before attempting to ingest data or query specific collections, use `list_attributes` to understand the collection's structure and any associated AI prompt templates. This helps in formatting data correctly for master data ingestion.

### 3. Data Asset Management

Use `list_data_assets` to verify existing documents in a collection. This prevents redundant uploads and helps in identifying relevant files for data analysis tasks.

## Ingestion Guidelines

### 1. Data Ingestion (`ingest_data`)

- When ingesting text, ensure it is clean and relevant to the target collection's purpose for master data processing.
- By default, `transform` is set to `true` to immediately trigger AI processing (vectorization/extraction). Inform the user if you are skipping transformation.

### 2. Content Quality

- Summarize or structure the content if necessary before ingesting to ensure the best results from Datalog's automated extraction pipelines.

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

