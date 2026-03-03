const express = require('express');
const { listModules, getModule }       = require('../services/moduleService');
const { validateLanguage, validateModuleId } = require('../middleware/inputValidator');

const moduleRouter = express.Router();

/**
 * GET /api/modules
 * Returns all workshop modules, optionally filtered by ?language=java|javascript.
 */
moduleRouter.get('/modules', async (req, res, next) => {
  try {
    const language = validateLanguage(req.query.language);
    const modules  = await listModules(language);
    res.json({ modules });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/modules/:moduleId
 * Returns full detail for a single module.
 */
moduleRouter.get('/modules/:moduleId', async (req, res, next) => {
  try {
    validateModuleId(req.params.moduleId);
    const language = validateLanguage(req.query.language);
    const module   = await getModule(req.params.moduleId, language);
    res.json({ module });
  } catch (err) {
    next(err);
  }
});

module.exports = { moduleRouter };
