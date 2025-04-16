/**
 * Swagger/OpenAPI to TypeScript Generator
 * Converts Swagger/OpenAPI YAML or JSON definitions to TypeScript interfaces and services
 */

const fs = require("fs-extra");
const path = require("path");
const yaml = require("js-yaml");
const { camelCase, pascalCase } = require("change-case");

/**
 * Parse a Swagger file (YAML or JSON)
 * @param {string} filePath - Path to the Swagger file
 * @returns {Promise<Object>} - Parsed Swagger spec
 */
async function parseSwaggerFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const isYaml = filePath.endsWith(".yaml") || filePath.endsWith(".yml");

    if (isYaml) {
      return yaml.load(fileContent);
    } else {
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error(`Error parsing Swagger file: ${error.message}`);
    throw error;
  }
}

/**
 * Extract module name from API path
 * @param {string} apiPath - API path like /api/agents/
 * @returns {string} - Module name like 'agents'
 */
function getModuleNameFromPath(apiPath) {
  // Remove leading and trailing slashes
  const cleanPath = apiPath.replace(/^\/|\/$/g, "");

  // Split path into segments
  const segments = cleanPath.split("/");

  // For paths like /api/agents/, use 'agents' as the module name
  // Skip 'api' prefix if present
  let moduleSegmentIndex = 0;
  if (segments[0] === "api" && segments.length > 1) {
    moduleSegmentIndex = 1;
  }

  if (segments.length > moduleSegmentIndex) {
    // Return the appropriate segment as module name
    return segments[moduleSegmentIndex];
  }

  // Fallback
  return "common";
}

/**
 * Extract schema name from $ref
 * @param {string} ref - Reference string like #/components/schemas/AgentRequest
 * @returns {string} - Schema name like 'AgentRequest'
 */
function getSchemaNameFromRef(ref) {
  const parts = ref.split("/");
  return parts[parts.length - 1];
}

/**
 * Get a simplified schema name without Request/Response suffixes
 * @param {string} schemaName - Original schema name
 * @returns {string} - Simplified name
 */
function getSimplifiedSchemaName(schemaName) {
  // Remove Request/Response/Serializer/ForXxx suffixes and Paginated prefixes
  return schemaName
    .replace(/Request$|Response$|SerializerFor.*$|Serializer$/, "")
    .replace(/^Paginated/, "");
}

/**
 * Process enum values from OpenAPI schema
 * @param {Array} enumValues - List of enum values
 * @returns {string} - TypeScript union type of string literals
 */
function processEnumValues(enumValues) {
  if (!Array.isArray(enumValues) || enumValues.length === 0) {
    return "string";
  }

  return enumValues
    .map((val) => (typeof val === "string" ? `'${val}'` : val))
    .join(" | ");
}

/**
 * Identify modules from paths in the Swagger spec
 * @param {Object} swagger - Parsed Swagger spec
 * @returns {Object} - Modules with their paths and operations
 */
function identifyModules(swagger) {
  const modules = {};

  // Extract paths and group by module
  if (swagger.paths) {
    for (const pathUrl in swagger.paths) {
      const pathData = swagger.paths[pathUrl];
      const moduleName = pascalCase(getModuleNameFromPath(pathUrl));

      if (!modules[moduleName]) {
        modules[moduleName] = {
          schemas: {},
          paths: {},
          operations: {},
          enumTypes: {}, // Store enum types here
        };
      }

      // Store path data
      modules[moduleName].paths[pathUrl] = pathData;

      // Extract operations from this path
      for (const method in pathData) {
        if (["get", "post", "put", "delete", "patch"].includes(method)) {
          const operation = pathData[method];
          if (operation.operationId) {
            modules[moduleName].operations[operation.operationId] = {
              method,
              path: pathUrl,
              ...operation,
            };
          }
        }
      }
    }
  }

  // Collect enum types from schemas
  const enumTypes = {};
  if (swagger.components && swagger.components.schemas) {
    for (const schemaName in swagger.components.schemas) {
      const schema = swagger.components.schemas[schemaName];
      // If this is an enum schema
      if (schema.type === "string" && schema.enum) {
        enumTypes[schemaName] = schema.enum;
      }

      // Also check properties for enums
      if (schema.properties) {
        for (const propName in schema.properties) {
          const prop = schema.properties[propName];
          if (prop.type === "string" && prop.enum) {
            // Store enum values with a composed name
            enumTypes[`${schemaName}_${propName}`] = prop.enum;
          }
        }
      }
    }
  }

  // Add schemas to the modules
  if (swagger.components && swagger.components.schemas) {
    // Collect all schemas first
    const allSchemas = swagger.components.schemas;

    // For each identified module, find relevant schemas
    for (const moduleName in modules) {
      const moduleOperations = modules[moduleName].operations;
      const moduleSchemas = modules[moduleName].schemas;
      const moduleEnumTypes = modules[moduleName].enumTypes;

      // Add enum types to the module
      Object.assign(moduleEnumTypes, enumTypes);

      // Check request bodies and responses for schema references
      for (const operationId in moduleOperations) {
        const operation = moduleOperations[operationId];

        // Check requestBody
        if (operation.requestBody && operation.requestBody.content) {
          for (const contentType in operation.requestBody.content) {
            const schema = operation.requestBody.content[contentType].schema;
            if (schema && schema.$ref) {
              const schemaName = getSchemaNameFromRef(schema.$ref);
              if (allSchemas[schemaName]) {
                moduleSchemas[schemaName] = allSchemas[schemaName];

                // Also collect enum references from this schema
                collectEnumReferences(
                  allSchemas[schemaName],
                  moduleEnumTypes,
                  enumTypes
                );
              }
            }
          }
        }

        // Check responses
        if (operation.responses) {
          for (const statusCode in operation.responses) {
            const response = operation.responses[statusCode];
            if (response.content) {
              for (const contentType in response.content) {
                const schema = response.content[contentType].schema;
                if (schema && schema.$ref) {
                  const schemaName = getSchemaNameFromRef(schema.$ref);
                  if (allSchemas[schemaName]) {
                    moduleSchemas[schemaName] = allSchemas[schemaName];

                    // Also collect enum references from this schema
                    collectEnumReferences(
                      allSchemas[schemaName],
                      moduleEnumTypes,
                      enumTypes
                    );
                  }
                }
              }
            }
          }
        }
      }
    }

    // For schemas not assigned to any module yet, assign them to relevant modules
    // based on name similarity or create separate schema modules
    for (const schemaName in allSchemas) {
      let assigned = false;

      // Check if it's explicitly related to a module by name
      for (const moduleName in modules) {
        const moduleNameLower = moduleName.toLowerCase();
        const schemaNameLower = schemaName.toLowerCase();

        if (
          schemaNameLower.includes(moduleNameLower) ||
          moduleNameLower.includes(
            schemaNameLower.replace("request", "").replace("response", "")
          )
        ) {
          modules[moduleName].schemas[schemaName] = allSchemas[schemaName];

          // Also collect enum references from this schema
          collectEnumReferences(
            allSchemas[schemaName],
            modules[moduleName].enumTypes,
            enumTypes
          );

          assigned = true;
          break;
        }
      }

      // If not assigned, put in common module or create specific module
      if (!assigned) {
        // Check if we need to create a new module for this schema
        if (schemaName.endsWith("Request") || schemaName.endsWith("Response")) {
          // Extract potential module name
          const baseName = schemaName.replace(/Request$|Response$/, "");
          const potentialModuleName = pascalCase(baseName);

          if (!modules[potentialModuleName]) {
            modules[potentialModuleName] = {
              schemas: {},
              paths: {},
              operations: {},
              enumTypes: {}, // Initialize enum types
            };
          }
          modules[potentialModuleName].schemas[schemaName] =
            allSchemas[schemaName];

          // Also collect enum references from this schema
          collectEnumReferences(
            allSchemas[schemaName],
            modules[potentialModuleName].enumTypes,
            enumTypes
          );
        } else {
          // Add to common module
          if (!modules["Common"]) {
            modules["Common"] = {
              schemas: {},
              paths: {},
              operations: {},
              enumTypes: {}, // Initialize enum types
            };
          }
          modules["Common"].schemas[schemaName] = allSchemas[schemaName];

          // Also collect enum references from this schema
          collectEnumReferences(
            allSchemas[schemaName],
            modules["Common"].enumTypes,
            enumTypes
          );
        }
      }
    }
  }

  return modules;
}

/**
 * Collect enum references from a schema and add them to the module
 * @param {Object} schema - Schema to analyze
 * @param {Object} moduleEnumTypes - Module's enum types collection
 * @param {Object} allEnumTypes - All enum types
 */
function collectEnumReferences(schema, moduleEnumTypes, allEnumTypes) {
  if (!schema || !schema.properties) {
    return;
  }

  // Check each property for enum references or direct enums
  for (const propName in schema.properties) {
    const prop = schema.properties[propName];

    // Direct enum values
    if (prop.type === "string" && prop.enum) {
      moduleEnumTypes[`${propName}Enum`] = prop.enum;
    }

    // References to enum types
    if (prop.$ref) {
      const refName = getSchemaNameFromRef(prop.$ref);
      // If the reference is to a known enum type
      if (allEnumTypes[refName]) {
        moduleEnumTypes[refName] = allEnumTypes[refName];
      }
    }
  }
}

/**
 * Determine TypeScript type from Swagger property
 * @param {Object} property - Swagger property definition
 * @param {Object} moduleData - Module data including schemas and enum types
 * @returns {string} - TypeScript type
 */
function getTypeFromProperty(property, moduleData) {
  if (!property) return "any";

  if (property.$ref) {
    // Handle reference type
    const refName = getSchemaNameFromRef(property.$ref);

    // Check if this is a reference to an enum type
    if (moduleData.enumTypes && moduleData.enumTypes[refName]) {
      return processEnumValues(moduleData.enumTypes[refName]);
    }

    // Otherwise, use simplified name for schema reference
    return getSimplifiedSchemaName(refName);
  }

  switch (property.type) {
    case "string":
      if (property.format === "date-time" || property.format === "date") {
        return "Date";
      }
      if (property.enum) {
        // Create proper string union type for enums
        return processEnumValues(property.enum);
      }
      return "string";
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "array":
      if (property.items) {
        if (property.items.$ref) {
          const refName = getSchemaNameFromRef(property.items.$ref);

          // Check if this is a reference to an enum type
          if (moduleData.enumTypes && moduleData.enumTypes[refName]) {
            return `(${processEnumValues(moduleData.enumTypes[refName])})[]`;
          }

          return `${getSimplifiedSchemaName(refName)}[]`;
        } else {
          const itemsType = getTypeFromProperty(property.items, moduleData);
          return `${itemsType}[]`;
        }
      }
      return "any[]";
    case "object":
      if (property.properties) {
        let objType = "{\n";
        for (const propName in property.properties) {
          const prop = property.properties[propName];
          const type = getTypeFromProperty(prop, moduleData);
          const isRequired = property.required?.includes(propName) ?? false;
          const isReadOnly = prop.readOnly === true;
          objType += `    ${propName}${isRequired ? "" : "?"}: ${type}${
            isReadOnly ? " /* readonly */" : ""
          };\n`;
        }
        objType += "  }";
        return objType;
      } else if (property.additionalProperties) {
        // Handle dictionary/map types
        const valueType = property.additionalProperties.type
          ? getTypeFromProperty(property.additionalProperties, moduleData)
          : "any";
        return `Record<string, ${valueType}>`;
      }
      return "Record<string, any>";
    default:
      return "any";
  }
}

/**
 * Generate entity model file for a module - consolidates all schemas into a single file
 * @param {string} moduleName - Name of the module
 * @param {Object} moduleData - Module data including schemas and enum types
 * @returns {string} - Content for the consolidated model file
 */
function generateEntityModel(moduleName, moduleData) {
  let content = `// ${moduleName.toLowerCase()}/domains/models/${moduleName}.ts\n\n`;
  const moduleSchemas = moduleData.schemas;

  // Track generated interfaces to avoid duplicates
  const generatedInterfaces = new Set();

  // Generate interfaces for each schema
  for (const schemaName in moduleSchemas) {
    const schema = moduleSchemas[schemaName];
    const simplifiedName = getSimplifiedSchemaName(schemaName);

    // Skip if it's a paginated list schema
    if (schemaName.startsWith("Paginated")) {
      continue;
    }

    // Skip if we've already generated this interface
    if (generatedInterfaces.has(simplifiedName)) {
      continue;
    }

    generatedInterfaces.add(simplifiedName);

    // Generate the interface
    content += `export interface ${simplifiedName} {\n`;
    if (schema.properties) {
      for (const propName in schema.properties) {
        const prop = schema.properties[propName];
        const type = getTypeFromProperty(prop, moduleData);
        const isRequired = schema.required?.includes(propName) ?? false;
        const isReadOnly = prop.readOnly === true;

        // Add JSDoc for property description if available
        if (prop.description) {
          content += `  /**\n   * ${prop.description}\n   */\n`;
        }

        content += `  ${propName}${isRequired ? "" : "?"}: ${type}${
          isReadOnly ? " /* readonly */" : ""
        };\n`;
      }
    }
    content += "}\n\n";
  }

  // Find the primary schema for params interfaces
  let primarySchemaName = null;
  for (const schemaName in moduleSchemas) {
    // Skip paginated schemas when looking for primary
    if (schemaName.startsWith("Paginated")) {
      continue;
    }

    // Prioritize schema with the module name
    if (!schemaName.endsWith("Serializer") && !schemaName.includes("For")) {
      const simplifiedName = getSimplifiedSchemaName(schemaName);
      if (simplifiedName === moduleName) {
        primarySchemaName = schemaName;
        break;
      }
    }
  }

  // If we didn't find a match with module name, use the first non-serializer
  if (!primarySchemaName) {
    for (const schemaName in moduleSchemas) {
      if (
        !schemaName.endsWith("Serializer") &&
        !schemaName.includes("For") &&
        !schemaName.startsWith("Paginated")
      ) {
        primarySchemaName = schemaName;
        break;
      }
    }
  }

  // If we still didn't find a primary, use any schema
  if (!primarySchemaName && Object.keys(moduleSchemas).length > 0) {
    primarySchemaName = Object.keys(moduleSchemas)[0];
  }

  // Generate additional params interfaces for main schema
  if (primarySchemaName) {
    const primarySchema = moduleSchemas[primarySchemaName];
    const simplifiedName = getSimplifiedSchemaName(primarySchemaName);

    // Create params interface
    content += `export interface ${simplifiedName}Params {}\n\n`;

    // Create CreateParams interface
    content += `export interface ${simplifiedName}CreateParams {\n`;
    if (primarySchema.properties) {
      for (const propName in primarySchema.properties) {
        const prop = primarySchema.properties[propName];
        if (propName !== "id" && !prop.readOnly) {
          // Skip id and readonly properties for create params
          const type = getTypeFromProperty(prop, moduleData);
          const isRequired =
            primarySchema.required?.includes(propName) ?? false;

          // Add JSDoc for property description if available
          if (prop.description) {
            content += `  /**\n   * ${prop.description}\n   */\n`;
          }

          content += `  ${propName}${isRequired ? "" : "?"}: ${type};\n`;
        }
      }
    }
    content += "}\n\n";

    // Create UpdateParams interface
    content += `export interface ${simplifiedName}UpdateParams {\n`;
    content += "  id: string | number;\n";
    if (primarySchema.properties) {
      for (const propName in primarySchema.properties) {
        const prop = primarySchema.properties[propName];
        if (propName !== "id" && !prop.readOnly) {
          // Skip id and readonly properties for update
          const type = getTypeFromProperty(prop, moduleData);

          // Add JSDoc for property description if available
          if (prop.description) {
            content += `  /**\n   * ${prop.description}\n   */\n`;
          }

          content += `  ${propName}?: ${type};\n`; // All fields optional in update
        }
      }
    }
    content += "}\n";
  }

  return content;
}

/**
 * Generate service interface file for a module
 * @param {string} moduleName - Name of the module
 * @param {Object} moduleData - Module data including operations
 * @returns {string} - Content for the service interface file
 */
function generateServiceInterface(moduleName, moduleData) {
  let content = `// ${moduleName.toLowerCase()}/domains/I${moduleName}Service.ts\n`;
  content += `import {\n`;
  content += `  PaginationList,\n`;
  content += `  PaginationParams,\n`;
  content += `  ResponseObject,\n`;
  content += `} from 'papak/_modulesTypes';\n`;
  content += `import {\n`;

  // Collect types to import
  const types = new Set();
  const operations = moduleData.operations;
  const schemas = moduleData.schemas;

  // Add base type and params
  // Find the primary schema
  let primarySchemaName = null;
  for (const schemaName in schemas) {
    // Skip paginated schemas when looking for primary
    if (schemaName.startsWith("Paginated")) {
      continue;
    }

    // Prioritize schema with the module name
    if (!schemaName.endsWith("Serializer") && !schemaName.includes("For")) {
      const simplifiedName = getSimplifiedSchemaName(schemaName);
      if (simplifiedName === moduleName) {
        primarySchemaName = schemaName;
        break;
      }
    }
  }

  if (!primarySchemaName) {
    for (const schemaName in schemas) {
      if (
        !schemaName.endsWith("Serializer") &&
        !schemaName.includes("For") &&
        !schemaName.startsWith("Paginated")
      ) {
        primarySchemaName = schemaName;
        break;
      }
    }
  }

  if (primarySchemaName) {
    const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
    types.add(simplifiedName);
    types.add(`${simplifiedName}Params`);
    types.add(`${simplifiedName}CreateParams`);
    types.add(`${simplifiedName}UpdateParams`);
  }

  content += `  ${Array.from(types).join(",\n  ")}\n`;
  content += `} from './models/${moduleName}';\n\n`;

  // Interface declaration
  content += `export interface I${moduleName}Service {\n`;

  // Generate methods based on operations
  for (const operationId in operations) {
    const operation = operations[operationId];
    const method = operation.method;
    const path = operation.path;

    // Determine method name based on operationId or path
    let methodName = camelCase(
      operationId.replace(`${moduleName.toLowerCase()}_`, "")
    );

    // Determine return type and parameters
    let returnType = "void";
    let params = [];

    // Parameters from operation
    if (operation.parameters) {
      operation.parameters.forEach((param) => {
        if (param.in === "path") {
          // Path parameter
          const paramType =
            param.schema?.type === "integer"
              ? "number"
              : param.schema?.type || "string";
          params.push(`${param.name}: ${paramType}`);
        } else if (
          param.in === "query" &&
          param.name !== "page" &&
          param.name !== "page_size"
        ) {
          // Non-pagination query parameter (pagination is handled separately)
          if (param.name === "q" || param.name === "search") {
            // Common search parameter
            params.push(`search?: string`);
          } else {
            const paramType =
              param.schema?.type === "integer"
                ? "number"
                : param.schema?.type || "string";
            params.push(`${camelCase(param.name)}?: ${paramType}`);
          }
        }
      });
    }

    // Request body
    let requestBodyType = null;
    if (operation.requestBody && operation.requestBody.content) {
      for (const contentType in operation.requestBody.content) {
        const schema = operation.requestBody.content[contentType].schema;
        if (schema && schema.$ref) {
          const refName = getSchemaNameFromRef(schema.$ref);
          const simplifiedName = getSimplifiedSchemaName(refName);

          // Use appropriate params based on method
          if (method === "post") {
            requestBodyType = `${simplifiedName}CreateParams`;
          } else if (method === "put" || method === "patch") {
            requestBodyType = `${simplifiedName}UpdateParams`;
          } else {
            requestBodyType = simplifiedName;
          }

          break;
        }
      }
    }

    if (requestBodyType) {
      params.push(`body: ${requestBodyType}`);
    }

    // Response type
    if (operation.responses) {
      for (const statusCode in operation.responses) {
        const response = operation.responses[statusCode];
        if (response.content) {
          for (const contentType in response.content) {
            const schema = response.content[contentType].schema;
            if (schema) {
              if (schema.$ref) {
                const refName = getSchemaNameFromRef(schema.$ref);
                const simplifiedName = getSimplifiedSchemaName(refName);

                // Handle paginated responses - always use PaginationList with main schema type
                if (method === "get" && path.endsWith("/")) {
                  // List endpoint
                  if (refName.startsWith("Paginated")) {
                    // For paginated responses, use the primary schema type
                    if (primarySchemaName) {
                      const primarySimplifiedName =
                        getSimplifiedSchemaName(primarySchemaName);
                      returnType = `ResponseObject<PaginationList<${primarySimplifiedName}>>`;
                    } else {
                      returnType = `ResponseObject<PaginationList<${simplifiedName}>>`;
                    }
                  } else {
                    returnType = `ResponseObject<${simplifiedName}[]>`;
                  }
                } else {
                  // Detail endpoint
                  returnType = `ResponseObject<${simplifiedName}>`;
                }
              } else if (
                schema.type === "array" &&
                schema.items &&
                schema.items.$ref
              ) {
                const itemRefName = getSchemaNameFromRef(schema.items.$ref);
                const itemSimplifiedName = getSimplifiedSchemaName(itemRefName);
                returnType = `ResponseObject<${itemSimplifiedName}[]>`;
              }
              break;
            }
          }
        }
      }
    }

    // If it's a list method, add pagination params
    if (method === "get" && path.endsWith("/")) {
      // Get primary schema name for the module
      if (primarySchemaName) {
        const simplifiedName = getSimplifiedSchemaName(primarySchemaName);

        if (params.length > 0) {
          params[0] = `params: ${simplifiedName}Params & PaginationParams & {${params
            .map((p) => p.split(":")[0])
            .join(", ")}}`;
        } else {
          params.push(`params: ${simplifiedName}Params & PaginationParams`);
        }
      }
    }

    // If no better return type was found, use a generic type based on method
    if (returnType === "void") {
      // Get primary schema name for the module
      if (primarySchemaName) {
        const simplifiedName = getSimplifiedSchemaName(primarySchemaName);

        if (method === "get") {
          returnType = `ResponseObject<${simplifiedName}>`;
        } else {
          returnType = `ResponseObject<null>`;
        }
      } else {
        // Fallback
        returnType =
          method === "get" ? "ResponseObject<any>" : "ResponseObject<null>";
      }
    }

    content += `  ${methodName}(${params.join(
      ", "
    )}): Promise<${returnType}>;\n`;
  }

  // Add standard CRUD methods if they don't exist yet
  // Use the previously extracted primary schema name or get it if not available
  const mainSchemaNameForCrud = primarySchemaName || Object.keys(schemas)[0];
  let simplifiedName = moduleName;

  if (mainSchemaNameForCrud) {
    simplifiedName = getSimplifiedSchemaName(mainSchemaNameForCrud);
  }

  if (
    !operations[`${moduleName.toLowerCase()}_list`] &&
    !operations[`${moduleName.toLowerCase()}_all`]
  ) {
    content += `  getAll(params: ${simplifiedName}Params & PaginationParams): Promise<ResponseObject<PaginationList<${simplifiedName}>>>;\n`;
  }

  if (
    !operations[`${moduleName.toLowerCase()}_read`] &&
    !operations[`${moduleName.toLowerCase()}_retrieve`]
  ) {
    content += `  get(id: string | number): Promise<ResponseObject<${simplifiedName}>>;\n`;
  }

  if (!operations[`${moduleName.toLowerCase()}_create`]) {
    content += `  create(params: ${simplifiedName}CreateParams): Promise<ResponseObject<${simplifiedName}>>;\n`;
  }

  if (
    !operations[`${moduleName.toLowerCase()}_update`] &&
    !operations[`${moduleName.toLowerCase()}_partial_update`]
  ) {
    content += `  update(params: ${simplifiedName}UpdateParams): Promise<ResponseObject<${simplifiedName}>>;\n`;
  }

  if (
    !operations[`${moduleName.toLowerCase()}_destroy`] &&
    !operations[`${moduleName.toLowerCase()}_delete`]
  ) {
    content += `  remove(id: string | number): Promise<ResponseObject<null>>;\n`;
  }

  content += "}\n";

  return content;
}

/**
 * Generate service implementation file for a module
 * @param {string} moduleName - Name of the module
 * @param {Object} moduleData - Module data including operations and paths
 * @returns {string} - Content for the service implementation file
 */
function generateServiceImplementation(moduleName, moduleData) {
  let content = `// ${moduleName.toLowerCase()}/${moduleName}.service.ts\n`;

  // Import statements - simplified to remove unused types
  content += `import { serviceHandler } from 'papak/helpers/serviceHandler';\n`;
  content += `import request from 'papak/utils/request';\n`;
  content += `import endpoints from '@/constants/endpoints';\n`;
  content += `import type { I${moduleName}Service } from './domains/I${moduleName}Service';\n\n`;

  // Service function
  content += `export function ${moduleName}Service(): I${moduleName}Service {\n`;
  content += `  return {\n`;

  // Implement methods based on operations
  for (const operationId in moduleData.operations) {
    const operation = moduleData.operations[operationId];
    const method = operation.method;
    const path = operation.path;

    // Determine method name based on operationId or path
    let methodName = camelCase(
      operationId.replace(`${moduleName.toLowerCase()}_`, "")
    );

    // Method implementation
    content += `    ${methodName}: `;

    // For list endpoints - simplified pattern
    if (method === "get" && path.endsWith("/")) {
      content += `(params) =>\n`;
      content += `      serviceHandler(() => request().get(endpoints.${moduleName.toUpperCase()}.${operationId.toUpperCase()}(), {\n`;
      content += `        params,\n`;
      content += `      })),\n\n`;
    }
    // For detail endpoints
    else if (method === "get" && !path.endsWith("/")) {
      content += `(id) =>\n`;
      content += `      serviceHandler(() => request().get(endpoints.${moduleName.toUpperCase()}.${operationId.toUpperCase()}(id))),\n\n`;
    }
    // For create endpoints
    else if (method === "post") {
      content += `(body) =>\n`;
      content += `      serviceHandler(() =>\n`;
      content += `        request().post(endpoints.${moduleName.toUpperCase()}.${operationId.toUpperCase()}(), body),\n`;
      content += `      ),\n\n`;
    }
    // For update endpoints
    else if (method === "put" || method === "patch") {
      content += `({ id, ...params }) =>\n`;
      content += `      serviceHandler(() =>\n`;
      content += `        request().${method}(endpoints.${moduleName.toUpperCase()}.${operationId.toUpperCase()}(id), params),\n`;
      content += `      ),\n\n`;
    }
    // For delete endpoints
    else if (method === "delete") {
      content += `(id) =>\n`;
      content += `      serviceHandler(() =>\n`;
      content += `        request().delete(endpoints.${moduleName.toUpperCase()}.${operationId.toUpperCase()}(id)),\n`;
      content += `      ),\n\n`;
    }
    // Default case
    else {
      content += `(params) =>\n`;
      content += `      serviceHandler(() => request().${method}(endpoints.${moduleName.toUpperCase()}.${operationId.toUpperCase()}(), params)),\n\n`;
    }
  }

  // Add standard CRUD methods if they don't exist yet - simplified pattern
  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_list`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_all`]
  ) {
    content += `    getAll: (params) =>\n`;
    content += `      serviceHandler(() => request().get(endpoints.${moduleName.toUpperCase()}.GET_${moduleName.toUpperCase()}(), {\n`;
    content += `        params,\n`;
    content += `      })),\n\n`;
  }

  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_read`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_retrieve`]
  ) {
    content += `    get: (id) =>\n`;
    content += `      serviceHandler(() => request().get(endpoints.${moduleName.toUpperCase()}.GET_${moduleName.toUpperCase()}_ID(id))),\n\n`;
  }

  if (!moduleData.operations[`${moduleName.toLowerCase()}_create`]) {
    content += `    create: (params) =>\n`;
    content += `      serviceHandler(() =>\n`;
    content += `        request().post(endpoints.${moduleName.toUpperCase()}.POST_${moduleName.toUpperCase()}(), params),\n`;
    content += `      ),\n\n`;
  }

  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_update`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_partial_update`]
  ) {
    content += `    update: ({ id, ...params }) =>\n`;
    content += `      serviceHandler(() =>\n`;
    content += `        request().put(endpoints.${moduleName.toUpperCase()}.PUT_${moduleName.toUpperCase()}_ID(id), params),\n`;
    content += `      ),\n\n`;
  }

  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_destroy`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_delete`]
  ) {
    content += `    remove: (id) =>\n`;
    content += `      serviceHandler(() =>\n`;
    content += `        request().delete(endpoints.${moduleName.toUpperCase()}.DELETE_${moduleName.toUpperCase()}_ID(id)),\n`;
    content += `      ),\n\n`;
  }

  // Remove trailing commas
  content = content.replace(/,\n\n$/g, "\n");

  content += `  };\n`;
  content += `}\n`;

  return content;
}

/**
 * Generate presentation file for a module
 * @param {string} moduleName - Name of the module
 * @param {Object} moduleData - Module data including operations
 * @returns {string} - Content for the presentation file
 */
function generatePresentation(moduleName, moduleData) {
  // First, determine which imports are actually needed
  const needsRouter = Object.values(moduleData.operations).some(
    (op) =>
      op.method === "post" || op.method === "put" || op.method === "delete"
  );

  let content = `// ${moduleName.toLowerCase()}/${moduleName}.presentation.ts\n`;

  // Only import what we need
  content += `import { useMutation, useQuery } from '@tanstack/react-query';\n`;
  if (needsRouter) {
    content += `import { useRouter, useSearchParams } from 'next/navigation';\n`;
  }
  content += `import { PaginationParams } from 'papak/_modulesTypes';\n`;
  content += `import { ${moduleName}Service } from './${moduleName}.service';\n`;

  // Get primary schema name to determine which params types we need
  let primarySchemaName = null;
  const schemas = moduleData.schemas;

  // Find primary schema (non-paginated, non-serializer)
  for (const schemaName in schemas) {
    if (
      !schemaName.startsWith("Paginated") &&
      !schemaName.endsWith("Serializer") &&
      !schemaName.includes("For")
    ) {
      const simplifiedName = getSimplifiedSchemaName(schemaName);
      if (simplifiedName === moduleName) {
        primarySchemaName = schemaName;
        break;
      }
    }
  }

  // If we didn't find one matching the module name, use any suitable schema
  if (!primarySchemaName) {
    for (const schemaName in schemas) {
      if (
        !schemaName.startsWith("Paginated") &&
        !schemaName.endsWith("Serializer") &&
        !schemaName.includes("For")
      ) {
        primarySchemaName = schemaName;
        break;
      }
    }
  }

  // Determine which params types are needed based on the operations
  const needsParamsType = Object.values(moduleData.operations).some(
    (op) => op.method === "get" && op.path.endsWith("/")
  );

  const needsCreateParamsType = Object.values(moduleData.operations).some(
    (op) => op.method === "post"
  );

  const needsUpdateParamsType = Object.values(moduleData.operations).some(
    (op) => op.method === "put" || op.method === "patch"
  );

  // Only import the types we need
  if (
    primarySchemaName &&
    (needsParamsType || needsCreateParamsType || needsUpdateParamsType)
  ) {
    const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
    const types = [];

    if (needsParamsType) {
      types.push(`${simplifiedName}Params`);
    }

    if (needsCreateParamsType) {
      types.push(`${simplifiedName}CreateParams`);
    }

    if (needsUpdateParamsType) {
      types.push(`${simplifiedName}UpdateParams`);
    }

    if (types.length > 0) {
      content += `import {\n`;
      content += `  ${types.join(",\n  ")}\n`;
      content += `} from './domains/models/${moduleName}';\n`;
    }
  }

  content += `\nconst Service = ${moduleName}Service();\n\n`;

  // Presentation function
  content += `export function ${moduleName}Presentation(openNotification) {\n`;
  content += `  return {\n`;

  // Generate hooks based on operations
  for (const operationId in moduleData.operations) {
    const operation = moduleData.operations[operationId];
    const method = operation.method;

    // Determine hook name based on operationId
    let methodName = camelCase(
      operationId.replace(`${moduleName.toLowerCase()}_`, "")
    );
    let hookName = `use${pascalCase(methodName)}`;

    // For GET methods
    if (method === "get") {
      content += `    ${hookName}: (`;

      // Determine parameters and add type annotation
      if (operation.parameters) {
        const pathParams = operation.parameters.filter((p) => p.in === "path");
        if (pathParams.length > 0) {
          const param = pathParams[0];
          const paramType =
            param.schema?.type === "integer" ? "number" : "string";
          content += `${param.name}: ${paramType}`;
        } else if (operation.path.endsWith("/") && primarySchemaName) {
          const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
          content += `params: ${simplifiedName}Params & PaginationParams`;
        } else {
          content += `params`;
        }
      } else if (operation.path.endsWith("/") && primarySchemaName) {
        const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
        content += `params: ${simplifiedName}Params & PaginationParams`;
      } else {
        content += `params`;
      }

      content += `) =>\n`;
      content += `      useQuery({\n`;
      content += `        queryKey: ['${moduleName}-${methodName}', `;

      if (
        operation.parameters &&
        operation.parameters.some((p) => p.in === "path")
      ) {
        const pathParam = operation.parameters.find((p) => p.in === "path");
        content += `${pathParam.name}`;
      } else {
        content += `...Object.values(params || {})`;
      }

      content += `],\n`;
      content += `        queryFn: () => Service.${methodName}(`;

      if (
        operation.parameters &&
        operation.parameters.some((p) => p.in === "path")
      ) {
        const pathParam = operation.parameters.find((p) => p.in === "path");
        content += `${pathParam.name}`;
      } else {
        content += `params`;
      }

      content += `),\n`;

      // Add enabled check for detail queries
      if (
        operation.parameters &&
        operation.parameters.some((p) => p.in === "path")
      ) {
        const pathParam = operation.parameters.find((p) => p.in === "path");
        content += `        enabled: !!${pathParam.name},\n`;
      }

      content += `      }),\n\n`;
    }
    // For mutation methods (POST, PUT, DELETE)
    else {
      // Determine type for the mutation parameter
      let paramType = "";
      if (method === "post" && primarySchemaName) {
        const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
        paramType = `${simplifiedName}CreateParams`;
      } else if (
        (method === "put" || method === "patch") &&
        primarySchemaName
      ) {
        const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
        paramType = `${simplifiedName}UpdateParams`;
      }

      content += `    ${hookName}: () => {\n`;

      // Add router if needed for this mutation
      if (method === "post" || method === "put" || method === "delete") {
        content += `      const router = useRouter();\n`;
      }

      content += `      return useMutation({\n`;
      content += `        mutationFn: (`;

      // Add parameter type annotation
      if (method === "delete") {
        content += `{ id }: { id: string | number }`;
      } else if (paramType) {
        content += `params: ${paramType}`;
      } else {
        content += `params`;
      }

      content += `) => {\n`;
      content += `          return Service.${methodName}(`;

      if (method === "delete") {
        content += `id`;
      } else {
        content += `params`;
      }

      content += `);\n`;
      content += `        },\n`;
      content += `      });\n`;
      content += `    },\n\n`;
    }
  }

  // Add standard CRUD hooks if they don't exist
  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_list`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_all`]
  ) {
    let paramType = `any`;
    if (primarySchemaName) {
      const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
      paramType = `${simplifiedName}Params & PaginationParams`;
    }

    content += `    useGetAll: (params: ${paramType}) =>\n`;
    content += `      useQuery({\n`;
    content += `        queryKey: ['${moduleName}-results', ...Object.values(params || {})],\n`;
    content += `        queryFn: () => Service.getAll(params),\n`;
    content += `      }),\n\n`;
  }

  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_read`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_retrieve`]
  ) {
    content += `    useGet: (id: string | number) =>\n`;
    content += `      useQuery({\n`;
    content += `        queryKey: ['${moduleName}-result', id],\n`;
    content += `        queryFn: () => Service.get(id),\n`;
    content += `        enabled: !!id,\n`;
    content += `      }),\n\n`;
  }

  if (!moduleData.operations[`${moduleName.toLowerCase()}_create`]) {
    let paramType = `any`;
    if (primarySchemaName) {
      const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
      paramType = `${simplifiedName}CreateParams`;
    }

    content += `    useCreate: () => {\n`;
    content += `      return useMutation({\n`;
    content += `        mutationFn: (params: ${paramType}) => {\n`;
    content += `          return Service.create(params);\n`;
    content += `        },\n`;
    content += `      });\n`;
    content += `    },\n\n`;
  }

  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_update`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_partial_update`]
  ) {
    let paramType = `any`;
    if (primarySchemaName) {
      const simplifiedName = getSimplifiedSchemaName(primarySchemaName);
      paramType = `${simplifiedName}UpdateParams`;
    }

    content += `    useUpdate: () => {\n`;
    content += `      return useMutation({\n`;
    content += `        mutationFn: (params: ${paramType}) => {\n`;
    content += `          return Service.update(params);\n`;
    content += `        },\n`;
    content += `      });\n`;
    content += `    },\n\n`;
  }

  if (
    !moduleData.operations[`${moduleName.toLowerCase()}_destroy`] &&
    !moduleData.operations[`${moduleName.toLowerCase()}_delete`]
  ) {
    content += `    useRemove: () => {\n`;
    content += `      return useMutation({\n`;
    content += `        mutationFn: ({ id }: { id: string | number }) => {\n`;
    content += `          return Service.remove(id);\n`;
    content += `        },\n`;
    content += `      });\n`;
    content += `    },\n`;
  }

  // Remove trailing comma
  content = content.replace(/,\n$/g, "\n");

  content += `  };\n`;
  content += `}\n`;

  return content;
}

/**
 * Generate endpoints file for constants
 * @param {Object} modules - All modules
 * @returns {string} - Content for the endpoints file
 */
function generateEndpoints(modules) {
  let content = `// constants/endpoints.js\n\n`;

  content += `const endpoints = {\n`;

  for (const moduleName in modules) {
    const moduleOperations = modules[moduleName].operations;
    const modulePaths = modules[moduleName].paths;

    content += `  ${moduleName.toUpperCase()}: {\n`;

    // Add operation endpoints
    for (const operationId in moduleOperations) {
      const operation = moduleOperations[operationId];
      const method = operation.method;
      const path = operation.path;

      const constName = operationId.toUpperCase();

      // Check if path has parameters
      if (path.includes("{")) {
        // Path has parameters
        const pathParams = Array.from(path.matchAll(/{([^}]+)}/g)).map(
          (match) => match[1]
        );
        content += `    ${constName}: (${pathParams.join(
          ", "
        )}) => \`${path.replace(/{([^}]+)}/g, "${$1}")}\`,\n`;
      } else {
        // No parameters
        content += `    ${constName}: () => '${path}',\n`;
      }
    }

    // Add standard CRUD endpoints if not present
    const hasListOperation = Object.values(moduleOperations).some(
      (op) => op.method === "get" && op.path.endsWith("/")
    );

    const hasDetailOperation = Object.values(moduleOperations).some(
      (op) => op.method === "get" && !op.path.endsWith("/")
    );

    const hasCreateOperation = Object.values(moduleOperations).some(
      (op) => op.method === "post"
    );

    const hasUpdateOperation = Object.values(moduleOperations).some(
      (op) => op.method === "put" || op.method === "patch"
    );

    const hasDeleteOperation = Object.values(moduleOperations).some(
      (op) => op.method === "delete"
    );

    // Get base path for this module
    let basePath = "";
    if (Object.keys(modulePaths).length > 0) {
      // Use the first path as base path
      basePath = Object.keys(modulePaths)[0].split("{")[0];
      if (!basePath.endsWith("/")) {
        basePath += "/";
      }
    } else {
      basePath = `/api/${moduleName.toLowerCase()}/`;
    }

    if (!hasListOperation) {
      content += `    GET_${moduleName.toUpperCase()}: () => '${basePath}',\n`;
    }

    if (!hasDetailOperation) {
      content += `    GET_${moduleName.toUpperCase()}_ID: (id) => \`${basePath}\${id}/\`,\n`;
    }

    if (!hasCreateOperation) {
      content += `    POST_${moduleName.toUpperCase()}: () => '${basePath}',\n`;
    }

    if (!hasUpdateOperation) {
      content += `    PUT_${moduleName.toUpperCase()}_ID: (id) => \`${basePath}\${id}/\`,\n`;
      content += `    PATCH_${moduleName.toUpperCase()}_ID: (id) => \`${basePath}\${id}/\`,\n`;
    }

    if (!hasDeleteOperation) {
      content += `    DELETE_${moduleName.toUpperCase()}_ID: (id) => \`${basePath}\${id}/\`,\n`;
    }

    content += `  },\n`;
  }

  content += `  MOCK: {\n`;
  content += `    POST_LOGIN: () => '/mock/login',\n`;
  content += `  },\n`;

  content += `};\n\n`;
  content += `export default endpoints;\n`;

  return content;
}

/**
 * Create directories and write files
 * @param {Object} files - Files to create
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function createFiles(files, outputDir) {
  try {
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(outputDir, filePath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content, "utf-8");
      console.log(`Generated: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error creating files: ${error.message}`);
    throw error;
  }
}

/**
 * Process Swagger file and generate TypeScript files
 * @param {string} swaggerFilePath - Path to the Swagger file
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function generateFromSwagger(swaggerFilePath, outputDir) {
  try {
    console.log(`Parsing Swagger file: ${swaggerFilePath}`);
    // Parse Swagger file
    const swagger = await parseSwaggerFile(swaggerFilePath);

    console.log("Identifying modules from Swagger spec...");
    // Identify modules
    const modules = identifyModules(swagger);

    console.log(
      `Found ${Object.keys(modules).length} modules: ${Object.keys(
        modules
      ).join(", ")}`
    );

    // Collect all files to create
    const files = {};

    // Process each module
    for (const moduleName in modules) {
      const moduleData = modules[moduleName];
      console.log(`Generating files for module: ${moduleName}`);

      // Log collected enum types if any
      if (
        moduleData.enumTypes &&
        Object.keys(moduleData.enumTypes).length > 0
      ) {
        console.log(
          `  Found ${
            Object.keys(moduleData.enumTypes).length
          } enum types for ${moduleName}`
        );
      }

      // Generate entity model (single file for all schemas)
      files[`${moduleName.toLowerCase()}/domains/models/${moduleName}.ts`] =
        generateEntityModel(moduleName, moduleData);

      // Generate service interface
      files[`${moduleName.toLowerCase()}/domains/I${moduleName}Service.ts`] =
        generateServiceInterface(moduleName, moduleData);

      // Generate service implementation
      files[`${moduleName.toLowerCase()}/${moduleName}.service.ts`] =
        generateServiceImplementation(moduleName, moduleData);

      // Generate presentation layer
      files[`${moduleName.toLowerCase()}/${moduleName}.presentation.ts`] =
        generatePresentation(moduleName, moduleData);
    }

    // Generate endpoints file
    files["constants/endpoints.js"] = generateEndpoints(modules);

    // Create all files
    await createFiles(files, outputDir);

    console.log("Generation complete!");
  } catch (error) {
    console.error(`Error generating files: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const [, , swaggerFilePath, outputDir = "./src/modules"] = process.argv;

if (!swaggerFilePath) {
  console.error("Please provide a Swagger file path.");
  console.error(
    "Usage: node generateModels.js <swagger-file-path> [output-directory]"
  );
  process.exit(1);
}

// Run the generator
generateFromSwagger(swaggerFilePath, outputDir);
