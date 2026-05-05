const router = require('express').Router();
const { listBugReports, getBug, reportBug } = require('../controllers/bugController');
const { authenticate } = require('../middleware/auth');
const { validateBugReport } = require('../middleware/validation');

/**
 * Bug endpoints.
 */

router.get('/', listBugReports);
router.get('/:id', getBug);
router.post('/', authenticate, validateBugReport, reportBug);

module.exports = router;