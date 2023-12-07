import pool from './databasePool.js';

export const createTriggers = async (client, ruleId, triggers) => {
  const modifyTriggers = triggers.flatMap(el => {
    const trigger = [ruleId, el.triggerTypeId];
    if (el.triggerTypeId === 10) {
      trigger.push(null, null);
    } else {
      trigger.push(el.thresholds, el.timeWindow);
    }
    return trigger;
  });
  const placeholders = triggers
    .map(
      (_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`,
    )
    .join(', ');
  const queryText = `INSERT INTO triggers(rule_id, trigger_type_id, threshold, time_window) VALUES ${placeholders} RETURNING *`;
  const res = await client.query(queryText, modifyTriggers);

  return res.rows;
};

export const getTriggers = async () => {};

export const getTriggerTypes = async () => {
  const query = {
    text: `SELECT * FROM trigger_types`,
  };

  const res = await pool.query(query);
  return res.rows;
};

export const deleteTrigger = async (client, ruleId) => {
  const query = {
    text: `UPDATE triggers SET delete = true WHERE rule_id = $1 RETURNING delete`,
    values: [ruleId],
  };

  const res = await client.query(query);

  return res.rows[0];
};
