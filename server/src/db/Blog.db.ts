import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import sequelize from './conn';

class BlogModel extends Model<
  InferAttributes<BlogModel>,
  InferCreationAttributes<BlogModel>
> {
  declare id: CreationOptional<string>;

  declare title: string;

  declare content: string;

  declare uploadAt: CreationOptional<string>;
}

BlogModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uploadAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'blogs',
    timestamps: false,
  },
);

export default BlogModel;
