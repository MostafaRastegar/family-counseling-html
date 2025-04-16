#!/usr/bin/env node

/**
 * Easy-to-use script for generating TypeScript models from OpenAPI/Swagger
 *
 * Usage:
 *   node generate.js [swagger-file] [output-dir]
 *
 * Examples:
 *   node generate.js                       # Uses default swagger.yaml -> ./src/modules
 *   node generate.js ./my-api.yaml         # Uses specified swagger file -> ./src/modules
 *   node generate.js swagger.yaml modules  # Uses specified swagger file and output dir
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Find Swagger file if not specified
function findSwaggerFile() {
  // Common file names for Swagger/OpenAPI definitions
  const possibleFiles = [
    "./openapi.yaml",
    "./openapi.yml",
    "./swagger.yaml",
    "./swagger.yml",
    "./api.yaml",
    "./api.yml",
    "./openapi.json",
    "./swagger.json",
    "./api.json",
  ];

  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      return file;
    }
  }

  return null;
}

// Get arguments
let swaggerFile = process.argv[2] || findSwaggerFile();
let outputDir = process.argv[3] || "./src/modules";

// Handle case where no Swagger file is found
if (!swaggerFile) {
  console.error(
    "Error: No OpenAPI/Swagger file specified and no default file found!"
  );
  console.log("Please provide a path to your OpenAPI YAML or JSON file.");
  console.log("Usage: node generate.js [swagger-file] [output-dir]");
  process.exit(1);
}

// Validate swagger file exists
if (!fs.existsSync(swaggerFile)) {
  console.error(`Error: OpenAPI file '${swaggerFile}' not found!`);
  console.log("Please provide a valid path to your OpenAPI YAML or JSON file.");
  console.log("Usage: node generate.js [swagger-file] [output-dir]");
  process.exit(1);
}

// Detect file type
const fileExtension = path.extname(swaggerFile).toLowerCase();
const fileType = fileExtension === ".json" ? "JSON" : "YAML";

console.log(
  `Generating TypeScript models from ${swaggerFile} (${fileType}) to ${outputDir}`
);
console.log(
  "This will create submodules based on API paths and use component schemas"
);

// Run the generator
spawnSync("node", ["generateModels.js", swaggerFile, outputDir], {
  stdio: "inherit",
  shell: true,
});

console.log(
  "\nGeneration complete! Check your output directory for the generated files."
);
