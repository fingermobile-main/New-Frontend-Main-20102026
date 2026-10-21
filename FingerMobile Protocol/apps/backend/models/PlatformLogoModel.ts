import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';

interface PlatformLogoAttributes {
  id: number;
  name: string;
  alt_text?: string;
  logo_url: string;
  platform_key: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface PlatformLogoCreationAttributes extends Optional<PlatformLogoAttributes, 'id' | 'alt_text' | 'display_order' | 'is_active' | 'created_at' | 'updated_at'> {}

class PlatformLogo extends Model<PlatformLogoAttributes, PlatformLogoCreationAttributes> implements PlatformLogoAttributes {
  public id!: number;
  public name!: string;
  public alt_text?: string;
  public logo_url!: string;
  public platform_key!: string;
  public display_order!: number;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export const initializePlatformLogo = () => {
  PlatformLogo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      alt_text: {
        type: DataTypes.STRING,
        allowNull: true
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      platform_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'PlatformLogo',
      tableName: 'platform_logos',
      timestamps: false // Handled manually or by database defaults
    }
  );
};

export default PlatformLogo;
