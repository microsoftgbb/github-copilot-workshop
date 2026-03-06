'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const helmet = require('helmet');
const { doubleCsrf } = require('csrf-csrf');

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

// Cookie parser (required for CSRF double-submit pattern)
app.use(cookieParser());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'copilot-workshop-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' },
  })
);

// CSRF protection (double-submit cookie pattern)
const isProduction = process.env.NODE_ENV === 'production';
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET ?? 'copilot-workshop-secret',
  getSessionIdentifier: (req) => req.sessionID ?? '',
  cookieName: isProduction ? '__Host-x-csrf-token' : 'x-csrf-token',
  cookieOptions: {
    secure: isProduction,
    sameSite: 'strict',
  },
});
app.use(doubleCsrfProtection);

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.csrfToken = generateCsrfToken(req, res);
  next();
});

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
