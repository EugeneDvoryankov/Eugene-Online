import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from 'sequelize';
import sequelize from './conn';
import { Status } from '../model/order.interface';
import UserModel from './User.db';
import ProductModel from './Product.db';

class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare orderId: CreationOptional<string>;

  declare status: CreationOptional<Status>;

  declare date: CreationOptional<string>;

  declare isPaid: CreationOptional<boolean>;

  declare userId: ForeignKey<UserModel['id']>;
  // declare userId: string;

  declare productId: ForeignKey<ProductModel['id']>;
  // declare productId: string;
}

OrderModel.init(
  {
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isIn: [[0, 1, 2, 3]] },
    },
    /* userId: {
      type: DataTypes.UUID,
      allowNull: false,
    }, */
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: false,
  },
);

// You have to provide the foreign key
// Since the name is UserModel maybe Sequelize adds a default foreign key UserModelId
// or something like that
UserModel.hasMany(OrderModel, {
  foreignKey: 'userId',
});
OrderModel.belongsTo(UserModel, {
  foreignKey: 'userId',
});

ProductModel.hasMany(OrderModel, {
  foreignKey: 'productId',
});
OrderModel.belongsTo(ProductModel, {
  foreignKey: 'productId',
});

export default OrderModel;
