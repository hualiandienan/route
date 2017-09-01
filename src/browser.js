// some utils
var isObject(obj) {

}


function createRouter(userConfig) {
	const routes = {};
	const listeners = [];

	// get config
	var config = Object.assign({}, {
		html5mode: true,
		routes: {}

	}, userConfig);

	const historySupport = !!(window.history && window.history.pushState);
	var needHashbang = !historySupport || !config.html5mode;

	// register dom listener
	var domListenerCount = 0;
	var checkDomListener = function(detal) {
		domListenerCount += detal;

		if (domListenerCount === 1) {
			if (needHashbang) {
				window.addEventListener("hashchange", handleHashchange);
			} else {
				window.addEventListener("popstate", handlePopstate);
			}
		} else if (domListenerCount === 0) {
			if (needHashbang) {
				window.removeEventListener("hashchange", handleHashchange);
			} else {
				window.removeEventListener("popstate", handlePopstate);
			}
		}
	};

	var configure = function(options) {

	};

	var on = function(type) {

	};

	var setRoute = function(route) {
		if (!isObject(route)) {
			throw new Error("route is object");
		}


	}

	// register routes
	const registerRoutes = config.routes;
	if (registerRoutes && isObject(registerRoutes)) {
		for (var path in registerRoutes) {
			if (registerRoutes.hasOwnProperty(path)) {
				setRoute(registerRoutes.path);
			}
		}
	}

	return {
		on: on,
		route: setRoute
	};
}

export default createRouter;