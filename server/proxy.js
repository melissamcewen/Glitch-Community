const proxy = require('express-http-proxy');
const urlJoin = require('url-join');
const { escapeRegExp } = require('lodash');
const { APP_URL } = require('./constants').current;

//
// Some glitch.com urls are served by other sites.
// This simple proxy lets us match them and send them along.
// If this file gets too big, it should be split into a separate app.
//

module.exports = function(app) {
  const routes = [];

  function proxyGlitch(route, target, pathOnTarget = '') {
    const routeWithLeadingSlash = urlJoin('/', route);
    const sandwichedRoute = urlJoin('/', route, '/');

    // node matches /{route} and /{route}/;
    // we need to force /{route}/ so that relative links in Ghost work.
    app.all(routeWithLeadingSlash, (req, res, next) => {
      const path = req.path;
      if (!path.toLowerCase().startsWith(sandwichedRoute.toLowerCase())) {
        //therefore, path is "/{route}[^/]"/i
        const rest = path.substring(sandwichedRoute.length);
        return res.redirect(301, sandwichedRoute + rest);
      }
      return next();
    });

    const proxyConfig = {
      preserveHostHdr: false, // glitch routes based on this, so we have to reset it
      https: true,
      proxyReqPathResolver: (req) => {
        return urlJoin('/', pathOnTarget, req.path);
      },
    };

    const genericProxy = proxy(target, proxyConfig);

    const sitemapProxy = proxy(target, {
      userResDecorator: (res, data) => {
        // do gross stuff to rewrite urls
        // this is dangerous to do on a full page, but the sitemap is simple
        const regexp = new RegExp(escapeRegExp(target), 'g');
        return data.toString().replace(regexp, new URL(APP_URL).hostname);
      },
      ...proxyConfig,
    });

    // Do the actual proxy
    app.use(routeWithLeadingSlash, (req, ...args) => {
      if (/\/sitemap.*(\.xml|\.xsl)$/.test(req.path)) {
        return sitemapProxy(req, ...args);
      }
      return genericProxy(req, ...args);
    });

    routes.push(routeWithLeadingSlash);
  }

  function proxyGhost(route, glitchTarget, pathOnTarget = '') {
    // Proxy all the requests to /{route}/ over to glitchTarget
    proxyGlitch(route, glitchTarget, urlJoin('/', pathOnTarget, route));
  }

  // Proxy the some parts of our site over to ghost blogs:
  proxyGhost('help', 'help-center.glitch.me');
  proxyGhost('culture', 'culture-zine.glitch.me');
  proxyGhost('about', 'about-glitch.glitch.me');
  proxyGhost('legal', 'about-glitch.glitch.me', '/about');

  // Pages hosted by 'about.glitch.me':
  ['faq', 'forplatforms', 'email-sales'].forEach((route) => proxyGlitch(route, 'about.glitch.me', route));

  proxyGlitch('teams', 'teams.glitch.me');

  // proxy projects, users, teams, collections sitemaps
  proxyGlitch('sitemaps', 'sitemaps.glitch.me');

  // proxy home CMS (without rewriting paths)
  app.use('/index/edit', proxy('community-home-editor.glitch.me'));
  

  // proxy home CMS (without rewriting paths)
  app.use('/pupdates/edit', proxy('pupdates-editor.glitch.me'));

  return routes;
};
