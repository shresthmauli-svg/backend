const { pool } = require('../config/db');
const { success } = require('../utils/apiResponse');

exports.getSummary = async (req, res) => {
  const [totalRes, statusRes, ruleConfigRes, recentRes] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM inspections'),
    pool.query('SELECT status, COUNT(*) FROM inspections GROUP BY status'),
    pool.query('SELECT rule_config_version, COUNT(*) FROM inspections GROUP BY rule_config_version'),
    pool.query('SELECT id, client_inspection_id, status, updated_at FROM inspections ORDER BY updated_at DESC LIMIT 5')
  ]);

  const summary = {
    totalInspections: parseInt(totalRes.rows[0].count, 10),
    pendingReview: 0,
    completed: 0,
    nonCompliant: 0, // In a real scenario, this would come from compliance_result -> overallVerdict
    compliant: 0,
    conflicted: 0,
    byRuleConfigVersion: ruleConfigRes.rows.map(r => ({ version: r.rule_config_version, count: parseInt(r.count, 10) })),
    recentInspections: recentRes.rows
  };

  statusRes.rows.forEach(r => {
    if (r.status === 'PENDING_REVIEW') summary.pendingReview = parseInt(r.count, 10);
    if (r.status === 'COMPLETED') summary.completed = parseInt(r.count, 10);
    if (r.status === 'CONFLICTED') summary.conflicted = parseInt(r.count, 10);
  });

  res.json(success(summary));
};

exports.getViolations = async (req, res) => {
  // Mock endpoint as requested. Do not evaluate legal rules, just return data if it has violations
  const result = await pool.query(`
    SELECT id, compliance_result, updated_at
    FROM inspections
    WHERE rule_engine_status = 'EVALUATED'
    ORDER BY updated_at DESC
    LIMIT 20
  `);
  
  res.json(success(result.rows));
};

exports.getInspectors = async (req, res) => {
  const result = await pool.query(`
    SELECT id, full_name, email, is_active, last_login_at
    FROM users
    WHERE role = 'INSPECTOR'
    ORDER BY full_name ASC
  `);
  
  res.json(success(result.rows));
};
