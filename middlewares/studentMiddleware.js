const studentMiddleware = () => {
  return (req, res, next) => {
    req.body = { ...req.body, role: "student" };
    next();
  };
};

module.exports = studentMiddleware;
