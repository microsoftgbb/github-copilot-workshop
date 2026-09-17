#!/usr/bin/env bash
# =============================================================================
# setup-portal.sh  –  Bootstrap the GitHub Copilot Workshop Portal
# Run from the repository root:  bash setup-portal.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTAL="$SCRIPT_DIR/portal"

echo ""
echo "🚀  Creating GitHub Copilot Workshop Portal at: $PORTAL"
echo ""

# ── Directories ───────────────────────────────────────────────────────────────
mkdir -p \
  "$PORTAL/src/errors" \
  "$PORTAL/src/middleware" \
  "$PORTAL/src/services" \
  "$PORTAL/src/routes" \
  "$PORTAL/src/views/partials" \
  "$PORTAL/public/css" \
  "$PORTAL/public/js" \
  "$PORTAL/test"

echo "  [dirs]  directory tree created"

# ── package.json ──────────────────────────────────────────────────────────────
cat > "$PORTAL/package.json" <<'__HEREDOC__'
{
  "name": "copilot-workshop-portal",
  "version": "1.0.0",
  "description": "Web portal for the GitHub Copilot Enterprise Workshop",
  "engines": { "node": ">=18" },
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "jest --runInBand",
    "test:coverage": "jest --coverage --runInBand"
  },
  "dependencies": {
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  }
}
__HEREDOC__
echo "  [file]  package.json"

# ── .gitignore ────────────────────────────────────────────────────────────────
cat > "$PORTAL/.gitignore" <<'__HEREDOC__'
node_modules/
coverage/
.env
__HEREDOC__
echo "  [file]  .gitignore"

# ── src/errors/errors.js ──────────────────────────────────────────────────────
cat > "$PORTAL/src/errors/errors.js" <<'__HEREDOC__'
'use strict';

/**
 * Error thrown when a requested resource is not found.
 */
class NotFoundError extends Error {
  /**
   * @param {string} message - Human-readable error message
   */
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Error thrown when request validation fails.
 */
class ValidationError extends Error {
  /**
   * @param {string} message - Human-readable error message
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = { NotFoundError, ValidationError };
__HEREDOC__
echo "  [file]  src/errors/errors.js"

# ── src/middleware/errorHandler.js ────────────────────────────────────────────
cat > "$PORTAL/src/middleware/errorHandler.js" <<'__HEREDOC__'
'use strict';

/**
 * Express error-handling middleware.
 * Maps err.statusCode to HTTP response status.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';

  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    statusCode,
    message,
  });
};

module.exports = { errorHandler };
__HEREDOC__
echo "  [file]  src/middleware/errorHandler.js"

# ── src/services/moduleService.js ─────────────────────────────────────────────
cat > "$PORTAL/src/services/moduleService.js" <<'__HEREDOC__'
'use strict';

/** @typedef {{ id: string, number: number, title: string, duration: number, format: string, description: string, objectives: string[], languages: string[], path: string, optional: boolean }} WorkshopModule */

/** @type {WorkshopModule[]} */
const MODULES = [
  {
    id: 'module-00-welcome',
    number: 0,
    title: 'Welcome & Foundations',
    duration: 15,
    format: 'Presentation',
    description: 'Introduction to the workshop, GitHub Copilot overview, and setting expectations for the day. Learn about the AI-powered coding assistant and how it integrates into your development workflow.',
    objectives: [
      'Understand what GitHub Copilot is and how it works',
      'Learn about the workshop structure and agenda',
      'Set up your development environment',
      'Understand the difference between Copilot Individual, Business, and Enterprise',
    ],
    languages: [],
    path: '../modules/module-00-welcome',
    optional: false,
  },
  {
    id: 'module-01-core-experience',
    number: 1,
    title: 'Copilot in VS Code Core Experience',
    duration: 45,
    format: 'Demo + Hands-on',
    description: 'Deep dive into GitHub Copilot\'s core features within VS Code. Learn inline completions, ghost text, and how to effectively work with AI suggestions to boost your productivity.',
    objectives: [
      'Use inline code completions effectively',
      'Understand ghost text and how to accept/reject suggestions',
      'Learn keyboard shortcuts for Copilot interactions',
      'Practice writing code with Copilot assistance',
      'Understand how context affects suggestion quality',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-01-core-experience',
    optional: true,
  },
  {
    id: 'module-02-chat-deep-dive',
    number: 2,
    title: 'Copilot Chat Deep Dive',
    duration: 60,
    format: 'Demo + Hands-on',
    description: 'Explore GitHub Copilot Chat\'s powerful conversational AI features. Learn to use chat participants, slash commands, and how to frame questions for the best results.',
    objectives: [
      'Use Copilot Chat in VS Code for code explanation',
      'Learn slash commands: /explain, /fix, /tests, /doc',
      'Work with chat participants like @workspace and @terminal',
      'Use inline chat for targeted code improvements',
      'Generate unit tests with Copilot Chat',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-02-chat-deep-dive',
    optional: true,
  },
  {
    id: 'module-03-copilot-on-github',
    number: 3,
    title: 'Copilot on GitHub.com GHEC',
    duration: 45,
    format: 'Demo + Hands-on',
    description: 'Discover GitHub Copilot features available directly on GitHub.com in the Enterprise Cloud. Learn to use Copilot in pull requests, issues, and the GitHub web interface.',
    objectives: [
      'Use Copilot to summarize pull requests',
      'Generate PR descriptions with Copilot',
      'Use Copilot in GitHub issues for analysis',
      'Explore Copilot in code search on GitHub.com',
      'Understand enterprise-specific Copilot features',
    ],
    languages: [],
    path: '../modules/module-03-copilot-on-github',
    optional: true,
  },
  {
    id: 'module-04-customization',
    number: 4,
    title: 'Customization Instructions & Prompt Files',
    duration: 60,
    format: 'Demo + Hands-on',
    description: 'Learn how to customize GitHub Copilot for your organization\'s specific needs. Create custom instructions, prompt files, and repository-specific configurations.',
    objectives: [
      'Create repository-level Copilot instructions',
      'Write effective prompt files for common tasks',
      'Configure organization-wide Copilot policies',
      'Use custom instructions to enforce coding standards',
      'Build reusable prompt templates for your team',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-04-customization',
    optional: true,
  },
  {
    id: 'module-05-agents',
    number: 5,
    title: 'Agent Mode & Custom Agents',
    duration: 75,
    format: 'Demo + Hands-on',
    description: 'Explore GitHub Copilot\'s powerful agent capabilities. Learn to use agent mode for complex multi-step tasks and create custom agents tailored to your workflows.',
    objectives: [
      'Understand what agent mode is and when to use it',
      'Use built-in agents for common development tasks',
      'Create custom agents with MCP (Model Context Protocol)',
      'Build multi-step automated workflows with agents',
      'Integrate agents into your CI/CD pipeline',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-05-agents',
    optional: true,
  },
  {
    id: 'module-06-wrapup',
    number: 6,
    title: 'Wrap-up Q&A & Next Steps',
    duration: 30,
    format: 'Discussion',
    description: 'Conclude the workshop with a Q&A session and discussion about next steps for adopting GitHub Copilot in your organization. Share learnings and plan your AI-assisted development journey.',
    objectives: [
      'Review key learnings from the workshop',
      'Address open questions and challenges',
      'Discuss adoption strategies for your organization',
      'Identify next steps and resources for continued learning',
      'Connect with the GitHub Copilot community',
    ],
    languages: [],
    path: '../modules/module-06-wrapup',
    optional: false,
  },
];

/**
 * Get all workshop modules.
 * @returns {WorkshopModule[]}
 */
const getAllModules = () => MODULES;

/**
 * Get a single module by its ID.
 * @param {string} id - The module ID (e.g. 'module-01-core-experience')
 * @returns {WorkshopModule | undefined}
 */
const getModuleById = (id) => MODULES.find((m) => m.id === id);

/**
 * Filter modules that support a specific programming language.
 * Returns modules with no language restriction too.
 * @param {string} language - 'java' or 'javascript'
 * @returns {WorkshopModule[]}
 */
const filterByLanguage = (language) =>
  MODULES.filter((m) => m.languages.length === 0 || m.languages.includes(language));

module.exports = { getAllModules, getModuleById, filterByLanguage };
__HEREDOC__
echo "  [file]  src/services/moduleService.js"

# ── src/routes/index.js ───────────────────────────────────────────────────────
cat > "$PORTAL/src/routes/index.js" <<'__HEREDOC__'
'use strict';

const { Router } = require('express');
const { getAllModules } = require('../services/moduleService');

const router = Router();

/**
 * GET / - Home page showing all modules and language selection.
 */
router.get('/', (req, res) => {
  const modules = getAllModules();
  const language = req.session?.language ?? 'javascript';
  res.render('index', { title: 'GitHub Copilot Enterprise Workshop', modules, language });
});

module.exports = { router };
__HEREDOC__
echo "  [file]  src/routes/index.js"

# ── src/routes/modules.js ─────────────────────────────────────────────────────
cat > "$PORTAL/src/routes/modules.js" <<'__HEREDOC__'
'use strict';

const { Router } = require('express');
const { getAllModules, getModuleById } = require('../services/moduleService');
const { NotFoundError } = require('../errors/errors');

const router = Router();

/**
 * GET /modules - List all modules.
 */
router.get('/', (req, res) => {
  const modules = getAllModules();
  res.render('modules', { title: 'Workshop Modules', modules });
});

/**
 * GET /modules/:id - Show detail for a single module.
 */
router.get('/:id', (req, res, next) => {
  const module = getModuleById(req.params.id);
  if (!module) {
    return next(new NotFoundError(`Module '${req.params.id}' not found`));
  }
  res.render('module-detail', { title: module.title, module });
});

module.exports = { router };
__HEREDOC__
echo "  [file]  src/routes/modules.js"

# ── src/routes/agenda.js ──────────────────────────────────────────────────────
cat > "$PORTAL/src/routes/agenda.js" <<'__HEREDOC__'
'use strict';

const { Router } = require('express');
const { getAllModules, getModuleById } = require('../services/moduleService');

const router = Router();

/**
 * GET /agenda - Show personalized agenda from query params.
 * Query params: selectedModules (string or array), language
 */
router.get('/', (req, res) => {
  const { language = 'javascript' } = req.query;
  const allModules = getAllModules();

  // Normalize selectedModules to an array
  let selectedIds = req.query.selectedModules
    ? Array.isArray(req.query.selectedModules)
      ? req.query.selectedModules
      : [req.query.selectedModules]
    : [];

  // Always include non-optional modules
  const alwaysIncluded = allModules.filter((m) => !m.optional).map((m) => m.id);
  const allSelected = [...new Set([...alwaysIncluded, ...selectedIds])];

  const selectedModules = allSelected
    .map((id) => getModuleById(id))
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);

  const totalDuration = selectedModules.reduce((sum, m) => sum + m.duration, 0);

  res.render('agenda', {
    title: 'My Agenda',
    selectedModules,
    language,
    totalDuration,
    allModules,
  });
});

/**
 * POST /agenda - Save selections and redirect to GET /agenda with query params.
 */
router.post('/', (req, res) => {
  const { language = 'javascript', selectedModules } = req.body;

  // Persist language preference in session
  if (req.session) {
    req.session.language = language;
  }

  const moduleIds = selectedModules
    ? Array.isArray(selectedModules)
      ? selectedModules
      : [selectedModules]
    : [];

  const params = new URLSearchParams();
  params.set('language', language);
  for (const id of moduleIds) {
    params.append('selectedModules', id);
  }

  res.redirect(`/agenda?${params.toString()}`);
});

module.exports = { router };
__HEREDOC__
echo "  [file]  src/routes/agenda.js"

# ── src/app.js ────────────────────────────────────────────────────────────────
cat > "$PORTAL/src/app.js" <<'__HEREDOC__'
'use strict';

const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const helmet = require('helmet');

const { router: indexRouter } = require('./routes/index');
const { router: modulesRouter } = require('./routes/modules');
const { router: agendaRouter } = require('./routes/agenda');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'copilot-workshop-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Static assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRouter);
app.use('/modules', modulesRouter);
app.use('/agenda', agendaRouter);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  const { NotFoundError } = require('./errors/errors');
  next(new NotFoundError(`Page not found: ${req.path}`));
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = { app };
__HEREDOC__
echo "  [file]  src/app.js"

# ── src/server.js ─────────────────────────────────────────────────────────────
cat > "$PORTAL/src/server.js" <<'__HEREDOC__'
'use strict';

const { app } = require('./app');

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`GitHub Copilot Workshop Portal running at http://localhost:${PORT}`);
});
__HEREDOC__
echo "  [file]  src/server.js"

# ── src/views/partials/header.ejs ─────────────────────────────────────────────
cat > "$PORTAL/src/views/partials/header.ejs" <<'__HEREDOC__'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%= title %> | Copilot Workshop</title>
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-brand">
        <span class="nav-logo">⚡</span>
        <span>Copilot Workshop</span>
      </a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/modules">Modules</a></li>
        <li><a href="/agenda">My Agenda</a></li>
      </ul>
    </div>
  </nav>
  <main class="main">
__HEREDOC__
echo "  [file]  src/views/partials/header.ejs"

# ── src/views/partials/footer.ejs ─────────────────────────────────────────────
cat > "$PORTAL/src/views/partials/footer.ejs" <<'__HEREDOC__'
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>GitHub Copilot Enterprise Workshop &mdash; Built with ❤️ and Copilot</p>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>
__HEREDOC__
echo "  [file]  src/views/partials/footer.ejs"

# ── src/views/index.ejs ───────────────────────────────────────────────────────
cat > "$PORTAL/src/views/index.ejs" <<'__HEREDOC__'
<%- include('partials/header') %>

<div class="hero">
  <h1 class="hero-title">GitHub Copilot Enterprise Workshop</h1>
  <p class="hero-subtitle">
    A hands-on workshop covering GitHub Copilot features, customization, and advanced agent capabilities.
    Choose your modules and language to build your personalized agenda.
  </p>
</div>

<section class="section">
  <div class="section-header">
    <h2>Build Your Agenda</h2>
    <p>Select your preferred programming language and the modules you want to include.</p>
  </div>

  <form action="/agenda" method="POST" id="agenda-form">
    <div class="language-selector">
      <h3>Programming Language</h3>
      <div class="language-buttons">
        <label class="lang-btn <%= language === 'javascript' ? 'active' : '' %>">
          <input type="radio" name="language" value="javascript" <%= language === 'javascript' ? 'checked' : '' %> />
          <span class="lang-icon">JS</span>
          <span>JavaScript</span>
        </label>
        <label class="lang-btn <%= language === 'java' ? 'active' : '' %>">
          <input type="radio" name="language" value="java" <%= language === 'java' ? 'checked' : '' %> />
          <span class="lang-icon">☕</span>
          <span>Java</span>
        </label>
      </div>
    </div>

    <div class="modules-grid">
      <% modules.forEach(module => { %>
      <div class="module-card <%= module.optional ? '' : 'module-required' %>">
        <div class="module-card-header">
          <div class="module-badges">
            <span class="badge badge-number">Module <%= module.number.toString().padStart(2, '0') %></span>
            <% if (!module.optional) { %>
            <span class="badge badge-required">Always Included</span>
            <% } %>
          </div>
          <div class="module-meta">
            <span class="badge badge-duration">⏱ <%= module.duration %> min</span>
            <span class="badge badge-format"><%= module.format %></span>
          </div>
        </div>

        <h3 class="module-title">
          <a href="/modules/<%= module.id %>"><%= module.title %></a>
        </h3>
        <p class="module-description"><%= module.description.substring(0, 150) %>...</p>

        <div class="module-footer">
          <% if (module.optional) { %>
          <label class="checkbox-label">
            <input type="checkbox" name="selectedModules" value="<%= module.id %>" checked />
            <span>Include in agenda</span>
          </label>
          <% } else { %>
          <span class="always-included-text">✓ Required module</span>
          <% } %>
          <% if (module.languages.length > 0) { %>
          <div class="lang-tags">
            <% module.languages.forEach(lang => { %>
            <span class="lang-tag"><%= lang %></span>
            <% }) %>
          </div>
          <% } %>
        </div>
      </div>
      <% }) %>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Build My Agenda →</button>
    </div>
  </form>
</section>

<%- include('partials/footer') %>
__HEREDOC__
echo "  [file]  src/views/index.ejs"

# ── src/views/modules.ejs ─────────────────────────────────────────────────────
cat > "$PORTAL/src/views/modules.ejs" <<'__HEREDOC__'
<%- include('partials/header') %>

<div class="page-header">
  <h1>Workshop Modules</h1>
  <p>All <%= modules.length %> modules available in this workshop</p>
</div>

<div class="modules-grid">
  <% modules.forEach(module => { %>
  <div class="module-card">
    <div class="module-card-header">
      <div class="module-badges">
        <span class="badge badge-number">Module <%= module.number.toString().padStart(2, '0') %></span>
        <% if (!module.optional) { %>
        <span class="badge badge-required">Always Included</span>
        <% } %>
      </div>
      <div class="module-meta">
        <span class="badge badge-duration">⏱ <%= module.duration %> min</span>
        <span class="badge badge-format"><%= module.format %></span>
      </div>
    </div>
    <h3 class="module-title">
      <a href="/modules/<%= module.id %>"><%= module.title %></a>
    </h3>
    <p class="module-description"><%= module.description.substring(0, 150) %>...</p>
    <div class="module-objectives">
      <h4>Objectives</h4>
      <ul>
        <% module.objectives.slice(0, 3).forEach(obj => { %>
        <li><%= obj %></li>
        <% }) %>
        <% if (module.objectives.length > 3) { %>
        <li class="more-objectives">+<%= module.objectives.length - 3 %> more...</li>
        <% } %>
      </ul>
    </div>
    <a href="/modules/<%= module.id %>" class="btn btn-secondary">View Details →</a>
  </div>
  <% }) %>
</div>

<%- include('partials/footer') %>
__HEREDOC__
echo "  [file]  src/views/modules.ejs"

# ── src/views/module-detail.ejs ───────────────────────────────────────────────
cat > "$PORTAL/src/views/module-detail.ejs" <<'__HEREDOC__'
<%- include('partials/header') %>

<div class="page-header">
  <a href="/modules" class="back-link">← All Modules</a>
  <h1><%= module.title %></h1>
  <div class="detail-meta">
    <span class="badge badge-number">Module <%= module.number.toString().padStart(2, '0') %></span>
    <span class="badge badge-duration">⏱ <%= module.duration %> min</span>
    <span class="badge badge-format"><%= module.format %></span>
    <% if (!module.optional) { %>
    <span class="badge badge-required">Always Included</span>
    <% } %>
  </div>
</div>

<div class="detail-grid">
  <div class="detail-main">
    <div class="detail-card">
      <h2>Description</h2>
      <p><%= module.description %></p>
    </div>

    <div class="detail-card">
      <h2>Learning Objectives</h2>
      <ul class="objectives-list">
        <% module.objectives.forEach(obj => { %>
        <li>
          <span class="check-icon">✓</span>
          <%= obj %>
        </li>
        <% }) %>
      </ul>
    </div>
  </div>

  <div class="detail-sidebar">
    <div class="detail-card">
      <h3>Module Info</h3>
      <dl class="info-list">
        <dt>Duration</dt>
        <dd><%= module.duration %> minutes</dd>
        <dt>Format</dt>
        <dd><%= module.format %></dd>
        <dt>Required</dt>
        <dd><%= module.optional ? 'Optional' : 'Always included' %></dd>
      </dl>
    </div>

    <% if (module.languages.length > 0) { %>
    <div class="detail-card">
      <h3>Supported Languages</h3>
      <div class="lang-tags">
        <% module.languages.forEach(lang => { %>
        <span class="lang-tag lang-tag-large"><%= lang %></span>
        <% }) %>
      </div>
    </div>
    <% } %>

    <div class="detail-card">
      <a href="/agenda?selectedModules=<%= module.id %>&language=javascript" class="btn btn-primary" style="width:100%;text-align:center;display:block;">
        Add to Agenda →
      </a>
    </div>
  </div>
</div>

<%- include('partials/footer') %>
__HEREDOC__
echo "  [file]  src/views/module-detail.ejs"

# ── src/views/agenda.ejs ──────────────────────────────────────────────────────
cat > "$PORTAL/src/views/agenda.ejs" <<'__HEREDOC__'
<%- include('partials/header') %>

<div class="page-header">
  <h1>My Personalized Agenda</h1>
  <p>
    <span class="badge badge-format"><%= language === 'javascript' ? 'JS' : '☕' %> <%= language === 'javascript' ? 'JavaScript' : 'Java' %></span>
    <span class="badge badge-duration">⏱ Total: <%= totalDuration %> min (<%= Math.round(totalDuration / 60 * 10) / 10 %> hrs)</span>
    <span class="badge badge-number"><%= selectedModules.length %> modules</span>
  </p>
</div>

<div class="agenda-list">
  <% selectedModules.forEach((module, index) => { %>
  <div class="agenda-item">
    <div class="agenda-number"><%= (index + 1).toString().padStart(2, '0') %></div>
    <div class="agenda-content">
      <div class="agenda-header">
        <h3><a href="/modules/<%= module.id %>"><%= module.title %></a></h3>
        <div class="agenda-badges">
          <span class="badge badge-duration">⏱ <%= module.duration %> min</span>
          <span class="badge badge-format"><%= module.format %></span>
          <% if (!module.optional) { %>
          <span class="badge badge-required">Required</span>
          <% } %>
        </div>
      </div>
      <p><%= module.description.substring(0, 200) %>...</p>
      <% if (module.languages.length > 0) { %>
      <div class="lang-tags">
        <% module.languages.forEach(lang => { %>
        <span class="lang-tag <%= lang === language ? 'lang-tag-active' : '' %>"><%= lang %></span>
        <% }) %>
      </div>
      <% } %>
    </div>
  </div>
  <% }) %>
</div>

<div class="form-actions">
  <a href="/" class="btn btn-secondary">← Modify Selection</a>
  <a href="/modules" class="btn btn-primary">View All Modules →</a>
</div>

<%- include('partials/footer') %>
__HEREDOC__
echo "  [file]  src/views/agenda.ejs"

# ── src/views/error.ejs ───────────────────────────────────────────────────────
cat > "$PORTAL/src/views/error.ejs" <<'__HEREDOC__'
<%- include('partials/header') %>

<div class="error-page">
  <div class="error-code"><%= statusCode %></div>
  <h1 class="error-title">
    <% if (statusCode === 404) { %>Page Not Found<% } else { %>Something went wrong<% } %>
  </h1>
  <p class="error-message"><%= message %></p>
  <a href="/" class="btn btn-primary">← Go Home</a>
</div>

<%- include('partials/footer') %>
__HEREDOC__
echo "  [file]  src/views/error.ejs"

# ── public/css/styles.css ─────────────────────────────────────────────────────
cat > "$PORTAL/public/css/styles.css" <<'__HEREDOC__'
/* GitHub-inspired dark theme */
:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface-hover: #1f2937;
  --border: #30363d;
  --accent: #58a6ff;
  --accent-hover: #79c0ff;
  --text: #c9d1d9;
  --text-muted: #8b949e;
  --text-bright: #f0f6fc;
  --green: #3fb950;
  --yellow: #d29922;
  --red: #f85149;
  --purple: #bc8cff;
  --radius: 6px;
  --radius-lg: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.4);
  --transition: 0.15s ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-hover); text-decoration: underline; }

/* ===== NAV ===== */
.nav {
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-bright);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
}
.nav-brand:hover { text-decoration: none; color: var(--accent); }

.nav-logo { font-size: 1.25rem; }

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
}

.nav-links a {
  color: var(--text-muted);
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  transition: background var(--transition), color var(--transition);
  text-decoration: none;
}

.nav-links a:hover {
  background-color: var(--surface-hover);
  color: var(--text-bright);
  text-decoration: none;
}

/* ===== MAIN LAYOUT ===== */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  flex: 1;
  width: 100%;
}

/* ===== HERO ===== */
.hero {
  text-align: center;
  padding: 3rem 1rem 2.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2.5rem;
}

.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--text-bright);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 640px;
  margin: 0 auto;
}

/* ===== SECTIONS ===== */
.section { margin-bottom: 3rem; }

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-bright);
  margin-bottom: 0.5rem;
}

.section-header p { color: var(--text-muted); }

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-bright);
  margin-bottom: 0.75rem;
}

.back-link {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}
.back-link:hover { color: var(--accent); text-decoration: none; }

/* ===== LANGUAGE SELECTOR ===== */
.language-selector {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.language-selector h3 {
  color: var(--text-bright);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.language-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: all var(--transition);
  font-size: 0.9375rem;
  font-weight: 500;
}

.lang-btn input[type="radio"] { display: none; }

.lang-btn:hover {
  border-color: var(--accent);
  color: var(--text-bright);
  background: var(--surface-hover);
}

.lang-btn.active {
  border-color: var(--accent);
  background: rgba(88,166,255,0.1);
  color: var(--accent);
}

.lang-icon {
  font-weight: 700;
  font-size: 0.875rem;
  background: var(--border);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

/* ===== MODULE GRID ===== */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.module-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
}

.module-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.module-required {
  border-color: #30363d;
}

.module-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.module-badges, .module-meta {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.module-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-bright);
  margin: 0;
}
.module-title a { color: var(--text-bright); text-decoration: none; }
.module-title a:hover { color: var(--accent); }

.module-description {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  flex: 1;
}

.module-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

.module-objectives {
  margin: 0.5rem 0;
}

.module-objectives h4 {
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.module-objectives ul {
  list-style: none;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.module-objectives li {
  padding: 0.2rem 0;
  padding-left: 1rem;
  position: relative;
}

.module-objectives li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.more-objectives { color: var(--text-muted); font-style: italic; }

/* ===== BADGES ===== */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.badge-number {
  background: rgba(88,166,255,0.15);
  color: var(--accent);
  border: 1px solid rgba(88,166,255,0.3);
}

.badge-required {
  background: rgba(63,185,80,0.15);
  color: var(--green);
  border: 1px solid rgba(63,185,80,0.3);
}

.badge-duration {
  background: var(--surface-hover);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.badge-format {
  background: rgba(188,140,255,0.15);
  color: var(--purple);
  border: 1px solid rgba(188,140,255,0.3);
}

/* ===== LANG TAGS ===== */
.lang-tags { display: flex; gap: 0.375rem; flex-wrap: wrap; }

.lang-tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--surface-hover);
  color: var(--text-muted);
  border: 1px solid var(--border);
  text-transform: capitalize;
}

.lang-tag-large {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.lang-tag-active {
  background: rgba(88,166,255,0.15);
  color: var(--accent);
  border-color: rgba(88,166,255,0.4);
}

/* ===== CHECKBOX ===== */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
}

.always-included-text {
  font-size: 0.875rem;
  color: var(--green);
  font-weight: 500;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition);
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: var(--accent);
  color: #0d1117;
  border-color: var(--accent);
}
.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: #0d1117;
  text-decoration: none;
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}
.btn-secondary:hover {
  background: var(--surface-hover);
  border-color: var(--accent);
  color: var(--text-bright);
  text-decoration: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
}

/* ===== DETAIL PAGE ===== */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; }
}

.detail-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.detail-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.detail-card h2 {
  font-size: 1.125rem;
  color: var(--text-bright);
  margin-bottom: 0.75rem;
}

.detail-card h3 {
  font-size: 1rem;
  color: var(--text-bright);
  margin-bottom: 0.75rem;
}

.detail-card p { color: var(--text); line-height: 1.7; }

.objectives-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.objectives-list li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: var(--text);
  font-size: 0.9375rem;
}

.check-icon {
  color: var(--green);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.1em;
}

.info-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  font-size: 0.875rem;
}

.info-list dt {
  color: var(--text-muted);
  font-weight: 500;
}

.info-list dd {
  color: var(--text-bright);
}

/* ===== AGENDA ===== */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.agenda-item {
  display: flex;
  gap: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  transition: border-color var(--transition);
}

.agenda-item:hover { border-color: var(--accent); }

.agenda-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--border);
  flex-shrink: 0;
  width: 2.5rem;
  text-align: center;
  padding-top: 0.125rem;
}

.agenda-content { flex: 1; }

.agenda-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.agenda-header h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-bright);
}

.agenda-header h3 a { color: var(--text-bright); }
.agenda-header h3 a:hover { color: var(--accent); text-decoration: none; }

.agenda-badges { display: flex; gap: 0.375rem; flex-wrap: wrap; }

.agenda-content p {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.625rem;
  line-height: 1.6;
}

/* ===== ERROR PAGE ===== */
.error-page {
  text-align: center;
  padding: 4rem 1rem;
}

.error-code {
  font-size: 5rem;
  font-weight: 700;
  color: var(--border);
  line-height: 1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.75rem;
  color: var(--text-bright);
  margin-bottom: 0.75rem;
}

.error-message {
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== FOOTER ===== */
.footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .modules-grid { grid-template-columns: 1fr; }
  .language-buttons { flex-direction: column; }
  .form-actions { flex-direction: column; }
  .nav-links { display: none; }
  .agenda-item { flex-direction: column; gap: 0.75rem; }
}
__HEREDOC__
echo "  [file]  public/css/styles.css"

# ── public/js/main.js ─────────────────────────────────────────────────────────
cat > "$PORTAL/public/js/main.js" <<'__HEREDOC__'
'use strict';

// Language button toggle
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach((btn) => {
  const radio = btn.querySelector('input[type="radio"]');
  if (radio) {
    btn.addEventListener('click', () => {
      langButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  }
});
__HEREDOC__
echo "  [file]  public/js/main.js"

# ── test/moduleService.test.js ────────────────────────────────────────────────
cat > "$PORTAL/test/moduleService.test.js" <<'__HEREDOC__'
'use strict';

const { getAllModules, getModuleById, filterByLanguage } = require('../src/services/moduleService');

describe('moduleService', () => {
  test('should return all 7 modules', () => {
    const modules = getAllModules();
    expect(modules).toHaveLength(7);
  });

  test('should find a module by id', () => {
    const module = getModuleById('module-01-core-experience');
    expect(module).toBeDefined();
    expect(module.title).toBe('Copilot in VS Code Core Experience');
  });

  test('should return undefined for unknown module id', () => {
    const module = getModuleById('module-99-nonexistent');
    expect(module).toBeUndefined();
  });

  test('should filter modules by language', () => {
    const jsModules = filterByLanguage('javascript');
    // Modules without language constraints are also included
    expect(jsModules.length).toBeGreaterThan(0);
    // All returned modules should either have no language or include javascript
    jsModules.forEach((m) => {
      expect(
        m.languages.length === 0 || m.languages.includes('javascript')
      ).toBe(true);
    });
  });
});
__HEREDOC__
echo "  [file]  test/moduleService.test.js"

# ── test/routes.test.js ───────────────────────────────────────────────────────
cat > "$PORTAL/test/routes.test.js" <<'__HEREDOC__'
'use strict';

const request = require('supertest');
const { app } = require('../src/app');

describe('routes', () => {
  test('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /modules should return 200', async () => {
    const res = await request(app).get('/modules');
    expect(res.statusCode).toBe(200);
  });

  test('GET /modules/module-01-core-experience should return 200', async () => {
    const res = await request(app).get('/modules/module-01-core-experience');
    expect(res.statusCode).toBe(200);
  });

  test('GET /modules/nonexistent should return 404', async () => {
    const res = await request(app).get('/modules/nonexistent');
    expect(res.statusCode).toBe(404);
  });

  test('GET /agenda?selectedModules=module-01-core-experience&language=javascript should return 200', async () => {
    const res = await request(app)
      .get('/agenda')
      .query({ selectedModules: 'module-01-core-experience', language: 'javascript' });
    expect(res.statusCode).toBe(200);
  });
});
__HEREDOC__
echo "  [file]  test/routes.test.js"

# ── Install dependencies ──────────────────────────────────────────────────────
echo ""
echo "📦  Installing npm dependencies..."
cd "$PORTAL"
npm install
echo "  [npm]  dependencies installed"

# ── Run tests ─────────────────────────────────────────────────────────────────
echo ""
echo "🧪  Running tests..."
npm test
echo "  [test]  all tests passed"

# ── Start server briefly to verify it boots ───────────────────────────────────
echo ""
echo "🚀  Verifying server starts..."
timeout 5 node src/server.js; echo "  [server]  started and stopped successfully"

# ── Git commit ────────────────────────────────────────────────────────────────
echo ""
echo "📝  Committing portal to git..."
cd "$SCRIPT_DIR"
git add portal/
git commit -m "feat: add GitHub Copilot Enterprise Workshop portal

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
echo "  [git]  committed"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "✅  Portal is ready!"
echo ""
echo "  cd portal && npm start   # visit http://localhost:3000"
echo ""
