import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface StakeAttributes {
id: string;
userId: string;
walletId: string;
amount: number;
currency: string;
status: string;
  rewardRate?: number;
  stakedAt?: Date;
  unstakedAt?: Date;
  rewards?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StakeCreationAttributes extends Optional<StakeAttributes, 'id' | 'createdAt' | 'updatedAt' | 'unstakedAt' | 'rewards'> {}

class Stake extends Model<StakeAttributes, StakeCreationAttributes> implements StakeAttributes {
  public id!: string;
  public userId!: string;
  public walletId!: string;
  public amount!: number;
  public currency!: string;
  public status!: string;
  public rewardRate?: number;
  public stakedAt?: Date;
  public unstakedAt?: Date;
  public rewards?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


// Deferred initialization - will be called when sequelize is ready
export const initializeStake = () => {
  Stake.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      walletId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
      },
      status: {
        type: DataTypes.ENUM('active', 'unstaked', 'pending'),
        defaultValue: 'active'
      },
      rewardRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      stakedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      unstakedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      rewards: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'Stake',
      tableName: 'stakes',
      timestamps: true
    }
  );
};

export default Stake;
