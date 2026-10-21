import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

// Define the interface for the BlockMute model
interface BlockMuteAttributes {
id: string;
blockerId: string;
blockedUserId: string;
muteType: 'notification' | 'ugc' | 'all'; // enum type
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (making id optional as it's typically auto-generated)
interface BlockMuteCreationAttributes extends Optional<BlockMuteAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the model class extending Sequelize's Model
class BlockMute extends Model<BlockMuteAttributes, BlockMuteCreationAttributes> implements BlockMuteAttributes {
  public id!: string;
  public blockerId!: string;
  public blockedUserId!: string;
  public muteType!: 'notification' | 'ugc' | 'all';
  public reason?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Deferred initialization - will be called when sequelize is ready
export const initializeBlockMute = () => {
  BlockMute.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      blockerId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      blockedUserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      muteType: {
        type: DataTypes.ENUM('notification', 'ugc', 'all'),
        allowNull: false
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'block_mutes',
      sequelize: getSequelize()
    }
  );
};

export { BlockMute, BlockMuteAttributes, BlockMuteCreationAttributes };
