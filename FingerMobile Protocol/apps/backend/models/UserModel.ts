import { DataTypes, Model, Optional } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer.js';
import bcrypt from 'bcryptjs';

interface UserAttributes {
id: number;
uuid: string;
email: string;
password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
role: string;
status: string;
  lastLoginAt?: Date;
emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiresAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  fiatBalance?: number;
  cryptoBalance?: number;
  aiCredits?: number;
  cesScore?: number;
  strikes?: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'role' | 'status' | 'emailVerified' | 'failedLoginAttempts'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public uuid!: string;
  public email!: string;
  public password!: string;
  public firstName?: string;
  public lastName?: string;
  public username?: string;
  public phone?: string;
  public role!: string;
  public status!: string;
  public lastLoginAt?: Date;
  public emailVerified!: boolean;
  public emailVerificationToken?: string;
  public emailVerificationExpiresAt?: Date;
  public passwordResetToken?: string;
  public passwordResetExpiresAt?: Date;
  public failedLoginAttempts!: number;
  public lockedUntil?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public fiatBalance!: number;
  public cryptoBalance!: number;
  public aiCredits!: number;
  public cesScore!: number;
  public strikes!: number;

  // Instance method to compare password
  async comparePassword(
    candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Instance method to hash password before saving
  async hashPassword(): Promise<void> {
    if (this.changed('password')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Check if account is locked
  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  // Increment failed login attempts
  incrementFailedAttempts(): void {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }
  }

  // Reset failed login attempts
  resetFailedAttempts(): void {
    this.failedLoginAttempts = 0;
    this.lockedUntil = undefined;
  }
}


// Deferred initialization - will be called when sequelize is ready
export const initializeUser = () => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM('user', 'admin', 'moderator'),
        defaultValue: 'user'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended', 'deleted'),
        defaultValue: 'active'
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emailVerificationExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      passwordResetExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true
      },
      fiatBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      cryptoBalance: {
        type: DataTypes.DECIMAL(18, 8),
        defaultValue: 0.00000000
      },
      aiCredits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      cesScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      strikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize: getSequelize(),
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (
          user: User) => {
          await user.hashPassword();
        },
        beforeUpdate: async (
          user: User) => {
          await user.hashPassword();
        }
      }
    }
  );
};

export default User;
