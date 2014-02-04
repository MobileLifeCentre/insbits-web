/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('rflea', {
    title: 'rFlea',
    userId: (req.user? req.user.profile.name.replace(/ /g, "") : "")
  });
};
