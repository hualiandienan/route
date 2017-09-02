// some utils
function isObject(obj) {

}

function getParamsUrl() {
	var hash = location.hash;
	return {

	}
}

const pathReg = /^\/[-A-Za-z0-9]$/;

function createRouter(registerRoutes) {
	const routes = {};
	const listeners = [];

	const globalConfig = {
		html5mode: true
	};
	var needHashbang = false;

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

	// config router
	var configure = function(options = {}) {
		Object.assign(globalConfig, options);

		const historySupport = !!(window.history && window.history.pushState);
		needHashbang = !historySupport || !config.html5mode;

		// 未定义好配置接口
	};

	// add custom event listener
	var on = function(type) {

	};

	// register route
	var setRoute = function(path = "", route = {}) {
		if (!isObject(route)) {
			throw new Error("route should be object");
		}
		if (typeof path !== "string" && pathReg.test(path)) {
			throw new Error("invalid path");
		}

		// 接口检查
		// push进routes
	}

	// register routes
	var setRoutes = function(routes = {}) {
		if (routes && isObject(routes)) {
			for (var path in routes) {
				if (routes.hasOwnProperty(path)) {
					setRoute(path, routes[path]);
				}
			}
		}
	};
	
	return {
		on: on,
		route: setRoute,
		config: configure
	};
}

export default createRouter;