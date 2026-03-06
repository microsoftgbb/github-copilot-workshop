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
