const { createBug, listBugs, getBugById } = require('../services/bugService');

async function listBugReports(req, res, next) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '100', 10) || 100, 1), 500);
    const bugs = await listBugs(limit);
    res.json({ success: true, data: bugs, count: bugs.length });
  } catch (err) {
    next(err);
  }
}

async function getBug(req, res, next) {
  try {
    const bug = await getBugById(req.params.id);
    if (!bug) {
      return res.status(404).json({ success: false, error: 'Bug report not found' });
    }
    res.json({ success: true, data: bug });
  } catch (err) {
    next(err);
  }
}

async function reportBug(req, res, next) {
  try {
    const bug = await createBug(req.body, req.user.id);
    res.status(201).json({ success: true, data: bug });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listBugReports,
  getBug,
  reportBug,
};