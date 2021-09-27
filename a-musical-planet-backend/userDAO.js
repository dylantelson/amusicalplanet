let users;

export default class UserDAO {
  static async injectDB(conn) {
    if (users) return;
    try {
      users = await conn
        .injectDB(process.env.MONGO_DATABASE_NAME)
        .collection("user");
    } catch (e) {
      console.error(`Unable to connect to the collection: ${e}`);
    }
  }

  static async getUser(userName) {
    let user;
    try {
      user = await users.findOne({ userName: userName });
      return user;
    } catch (e) {
      console.log(`Could not find user with username ${userName}`);
    }
  }
}
