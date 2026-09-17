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
