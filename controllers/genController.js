module.exports.route = function(req, res, next) {
  return res.status(200).json({
    authSuccess: true,
    user: req.user
  });
}
