import * as dotenv from "dotenv";
dotenv.config();
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<string>;
  accountName: string;
  username: string;
  password: string;
  userType: CreationOptional<string>;
}

interface PostModel
  extends Model<
    InferAttributes<PostModel>,
    InferCreationAttributes<PostModel>
  > {
  id: CreationOptional<string>;
  title: string;
  content: string;
  status: string;
}

const User = sequelize.define<UserModel>(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    scopes: {
      withoutPassword: {
        attributes: { exclude: ["password"] },
      },
    },
  }
);

const Post = sequelize.define<PostModel>(
  "Post",
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
    status: {
      type: DataTypes.ENUM("published", "unpublished"),
      defaultValue: "unpublished",
    },
  },
  {}
);

User.hasMany(Post, {
  foreignKey: {
    // @ts-ignore
    type: DataTypes.UUID,
  },
});

Post.belongsTo(User);

sequelize.sync().then(() => console.log("Sync complete"));

export { User, Post };
