// some utils
function getTemplate(url) {
    var htmlPromise = new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();

        request.open("GET", url);
        request.setRequestHeader("Content-Type", "text/html;charset=UTF-8");

        let eventType = "onload" in request ? "onload" : "onreadystatechange";
        request[eventType] = function() {
            if (eventType === "onreadystatechange" && request.readyState !== 4) {
                return ;
            }

            if (request.status === 200 ) {
                resolve(request.responseText)
            } else {
                reject({staus:request.status, msg:request.statusText});
            }
        };

        request.send(null);
    });
    return htmlPromise;
}

function isObject(obj) {
    if (!!obj && Object.prototype.toString.call(obj).toLowerCase() === "[object object]") {
        return true;
    }
    return false;
}

function getParamsUrl(urlHash) {
    const hash = urlHash.split("?");
    var hashName = hash[0];

    var query = decodeURIComponent(hash[1]).split("&").reduce((obj, item) => {
        var itemDetail = item.split("=");
        obj[itemDetail[0]] = itemDetail[1];
    }, {});

    return {
        hash: hashName,
        query: query
    };
}

const pathReg = /^\/[-A-Za-z0-9]+$/;
const templateUrlReg = /^(\/)?[-A-Za-z0-9](\/[-A-Za-z0-9])*\.html$/;

function createRouter(registerRoutes) {
    // private variables
    const routes = {};
    const listeners = [];

    const _globalConfig = {
        html5mode: true
    };
    var _needHashbang = false;
    var _defaultPath = "";

    var _runStart = false;

    // register dom listener
    var domListenerCount = 0;
    var checkDomListener = function(detal) {
        domListenerCount += detal;

        if (domListenerCount === 1) {
            if (_needHashbang) {
                window.addEventListener("hashchange", handleHashchange);
            } else {
                window.addEventListener("popstate", handlePopstate);
            }
        } else if (domListenerCount === 0) {
            if (_needHashbang) {
                window.removeEventListener("hashchange", handleHashchange);
            } else {
                window.removeEventListener("popstate", handlePopstate);
            }
        }
    };

    var handleHashchange = function(ev) {
        var newUrl = ev && ev.newURL || location.hash;
        newUrl = newUrl.replace(/.*#/, "");

        let { hash } = getParamsUrl(newUrl);

        handleChange(hash);
    };

    var handlePopstate = function(ev) {
        var path = getPath();
        handleChange(path);
    };

    var handleChange = function(hash) {
        if (hash in routes) {
            let hashRoute = routes[hash];
            if (hashRoute.template) {
                getTemplate(hashRoute.template).then((data) => {
                    hashRoute.resolve(data);
                }, () => {
                    throw new Error("can't get template");
                });
            } else {
                hashRoute.resolve();
            }
        } else if (_defaultPath && _defaultPath in routes) {
            // 将路径更改到默认路径
            if (_needHashbang) {
                locatin.hash = "#/" + _defaultPath;
            } else {
                window.history.replaceState({}, null, _defaultPath);
            }
        } else {
            throw new Error("error default path.");
        }
    }

    var setPath = function(path) {
        if (!_needHashbang) {
            window.history.pushState({}, null, path);
            handlePopstate();
        } else {
            location.hash = path;
        }
    };
    var getPath = function() {
        var path = location.pathname;
        if (path.charAt(0) !== "/") {
            return "/" + path;
        }
        return path;
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

    // api
    // config router
    var configure = function(options = {}) {
        if (!_runStart) {
            Object.assign(_globalConfig, options);

            // checkDomListener(-1);

            const historySupport = !!(window.history && window.history.pushState);
            _needHashbang = !historySupport || !_globalConfig.html5mode;

            // 未定义好配置接口

            // checkDomListener(1);
        }

        return this;
    };

    // register route
    var setRoute = function(path = "", route = {}) {
        if (!isObject(route) && typeof route !== "function") {
            throw new Error("route should be object or function");
        }
        if (typeof path !== "string" && pathReg.test(path)) {
            throw new Error("invalid path");
        }

        // 接口检查
        let { template = "", js: jsFiles = [], resolve } = route;
        if (template && 
                typeof template === "string" && 
                templateUrlReg.test(template)) {
            throw new Error("invalid template url");
        }
        // 未确认是否将js作为接口，先不进行非法检测
        if (resolve && typeof resolve !== "function") {
            throw new Error("resolve should be function");
        }

        // 检查path是否已注册，若没有则push进routes
        if (!(path in routes)) {
            routes[path] = {
                template,
                jsFiles,
                resolve
            };
        }

        return this;
    }

    // set default route
    var otherwise = function(path) {
        if (typeof path === "string" && pathReg.test(path)) {
            _defaultPath = path;
        }
        return this;
    };

    // add custom event listener
    var on = function(type) {

    };

    // for html5
    var routeTo = function(path) {
        let url;

        if (_needHashbang) {
            url = document.hash ? document.hash.slice(1).split("/") : ["", ""];
        } else {
            url = getPath().split("/");
        }

        if (typeof path === "string") {
            if (path.charAt(0) === "/") {
                path = path.slice(1);
            }
            url[url.length - 1] = path;
        }

        setPath(url.join("/"));
    };

    var run = function() {
        if (!_runStart) {
            checkDomListener(1);

            if (_needHashbang) {
                
            } else {
                
            }
        }
        _runStart = true;

        return this;
    };

    // boot
    setRoutes(registerRoutes);
    
    return {
        on,
        when: setRoute,
        otherwise,
        config: configure,
        routeTo,
        run
    };
}

export default createRouter;