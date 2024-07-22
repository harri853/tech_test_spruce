const pool = require('../config/db.config');

const saveGameResults = async (results) => {
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
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getGameStats = async () => {
  const result = await pool.query(
    `SELECT player, result, COUNT(*) as count
     FROM game_results
     GROUP BY player, result`
  );
  return result.rows.reduce((acc, row) => {
    acc[row.player] = acc[row.player] || { win: 0, loss: 0 };
    acc[row.player][row.result] = parseInt(row.count, 10);
    return acc;
  }, {});
};

module.exports = {
  saveGameResults,
  getGameStats,
};
