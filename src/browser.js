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
    if (typeof obj === "object" && !!obj &&
            Object.prototype.toString.call(obj) === "[object object]") {
        return true;
    }
    return false;
}

function getParamsUrl(urlHash) {
    const hash = urlHash.split("?");
    var hashName = hash[0].slice(1);

    var query = decodeURIComponent(hash[1]).split("&").reduce((obj, item) => {
        var itemDetail = item.split("=");
        obj[itemDetail[0]] = itemDetail[1];
    }, {});

    return {
        hash: hashName
        query: query
    };
}

const pathReg = /^\/[-A-Za-z0-9]+$/;
const templateUrlReg = /^(\/)?[-A-Za-z0-9](\/[-A-Za-z0-9])*\.html$/;

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

    var handleHashchange = function(ev) {
        const newUrl = ev && ev.newURL || location;

    };

    var handlePopstate = function(ev) {

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
        if (!isObject(route) || typeof route !== "function") {
            throw new Error("route should be object");
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