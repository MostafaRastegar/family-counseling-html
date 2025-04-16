#!/usr/bin/env node

/**
 * Setup script for the Swagger to TypeScript Generator
 * Installs dependencies and sets up the project structure
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Ensure we're in the right directory
const projectRoot = process.cwd();

// Create package.json if it doesn't exist
if (!fs.existsSync(path.join(projectRoot, "package.json"))) {
  console.log("Initializing package.json...");
  execSync("npm init -y", { stdio: "inherit" });

  // Update package.json with our dependencies and scripts
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8")
  );

  packageJson.name = "swagger-to-typescript-generator";
  packageJson.description =
    "Generates TypeScript interfaces and services from Swagger/OpenAPI YAML or JSON specs";
  packageJson.main = "generateModels.js";
  packageJson.scripts = {
    start: "node generateModels.js",
    generate: "node generate.js",
  };

  fs.writeFileSync(
    path.join(projectRoot, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

// Install dependencies
console.log("Installing dependencies...");
execSync("npm install fs-extra js-yaml change-case", { stdio: "inherit" });

// Create src directory if it doesn't exist
const srcDir = path.join(projectRoot, "src");
if (!fs.existsSync(srcDir)) {
  console.log("Creating src directory...");
  fs.mkdirSync(srcDir);
}

// Copy the generator scripts to root directory
const generatorScript = path.join(__dirname, "generateModels.js");
if (fs.existsSync(generatorScript)) {
  console.log("Copying generator script to project root...");
  fs.copyFileSync(generatorScript, path.join(projectRoot, "generateModels.js"));
}

const helperScript = path.join(__dirname, "generate.js");
if (fs.existsSync(helperScript)) {
  console.log("Copying helper script to project root...");
  fs.copyFileSync(helperScript, path.join(projectRoot, "generate.js"));
  // Make the helper script executable
  fs.chmodSync(path.join(projectRoot, "generate.js"), 0o755);
}

console.log("Setup complete! Now you can:");
console.log('1. Run "node generate.js" for automatic file detection');
console.log(
  '2. Run "node generateModels.js <swagger-file-path> [output-directory]" for direct usage'
);
