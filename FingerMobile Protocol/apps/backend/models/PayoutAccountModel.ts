import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../database/connection';
import logger from '../utils/logger';

export class PayoutAccount extends Model {
  public id!: string;
  public userId!: string;
  public accountName!: string;
  public accountNumber!: string;
  public routingNumber!: string;
  public bankName!: string;
  public accountType!: string;
  public isDefault!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializePayoutAccount = () => {
  const sequelize = getSequelize();
  if (!sequelize) {
    logger.warn('Sequelize not initialized, skipping PayoutAccount model initialization');
    return;
  }

  PayoutAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'account_name'
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'account_number'
      },
      routingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'routing_number'
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'bank_name'
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'account_type'
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_default'
      },
    },
    {
      sequelize,
      tableName: 'payout_accounts',
      underscored: true,
      timestamps: true,
    }
  );
};

export default PayoutAccount;
