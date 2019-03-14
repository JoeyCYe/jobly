const bcrypt = require("bcrypt");
const buildSearchQuery = require("../helpers/buildSearchQuery");
const db = require("../db");
const { BCRYPT_WORK_ROUNDS } = require("../config");
//FIXME

class User {
  static async createUser( {username, password, first_name, last_name, email, photo_url, is_admin }) {
    try {
      let hashedPassword = bcrypt.hash(password, BCRYPT_WORK_ROUNDS);
      let result = await db.query(
        ` INSERT INTO users (username, password, first_name, last_name, email, photo_url, is_admin)
                      VALUES ($1, $2, $3, $4, $5, $6, $7)
                      RETURNING username, first_name, last_name, email, photo_url, is_admin
                    `,
        [
          username,
          hashedPassword,
          first_name,
          last_name,
          email,
          photo_url,
          is_admin
        ]
      );
      return result.rows[0];
    } catch (err) {
      throw { message: "username and email must be unique", status: 409 };
    }
  }

  static async getAllUsers(){
    let allUsers = await db.query(
        ` SELECT username, first_name, last_name, email
          FROM users`
    );
    return allUsers.rows;
  }

  static async getUserByUsername(username){
      let user = await db.query(
          `SELECT username, first_name, last_name, email, photo_url
           FROM users
           WHERE username = $1`, [username]
      );
      return user.rows[0];
  }

  static async updateUser()
}

module.exports = User;