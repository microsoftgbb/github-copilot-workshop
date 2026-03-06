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
  const language = req.session?.language ?? 'javascript';
  res.render('module-detail', { title: module.title, module, language });
});

module.exports = { router };
