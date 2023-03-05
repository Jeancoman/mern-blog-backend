import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize(process.env.DATABASE_URL);
try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
}
catch (error) {
    console.error("Unable to connect to the database:", error);
}
const User = sequelize.define("User", {
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
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {});
const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("published", "unpublished"),
        defaultValue: "unpublished",
    },
}, {});
User.hasMany(Post, {
    foreignKey: {
        // @ts-ignore
        type: DataTypes.UUID,
    },
});
Post.belongsTo(User);
sequelize.sync().then(() => console.log("Sync complete"));
export { User, Post };
