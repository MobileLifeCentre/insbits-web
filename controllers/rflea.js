/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('rflea', {
    title: 'rFlea',
    server: req.headers.host,
    userId: (req.user? req.user.profile.name.replace(/ /g, "") : "")
  });
};
