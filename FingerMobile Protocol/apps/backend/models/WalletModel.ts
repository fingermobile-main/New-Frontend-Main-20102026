import { DataTypes, Model, Optional } from 'sequelize';
import logger from '../utils/logger.js';
import { getSequelize } from '../utils/modelInitializer.js';

logger.info('[WalletModel] Module is being loaded!');

interface WalletAttributes {
id: string;
userId: string;
balance: number;
currency: string;
status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WalletCreationAttributes extends Optional<WalletAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  public id!: string;
  public userId!: string;
  public balance!: number;
  public currency!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Deferred initialization - will be called when sequelize is ready
export const initializeWallet = () => {
  Wallet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'user_id', // Map to snake_case column name in database
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'closed'),
        defaultValue: 'active'
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'Wallet',
      tableName: 'wallets',
      timestamps: true,
      createdAt: 'created_at', // Map to snake_case column name,
      updatedAt: 'updated_at', // Map to snake_case column name
    }
  );
};

export default Wallet;
