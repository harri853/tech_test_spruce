const express = require('express');
const router = express.Router();
const { testDbConnection, saveGameResult, getGameStats } = require('../controllers/gameController');

router.get('/test-db', testDbConnection);
router.post('/game-result', saveGameResult);
router.get('/stats', getGameStats);

module.exports = router;
