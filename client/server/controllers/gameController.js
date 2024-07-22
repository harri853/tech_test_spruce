const pool = require('../config/db.config');

const testDbConnection = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ message: 'Database connection successful', time: result.rows[0].now });
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).send('Error testing database connection');
  }
};

const saveGameResult = async (req, res) => {
  const results = req.body;
  if (!Array.isArray(results) || results.length === 0) {
    console.error('Results array is required');
    return res.status(400).send('Results array is required');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { player, result } of results) {
      if (!player || !result) {
        throw new Error('Player and result are required for each entry');
      }
      await client.query('INSERT INTO game_results (player, result) VALUES ($1, $2)', [player, result]);
    }
    await client.query('COMMIT');
    res.status(201).send('Game results saved');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving game results:', error);
    res.status(500).send('Error saving game results');
  } finally {
    client.release();
  }
};

const getGameStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT player, result, COUNT(*) as count
       FROM game_results
       GROUP BY player, result`
    );
    const stats = result.rows.reduce((acc, row) => {
      acc[row.player] = acc[row.player] || { win: 0, loss: 0 };
      acc[row.player][row.result] = parseInt(row.count, 10);
      return acc;
    }, {});
    res.json(stats);
  } catch (error) {
    console.error('Error fetching game stats:', error);
    res.status(500).send('Error fetching game stats');
  }
};

module.exports = { testDbConnection, saveGameResult, getGameStats };
