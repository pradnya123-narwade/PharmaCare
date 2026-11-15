// Alternative Sequelize Medicine Model for PostgreSQL
import { DataTypes, Model } from "sequelize";
import { getPostgresConnection } from "../../config/postgres.js";

const sequelize = getPostgresConnection();

export class PostgresMedicine extends Model {}

PostgresMedicine.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 255]
      }
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM("Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops"),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Medicine",
    tableName: "medicines",
    timestamps: true
  }
);
