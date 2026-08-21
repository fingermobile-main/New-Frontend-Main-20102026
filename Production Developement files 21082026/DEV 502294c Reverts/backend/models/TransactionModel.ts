import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../utils/modelInitializer";

interface TransactionAttributes {
id: string;
walletId: string;
userId: string;
type: string;
amount: number;
currency: string;
status: string;
  description?: string;
  reference?: string;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "createdAt" | "updatedAt"> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: string;
  public walletId!: string;
  public userId!: string;
  public type!: string;
  public amount!: number;
  public currency!: string;
  public status!: string;
  public description?: string;
  public reference?: string;
  public metadata?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


// Deferred initialization - will be called when sequelize is ready
export const initializeTransaction = () => {
  Transaction.init(
    {
      id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("credit", "debit", "stake", "payout", "distribution"),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USD"
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "cancelled"),
      defaultValue: "pending"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
sequelize: getSequelize(),
modelName: "Transaction",
tableName: "transactions",
timestamps: true
  }
);
};

export default Transaction;
