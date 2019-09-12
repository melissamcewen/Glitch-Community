module.exports = function(app) {
  redirect(app, '/partners*', '/teams/');
  redirect(app, '/foryourapi*', '/teams/');
  redirect(app, '/forteams*', '/teams/');
  redirect(app, '/website-starter-kit*', '/culture/website-starter-kit/');
  redirect(app, '/react-starter-kit*', '/culture/react-starter-kit/');
  redirect(app, '/you-got-this/2*', '/culture/you-got-this-zine-2/');
  redirect(app, '/you-got-this*', '/culture/you-got-this-zine/');
  redirect(app, '/function*', '/culture/function/');
  redirect(app, '/revisionpath*', '/culture/revisionpath/');
  redirect(app, '/careers*', '/about/careers/');
  redirect(app, '/mythbustersjr*', '/culture/mythbusters-jr/');
  redirect(app, '/mythbusters*', '/culture/mythbusters-jr/');
  redirect(app, '/saastr', 'https://saastr.glitch.me/');
  redirect(app, '/vscode', 'https://marketplace.visualstudio.com/items?itemName=glitch.glitch');  
  redirect(app, '/support', 'https://support.glitch.com');
  redirectPath(app, '/featured*', '/culture/');
};

function redirect(app, route, target) {
  app.get(route, (req, res) => {
    return res.redirect(301, target);
  });
}

function redirectPath(app, route, target) {
  app.get(route, (req, res) => {
    return res.redirect(301, target + req.path.slice(route.length));
  });
}
