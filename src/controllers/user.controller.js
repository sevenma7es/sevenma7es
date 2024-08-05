import UserDAO from "../dao/user.dao.js";
import { logger } from "../utils/logger.js";
import { sortUsers } from "../utils/functions.js";

const userDao = new UserDAO();

class UserController {
  async isThereAnAdmin() {
    try {
      const admins = await userDao.isThereAnAdmin();
      if (admins.length === 0) {
        return { status: "error", message: "No admins in database" };
      }
      return { status: "success", admins: admins };
    } catch (error) {
      logger.error("Error getting admins:", error.message);
      throw error;
    }
  }

  async getAllUsers(req, res, query, limit, page) {
    try {
      const { sort, query, findBy } = req.query || {};
      const filter = {};

      if (query) {
        filter["$or"] = [{ [findBy]: { $regex: query, $options: "i" } }];
      }

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      // const users = await userDao.getAllUsers(limit, page, sortOptions, filter);

      let users;
      if (query) {
        users = await userDao.getAllUsers(limit, page, {}, filter);
      } else {
        users = await userDao.getAllUsers(limit, page, sortOptions, filter);
      }

      const sortedUsers = sortUsers(users);
      const totalUsers = await userDao.countUsers(filter);
      const totalPages = Math.ceil(totalUsers / limit);

      const result = {
        status: "success",
        ResultSet: sortedUsers,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/users?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/users?limit=${limit}&page=${page + 1}` : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /users route:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  async getUserStats() {
    try {
      const totalUsers = await userDao.getTotalUsers();
      const adminUsers = await userDao.getAdminUsersCount();
      const customerUsers = totalUsers - adminUsers;

      return { totalUsers, adminUsers, customerUsers };
    } catch (error) {
      logger.error("Error getting user stats:", error.message);
      throw error;
    }
  }

  async countUsers() {
    try {
      const totalAdmins = await userDao.countUsers();
      return totalAdmins;
    } catch (error) {
      logger.error("Error counting users:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await userDao.findById(id);
      if (user.length === 0) {
        return { status: "error", message: "No user found" };
      }
      return { status: "success", user: user };
    } catch (error) {
      logger.error("Error getting user:", error.message);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = await userDao.findByEmail(email);
      if (user.length === 0) {
        return { status: "error", message: "No user found" };
      }
      return { status: "success", user: user };
    } catch (error) {
      logger.error("Error getting user:", error.message);
      throw error;
    }
  }

  async verifyEmail(user_id) {
    try {
      await userDao.verifyEmail(user_id);
      return { status: "success", message: "Email verified successfully" };
    } catch (error) {
      logger.error("Error verifying user email:", error.message);
      throw error;
    }
  }
}

export default UserController;
