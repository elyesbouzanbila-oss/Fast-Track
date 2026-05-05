const Bug = require('../models/Bug');

function buildBugDescription(data = {}) {
  const parts = [
    `[BUG] ${data.title || 'Untitled bug'}`,
    '',
    `Category: ${data.category || 'unknown'}`,
    `Impact: ${data.impact || 'medium'}`,
    '',
    'Steps to reproduce:',
    data.steps || '',
    '',
    'Expected behavior:',
    data.expected_behavior || '',
    '',
    'Actual behavior:',
    data.actual_behavior || '',
  ];

  if (data.extra_details) {
    parts.push('', 'Extra details:', data.extra_details);
  }

  return parts.join('\n').trim();
}

async function listBugs(limit = 100) {
  return Bug.findAll({
    where: { is_active: true },
    order: [['createdAt', 'DESC']],
    limit,
  });
}

async function getBugById(id) {
  return Bug.findByPk(id);
}

async function createBug(data, userId) {
  return Bug.create({
    category: String(data.category || '').trim(),
    impact: String(data.impact || 'medium').trim(),
    title: String(data.title || '').trim(),
    steps: String(data.steps || '').trim(),
    expected_behavior: String(data.expected_behavior || '').trim(),
    actual_behavior: String(data.actual_behavior || '').trim(),
    extra_details: data.extra_details ? String(data.extra_details).trim() : '',
    description: data.description || buildBugDescription(data),
    source_page: data.source_page ? String(data.source_page).trim() : '',
    reported_by: userId,
  });
}

module.exports = {
  buildBugDescription,
  listBugs,
  getBugById,
  createBug,
};