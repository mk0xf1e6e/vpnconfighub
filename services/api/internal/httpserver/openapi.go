package httpserver

import (
	"net/http"
)

const openAPISpec = `{
  "openapi": "3.0.3",
  "info": {
    "title": "VPN Config Hub API",
    "version": "0.1.0",
    "description": "Backend API contract. Demo endpoints are deterministic preview data and are not authenticated account data."
  },
  "servers": [{"url": "https://vch-api.milad-karami.ir"}],
  "paths": {
    "/health": {
      "get": {
        "summary": "Health check",
        "responses": {"200": {"description": "API is healthy", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Health"}}}}}
      }
    },
    "/api/demo/dashboard": {
      "get": {
        "summary": "Demo dashboard data",
        "description": "Deterministic preview data. Not a real user account.",
        "responses": {"200": {"description": "Demo dashboard", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/DemoDashboard"}}}}}
      }
    },
    "/api/demo/usage": {
      "get": {
        "summary": "Demo usage data",
        "responses": {"200": {"description": "Demo usage", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/DemoUsage"}}}}}
      }
    },
    "/api/demo/catalog": {
      "get": {
        "summary": "Demo product catalog",
        "responses": {"200": {"description": "Demo catalog", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/DemoCatalog"}}}}}
      }
    }
  },
  "components": {
    "schemas": {
      "Health": {"type": "object", "required": ["status"], "properties": {"status": {"type": "string", "example": "ok"}}},
      "DailyUsage": {"type": "object", "required": ["date", "bytes"], "properties": {"date": {"type": "string", "format": "date"}, "bytes": {"type": "integer", "format": "int64"}}},
      "DemoUsage": {"type": "object", "required": ["demo", "totalBytes", "daily"], "properties": {"demo": {"type": "boolean", "example": true}, "totalBytes": {"type": "integer", "format": "int64"}, "daily": {"type": "array", "items": {"$ref": "#/components/schemas/DailyUsage"}}}},
      "DemoDashboard": {"type": "object", "required": ["demo", "subscription", "usage", "configuration", "nodes"], "properties": {"demo": {"type": "boolean"}, "subscription": {"type": "object"}, "usage": {"$ref": "#/components/schemas/DemoUsage"}, "configuration": {}, "nodes": {"type": "array"}}},
      "DemoCatalog": {"type": "object", "required": ["demo", "items"], "properties": {"demo": {"type": "boolean"}, "items": {"type": "array", "items": {"type": "object"}}}}
    }
  }
}`

func openAPIHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(openAPISpec))
}

func swaggerUIHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write([]byte(`<!doctype html><html><head><title>VPN Config Hub API Docs</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"></head><body><div id="swagger-ui"></div><script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script><script>window.ui=SwaggerUIBundle({url:'/openapi.json',dom_id:'#swagger-ui'});</script></body></html>`))
}
