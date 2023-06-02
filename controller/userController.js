import Users from "../model/userModel.js";
import auth from "../middleware/jwtAuthenticationMiddleware.js";
import {
  BadRequestError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
} from "../errors.js";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError("Please provide both email and password.");
    }

    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const token = user.createJWT();
    user.password = undefined;
    res
      .status(200)
      .header("Authorization", `Bearer ${token}`)
      .json({ success: true, user: user, token: token });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 * @param {*} req
 * @param {*} res
 * @returns JsonResponse
 */
export const createUser = async (req, res, next) => {
  const { name, email, password, IsAdmin, tel } = req.body;

  try {
    const user = await Users.create({ name, email, password, IsAdmin, tel });

    res.status(201).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const errorMessage = "You are already Signup";
      return next(new BadRequestError(errorMessage));
    }
    next(error);
  }
};

/**
 * Function to read all users from the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {};

    if (req.query.name) {
      filters.name = { $regex: new RegExp("^" + req.query.name, "i") };
    }
    if (req.query.email) {
      filters.email = { $regex: new RegExp("^" + req.query.email, "i") };
    }

    const user = await Users.paginate(filters, { page, limit });

    if (!user.docs.length) {
      if (req.query.name) {
        throw new NotFoundError(`No user found for ${req.query.name}`);
      }
      if (req.query.email) {
        throw new NotFoundError(`No user found for ${req.query.email}`);
      }
      throw new NotFoundError(`No user found`);
    }
    return res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Function to Delete a user from the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteUser = async (req, res, next) => {
  try {
    const total = await Users.countDocuments({});
    if (total === 1) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      error: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * function to Update user profile
 */
export const updateUser = async (req, res, next) => {
  const { name, email, tel } = req.body;
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.user._id,
      { name: name, email: email, tel: tel },
      {
        new: true,
      }
    );

    // if (updatedUser.modified === 0) {
    // throw new NotFoundError("User not found");
    // }
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
//

export const updateUsers = async (req, res, next) => {
  const { name, email, tel } = req.body;

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      { name: name, email: email, tel: tel },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * function to Update user profile
 */
export const updateUserPrev = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await Users.findById(userId);
    console.log(user);
    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }

    user.IsAdmin = !user.IsAdmin;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Function to read a  user by id from the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUser = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await Users.find({ _id: id });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        data: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Function to read a  user by id from the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUserbyName = async (req, res, next) => {
  const name = req.query.name;
  try {
    const user = await Users.find({
      name: { $regex: `.*${name}.*`, $options: "i" },
    });
    if (!user) {
      throw new NotFoundError(`User ${name} Not found`);
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * This Function it updates the password field
 * @param {*} req
 * @param {*} res
 * @returns Object status of the success and the message or data
 */
export const updatePassword = async (req, res, next) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Old password and new password are required");
    }
    const user = await Users.findById(userId).select("password");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new UnauthorizedError("Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
