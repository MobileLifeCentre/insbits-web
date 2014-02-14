/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  var response = {
    title: 'tei',
    userId: (req.user? req.user.profile.name.replace(/ /g, "") : "")
  };

  if (req.query && req.query.mac) {
  	response.mac = req.query.mac;
  }

  res.render('tei', response);
};
