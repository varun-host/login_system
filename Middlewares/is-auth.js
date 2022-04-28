//checks if the user requesting the dashboard is logged in and has the session stored
//in db or not.

module.exports =  (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      req.session.error = "You have to Login first";
      res.redirect("/login");
    }
};
