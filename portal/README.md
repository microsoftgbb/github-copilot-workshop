# Portal Setup

## Quick Start

Run the single setup command from the **repository root**:

```bash
node setup-portal.js && cd portal && npm install && npm test
```

That command:
1. Creates the `portal/` directory tree with all source files  
2. Installs Node.js dependencies  
3. Runs the full test suite (unit + integration)

## What `setup-portal.js` Creates

```
portal/
├── package.json
├── jest.config.js
├── .gitignore
├── .env.example
├── src/
│   ├── server.js               Entry point
│   ├── app.js                  Express app factory
│   ├── config/config.js        PORT + MODULES_DIR config
│   ├── errors/errors.js        Custom error classes
│   ├── services/moduleService.js  Business logic
│   ├── utils/markdownParser.js    Markdown → sanitized HTML
│   ├── routes/
│   │   ├── moduleRoutes.js     GET /api/modules, GET /api/modules/:id
│   │   └── healthRoutes.js     GET /api/health
│   └── middleware/
│       ├── errorHandler.js     Domain error → HTTP mapping
│       ├── requestLogger.js    Correlation ID + structured logging
│       └── inputValidator.js   Language + moduleId validation
├── public/
│   ├── index.html              Home page (module grid)
│   ├── module.html             Module detail page
│   ├── css/
│   │   ├── main.css            Design tokens, layout, cards
│   │   └── module.css          Two-column module layout
│   └── js/
│       ├── api.js              fetch wrappers (ES module)
│       ├── home.js             Home page controller
│       └── module.js           Module detail controller
└── test/
    ├── unit/
    │   ├── services/moduleService.test.js
    │   ├── routes/moduleRoutes.test.js
    │   ├── routes/healthRoutes.test.js
    │   ├── middleware/errorHandler.test.js
    │   └── utils/markdownParser.test.js
    └── integration/
        └── api.test.js
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp portal/.env.example portal/.env
```

| Variable     | Default                              | Description                            |
|-------------|---------------------------------------|----------------------------------------|
| `PORT`       | `3000`                               | HTTP port the server listens on        |
| `MODULES_DIR`| `<repo-root>/modules`                | Absolute path to the modules directory |

## Running the Portal

```bash
cd portal
npm start          # production
npm run dev        # development (nodemon auto-reload)
npm test           # run all tests
npm run test:coverage  # test with coverage report
```

Open http://localhost:3000 in your browser.

## API Reference

| Method | Path                        | Description                              |
|--------|-----------------------------|------------------------------------------|
| `GET`  | `/api/health`               | Liveness check                           |
| `GET`  | `/api/modules`              | List all modules (opt. `?language=java\|javascript`) |
| `GET`  | `/api/modules/:moduleId`    | Full module detail + README HTML + code files |

### Language Filter

```
GET /api/modules?language=java
GET /api/modules?language=javascript
GET /api/modules/module-01-core-experience?language=java
```

### Response Shapes

**`GET /api/modules`**
```json
{
  "modules": [
    {
      "id": "module-01-core-experience",
      "order": 1,
      "title": "Module 1: Copilot in VS Code - Core Experience",
      "duration": "45 minutes (15 min demo + 30 min hands-on)",
      "format": "Demo + Hands-on",
      "description": "...",
      "languages": ["java", "javascript"],
      "hasJava": true,
      "hasJavaScript": true
    }
  ]
}
```

**`GET /api/modules/:moduleId`**
```json
{
  "module": {
    "id": "module-01-core-experience",
    "order": 1,
    "title": "...",
    "readmeHtml": "<h1>...</h1>",
    "codeFiles": [
      {
        "filename": "OrderService.java",
        "language": "java",
        "relativePath": "exercises/OrderService.java",
        "content": "..."
      }
    ]
  }
}
```

## Security Design

- **Path traversal prevention**: `getModule` verifies the resolved path stays within `MODULES_DIR`
- **Input validation**: all query params validated before reaching the service layer  
- **HTML sanitization**: markdown is rendered then sanitized with `sanitize-html` (XSS-safe allowlist)
- **No stack traces in responses**: the error handler maps domain errors to clean JSON; unknown errors return a generic 500
- **Correlation IDs**: every request tagged with UUID v4 for log correlation (`X-Correlation-ID` header)
