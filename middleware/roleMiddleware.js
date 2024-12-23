export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden! You don't have permission to perform this action.",
    });
  }

  next();
};
