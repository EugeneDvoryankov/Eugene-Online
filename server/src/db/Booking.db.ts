import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from 'sequelize';
import sequelize from './conn';
import UserModel from './User.db';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type Day = | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

type TimeSlot = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

class BookingModel extends Model<
  InferAttributes<BookingModel>,
  InferCreationAttributes<BookingModel>
> {
  declare id: CreationOptional<string>;

  declare type: 'consultation' | 'update';

  declare year: number;

  declare month: Month;

  declare day: Day;

  declare time: TimeSlot;

  declare userId: ForeignKey<UserModel['id']>;
  // declare userId: string;
}

BookingModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['consultation', 'update']],
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 31,
      },
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 6,
        max: 17,
      },
    },
    /* userId: {
      type: DataTypes.UUID,
      allowNull: false,
    }, */
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: false,
  },
);

// You have to provide the foreign key
// Since the name is UserModel maybe Sequelize adds a default foreign key UserModelId
// or something like that
UserModel.hasMany(BookingModel, {
  foreignKey: 'userId',
});
BookingModel.belongsTo(UserModel, {
  foreignKey: 'userId',
});

export default BookingModel;
