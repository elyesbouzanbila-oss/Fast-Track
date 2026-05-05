const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Bug model — user-reported application issues.
 */
const Bug = sequelize.define('Bug', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  impact: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  },
  title: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  steps: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expected_behavior: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  actual_behavior: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  extra_details: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  source_page: {
    type: DataTypes.STRING(255),
  },
  reported_by: {
    type: DataTypes.UUID,
    references: { model: 'users', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('open', 'triaged', 'resolved', 'closed'),
    defaultValue: 'open',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  resolved_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'bugs',
  underscored: true,
  timestamps: true,
});

module.exports = Bug;