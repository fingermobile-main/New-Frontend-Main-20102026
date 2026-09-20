import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('communications', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false
      },
      target_audience: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft'
      },
      scheduled_at: {
        type: DataTypes.DATE
      },
      sent_at: {
        type: DataTypes.DATE
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Create broadcast_recipients table
    await queryInterface.createTable('broadcast_recipients', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      broadcast_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'communications',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipient_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'delivered', 'read', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      delivered_at: {
        type: DataTypes.DATE
      },
      read_at: {
        type: DataTypes.DATE
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('communications', ['status'], {
      name: 'communications_status_idx'
    });

    await queryInterface.addIndex('communications', ['created_at'], {
      name: 'communications_created_at_idx'
    });

    await queryInterface.addIndex('broadcast_recipients', ['broadcast_id'], {
      name: 'broadcast_recipients_broadcast_id_idx'
    });

    await queryInterface.addIndex('broadcast_recipients', ['user_id'], {
      name: 'broadcast_recipients_user_id_idx'
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('broadcast_recipients');
    await queryInterface.dropTable('communications');
  }
};