# Plogger v0.0.1

### About the program
This program is used to collect logs through an API interface and showcase the collected data to 3 different types of users - admins, developers and clients.

### Usage example
A CI/CD pipeline in your app collects and sends logs to this program, which stores the successful/unsuccesful logs and allows users to see the results.

Also funtions as a vault for old logs to see what had happened in the past.

### Program components
This program has 3 main objects:
* Entry (the output of a single pipeline step)
* Log (contains entries from a single pipeline run)
* Pipeline (Info about the pipeline and the logs it contains)

This program also has a simple web UI - it features only a home page for all the different types of users.

### Used technologies

This project has three parts:
1. Frontend which used React and typescript
2. Backend which uses dotnet c#
3. PostgreSQL database

### OpenAPI Documentation

```
{
  "openapi": "3.0.1",
  "info": {
    "title": "Plogger.Server",
    "version": "1.0"
  },
  "paths": {
    "/api/Entries": {
      "get": {
        "tags": [
          "Entries"
        ],
        "responses": {
          "200": {
            "description": "Success"
          },
          "404": {
            "description": "Not Found"
          }
        }
      },
      "post": {
        "tags": [
          "Entries"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Entry"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/Entry"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/Entry"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "400": {
            "description": "Bad Request"
          },
          "422": {
            "description": "Unprocessable Content"
          }
        }
      }
    },
    "/api/Entries/{id}": {
      "get": {
        "tags": [
          "Entries"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          },
          "404": {
            "description": "Not Found"
          }
        }
      },
      "put": {
        "tags": [
          "Entries"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Entry"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/Entry"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/Entry"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "201": {
            "description": "Created"
          },
          "404": {
            "description": "Not Found"
          },
          "400": {
            "description": "Bad Request"
          },
          "422": {
            "description": "Unprocessable Content"
          }
        }
      },
      "delete": {
        "tags": [
          "Entries"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "404": {
            "description": "Not Found"
          }
        }
      }
    },
    "/api/Logs": {
      "get": {
        "tags": [
          "Logs"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "post": {
        "tags": [
          "Logs"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Log"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/Log"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/Log"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "400": {
            "description": "Bad Request"
          },
          "422": {
            "description": "Unprocessable Content"
          }
        }
      }
    },
    "/api/Logs/{id}": {
      "get": {
        "tags": [
          "Logs"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          },
          "404": {
            "description": "Not Found"
          }
        }
      },
      "put": {
        "tags": [
          "Logs"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Log"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/Log"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/Log"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "201": {
            "description": "Created"
          },
          "404": {
            "description": "Not Found"
          },
          "400": {
            "description": "Bad Request"
          },
          "422": {
            "description": "Unprocessable Content"
          }
        }
      },
      "delete": {
        "tags": [
          "Logs"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "404": {
            "description": "Not Found"
          }
        }
      }
    },
    "/api/Pipelines": {
      "get": {
        "tags": [
          "Pipelines"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "post": {
        "tags": [
          "Pipelines"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Pipeline"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/Pipeline"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/Pipeline"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "400": {
            "description": "Bad Request"
          },
          "422": {
            "description": "Unprocessable Content"
          }
        }
      }
    },
    "/api/Pipelines/{id}": {
      "get": {
        "tags": [
          "Pipelines"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          },
          "404": {
            "description": "Not Found"
          }
        }
      },
      "put": {
        "tags": [
          "Pipelines"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Pipeline"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/Pipeline"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/Pipeline"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "201": {
            "description": "Created"
          },
          "404": {
            "description": "Not Found"
          },
          "400": {
            "description": "Bad Request"
          },
          "422": {
            "description": "Unprocessable Content"
          }
        }
      },
      "delete": {
        "tags": [
          "Pipelines"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          },
          "404": {
            "description": "Not Found"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Entry": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "logId": {
            "type": "string",
            "format": "uuid"
          },
          "message": {
            "type": "string",
            "nullable": true
          },
          "status": {
            "type": "integer",
            "format": "int32"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "additionalProperties": false
      },
      "Log": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "pipelineId": {
            "type": "string",
            "format": "uuid"
          },
          "description": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "entries": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Entry"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "Pipeline": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Log"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```