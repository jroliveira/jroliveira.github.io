//#region node_modules/workbox-core/_version.js
try {
	self["workbox:core:7.4.0"] && _();
} catch (e) {}
//#endregion
//#region node_modules/workbox-core/models/messages/messageGenerator.js
var fallback = (code, ...args) => {
	let msg = code;
	if (args.length > 0) msg += ` :: ${JSON.stringify(args)}`;
	return msg;
};
var messageGenerator = fallback;
//#endregion
//#region node_modules/workbox-core/_private/WorkboxError.js
/**
* Workbox errors should be thrown with this class.
* This allows use to ensure the type easily in tests,
* helps developers identify errors from workbox
* easily and allows use to optimise error
* messages correctly.
*
* @private
*/
var WorkboxError = class extends Error {
	/**
	*
	* @param {string} errorCode The error code that
	* identifies this particular error.
	* @param {Object=} details Any relevant arguments
	* that will help developers identify issues should
	* be added as a key on the context object.
	*/
	constructor(errorCode, details) {
		const message = messageGenerator(errorCode, details);
		super(message);
		this.name = errorCode;
		this.details = details;
	}
};
//#endregion
//#region node_modules/workbox-core/_private/cacheNames.js
var _cacheNameDetails = {
	googleAnalytics: "googleAnalytics",
	precache: "precache-v2",
	prefix: "workbox",
	runtime: "runtime",
	suffix: typeof registration !== "undefined" ? registration.scope : ""
};
var _createCacheName = (cacheName) => {
	return [
		_cacheNameDetails.prefix,
		cacheName,
		_cacheNameDetails.suffix
	].filter((value) => value && value.length > 0).join("-");
};
var eachCacheNameDetail = (fn) => {
	for (const key of Object.keys(_cacheNameDetails)) fn(key);
};
var cacheNames = {
	updateDetails: (details) => {
		eachCacheNameDetail((key) => {
			if (typeof details[key] === "string") _cacheNameDetails[key] = details[key];
		});
	},
	getGoogleAnalyticsName: (userCacheName) => {
		return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
	},
	getPrecacheName: (userCacheName) => {
		return userCacheName || _createCacheName(_cacheNameDetails.precache);
	},
	getPrefix: () => {
		return _cacheNameDetails.prefix;
	},
	getRuntimeName: (userCacheName) => {
		return userCacheName || _createCacheName(_cacheNameDetails.runtime);
	},
	getSuffix: () => {
		return _cacheNameDetails.suffix;
	}
};
//#endregion
//#region node_modules/workbox-core/_private/waitUntil.js
/**
* A utility method that makes it easier to use `event.waitUntil` with
* async functions and return the result.
*
* @param {ExtendableEvent} event
* @param {Function} asyncFn
* @return {Function}
* @private
*/
function waitUntil(event, asyncFn) {
	const returnPromise = asyncFn();
	event.waitUntil(returnPromise);
	return returnPromise;
}
//#endregion
//#region node_modules/workbox-precaching/_version.js
try {
	self["workbox:precaching:7.4.0"] && _();
} catch (e) {}
//#endregion
//#region node_modules/workbox-precaching/utils/createCacheKey.js
var REVISION_SEARCH_PARAM = "__WB_REVISION__";
/**
* Converts a manifest entry into a versioned URL suitable for precaching.
*
* @param {Object|string} entry
* @return {string} A URL with versioning info.
*
* @private
* @memberof workbox-precaching
*/
function createCacheKey(entry) {
	if (!entry) throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
	if (typeof entry === "string") {
		const urlObject = new URL(entry, location.href);
		return {
			cacheKey: urlObject.href,
			url: urlObject.href
		};
	}
	const { revision, url } = entry;
	if (!url) throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
	if (!revision) {
		const urlObject = new URL(url, location.href);
		return {
			cacheKey: urlObject.href,
			url: urlObject.href
		};
	}
	const cacheKeyURL = new URL(url, location.href);
	const originalURL = new URL(url, location.href);
	cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
	return {
		cacheKey: cacheKeyURL.href,
		url: originalURL.href
	};
}
//#endregion
//#region node_modules/workbox-precaching/utils/PrecacheInstallReportPlugin.js
/**
* A plugin, designed to be used with PrecacheController, to determine the
* of assets that were updated (or not updated) during the install event.
*
* @private
*/
var PrecacheInstallReportPlugin = class {
	constructor() {
		this.updatedURLs = [];
		this.notUpdatedURLs = [];
		this.handlerWillStart = async ({ request, state }) => {
			if (state) state.originalRequest = request;
		};
		this.cachedResponseWillBeUsed = async ({ event, state, cachedResponse }) => {
			if (event.type === "install") {
				if (state && state.originalRequest && state.originalRequest instanceof Request) {
					const url = state.originalRequest.url;
					if (cachedResponse) this.notUpdatedURLs.push(url);
					else this.updatedURLs.push(url);
				}
			}
			return cachedResponse;
		};
	}
};
//#endregion
//#region node_modules/workbox-precaching/utils/PrecacheCacheKeyPlugin.js
/**
* A plugin, designed to be used with PrecacheController, to translate URLs into
* the corresponding cache key, based on the current revision info.
*
* @private
*/
var PrecacheCacheKeyPlugin = class {
	constructor({ precacheController }) {
		this.cacheKeyWillBeUsed = async ({ request, params }) => {
			const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || this._precacheController.getCacheKeyForURL(request.url);
			return cacheKey ? new Request(cacheKey, { headers: request.headers }) : request;
		};
		this._precacheController = precacheController;
	}
};
//#endregion
//#region node_modules/workbox-core/_private/canConstructResponseFromBodyStream.js
var supportStatus;
/**
* A utility function that determines whether the current browser supports
* constructing a new `Response` from a `response.body` stream.
*
* @return {boolean} `true`, if the current browser can successfully
*     construct a `Response` from a `response.body` stream, `false` otherwise.
*
* @private
*/
function canConstructResponseFromBodyStream() {
	if (supportStatus === void 0) {
		const testResponse = new Response("");
		if ("body" in testResponse) try {
			new Response(testResponse.body);
			supportStatus = true;
		} catch (error) {
			supportStatus = false;
		}
		supportStatus = false;
	}
	return supportStatus;
}
//#endregion
//#region node_modules/workbox-core/copyResponse.js
/**
* Allows developers to copy a response and modify its `headers`, `status`,
* or `statusText` values (the values settable via a
* [`ResponseInit`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax}
* object in the constructor).
* To modify these values, pass a function as the second argument. That
* function will be invoked with a single object with the response properties
* `{headers, status, statusText}`. The return value of this function will
* be used as the `ResponseInit` for the new `Response`. To change the values
* either modify the passed parameter(s) and return it, or return a totally
* new object.
*
* This method is intentionally limited to same-origin responses, regardless of
* whether CORS was used or not.
*
* @param {Response} response
* @param {Function} modifier
* @memberof workbox-core
*/
async function copyResponse(response, modifier) {
	let origin = null;
	if (response.url) origin = new URL(response.url).origin;
	if (origin !== self.location.origin) throw new WorkboxError("cross-origin-copy-response", { origin });
	const clonedResponse = response.clone();
	const responseInit = {
		headers: new Headers(clonedResponse.headers),
		status: clonedResponse.status,
		statusText: clonedResponse.statusText
	};
	const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
	const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
	return new Response(body, modifiedResponseInit);
}
//#endregion
//#region node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL = (url) => {
	return new URL(String(url), location.href).href.replace(new RegExp(`^${location.origin}`), "");
};
//#endregion
//#region node_modules/workbox-core/_private/cacheMatchIgnoreParams.js
function stripParams(fullURL, ignoreParams) {
	const strippedURL = new URL(fullURL);
	for (const param of ignoreParams) strippedURL.searchParams.delete(param);
	return strippedURL.href;
}
/**
* Matches an item in the cache, ignoring specific URL params. This is similar
* to the `ignoreSearch` option, but it allows you to ignore just specific
* params (while continuing to match on the others).
*
* @private
* @param {Cache} cache
* @param {Request} request
* @param {Object} matchOptions
* @param {Array<string>} ignoreParams
* @return {Promise<Response|undefined>}
*/
async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
	const strippedRequestURL = stripParams(request.url, ignoreParams);
	if (request.url === strippedRequestURL) return cache.match(request, matchOptions);
	const keysOptions = Object.assign(Object.assign({}, matchOptions), { ignoreSearch: true });
	const cacheKeys = await cache.keys(request, keysOptions);
	for (const cacheKey of cacheKeys) if (strippedRequestURL === stripParams(cacheKey.url, ignoreParams)) return cache.match(cacheKey, matchOptions);
}
//#endregion
//#region node_modules/workbox-core/_private/Deferred.js
/**
* The Deferred class composes Promises in a way that allows for them to be
* resolved or rejected from outside the constructor. In most cases promises
* should be used directly, but Deferreds can be necessary when the logic to
* resolve a promise must be separate.
*
* @private
*/
var Deferred = class {
	/**
	* Creates a promise and exposes its resolve and reject functions as methods.
	*/
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
};
//#endregion
//#region node_modules/workbox-core/models/quotaErrorCallbacks.js
var quotaErrorCallbacks = /* @__PURE__ */ new Set();
//#endregion
//#region node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js
/**
* Runs all of the callback functions, one at a time sequentially, in the order
* in which they were registered.
*
* @memberof workbox-core
* @private
*/
async function executeQuotaErrorCallbacks() {
	for (const callback of quotaErrorCallbacks) await callback();
}
//#endregion
//#region node_modules/workbox-core/_private/timeout.js
/**
* Returns a promise that resolves and the passed number of milliseconds.
* This utility is an async/await-friendly version of `setTimeout`.
*
* @param {number} ms
* @return {Promise}
* @private
*/
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
//#endregion
//#region node_modules/workbox-strategies/_version.js
try {
	self["workbox:strategies:7.4.0"] && _();
} catch (e) {}
//#endregion
//#region node_modules/workbox-strategies/StrategyHandler.js
function toRequest(input) {
	return typeof input === "string" ? new Request(input) : input;
}
/**
* A class created every time a Strategy instance calls
* {@link workbox-strategies.Strategy~handle} or
* {@link workbox-strategies.Strategy~handleAll} that wraps all fetch and
* cache actions around plugin callbacks and keeps track of when the strategy
* is "done" (i.e. all added `event.waitUntil()` promises have resolved).
*
* @memberof workbox-strategies
*/
var StrategyHandler = class {
	/**
	* Creates a new instance associated with the passed strategy and event
	* that's handling the request.
	*
	* The constructor also initializes the state that will be passed to each of
	* the plugins handling this request.
	*
	* @param {workbox-strategies.Strategy} strategy
	* @param {Object} options
	* @param {Request|string} options.request A request to run this strategy for.
	* @param {ExtendableEvent} options.event The event associated with the
	*     request.
	* @param {URL} [options.url]
	* @param {*} [options.params] The return value from the
	*     {@link workbox-routing~matchCallback} (if applicable).
	*/
	constructor(strategy, options) {
		this._cacheKeys = {};
		Object.assign(this, options);
		this.event = options.event;
		this._strategy = strategy;
		this._handlerDeferred = new Deferred();
		this._extendLifetimePromises = [];
		this._plugins = [...strategy.plugins];
		this._pluginStateMap = /* @__PURE__ */ new Map();
		for (const plugin of this._plugins) this._pluginStateMap.set(plugin, {});
		this.event.waitUntil(this._handlerDeferred.promise);
	}
	/**
	* Fetches a given request (and invokes any applicable plugin callback
	* methods) using the `fetchOptions` (for non-navigation requests) and
	* `plugins` defined on the `Strategy` object.
	*
	* The following plugin lifecycle methods are invoked when using this method:
	* - `requestWillFetch()`
	* - `fetchDidSucceed()`
	* - `fetchDidFail()`
	*
	* @param {Request|string} input The URL or request to fetch.
	* @return {Promise<Response>}
	*/
	async fetch(input) {
		const { event } = this;
		let request = toRequest(input);
		if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
			const possiblePreloadResponse = await event.preloadResponse;
			if (possiblePreloadResponse) return possiblePreloadResponse;
		}
		const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
		try {
			for (const cb of this.iterateCallbacks("requestWillFetch")) request = await cb({
				request: request.clone(),
				event
			});
		} catch (err) {
			if (err instanceof Error) throw new WorkboxError("plugin-error-request-will-fetch", { thrownErrorMessage: err.message });
		}
		const pluginFilteredRequest = request.clone();
		try {
			let fetchResponse;
			fetchResponse = await fetch(request, request.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
			for (const callback of this.iterateCallbacks("fetchDidSucceed")) fetchResponse = await callback({
				event,
				request: pluginFilteredRequest,
				response: fetchResponse
			});
			return fetchResponse;
		} catch (error) {
			if (originalRequest) await this.runCallbacks("fetchDidFail", {
				error,
				event,
				originalRequest: originalRequest.clone(),
				request: pluginFilteredRequest.clone()
			});
			throw error;
		}
	}
	/**
	* Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
	* the response generated by `this.fetch()`.
	*
	* The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
	* so you do not have to manually call `waitUntil()` on the event.
	*
	* @param {Request|string} input The request or URL to fetch and cache.
	* @return {Promise<Response>}
	*/
	async fetchAndCachePut(input) {
		const response = await this.fetch(input);
		const responseClone = response.clone();
		this.waitUntil(this.cachePut(input, responseClone));
		return response;
	}
	/**
	* Matches a request from the cache (and invokes any applicable plugin
	* callback methods) using the `cacheName`, `matchOptions`, and `plugins`
	* defined on the strategy object.
	*
	* The following plugin lifecycle methods are invoked when using this method:
	* - cacheKeyWillBeUsed()
	* - cachedResponseWillBeUsed()
	*
	* @param {Request|string} key The Request or URL to use as the cache key.
	* @return {Promise<Response|undefined>} A matching response, if found.
	*/
	async cacheMatch(key) {
		const request = toRequest(key);
		let cachedResponse;
		const { cacheName, matchOptions } = this._strategy;
		const effectiveRequest = await this.getCacheKey(request, "read");
		const multiMatchOptions = Object.assign(Object.assign({}, matchOptions), { cacheName });
		cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
		for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed")) cachedResponse = await callback({
			cacheName,
			matchOptions,
			cachedResponse,
			request: effectiveRequest,
			event: this.event
		}) || void 0;
		return cachedResponse;
	}
	/**
	* Puts a request/response pair in the cache (and invokes any applicable
	* plugin callback methods) using the `cacheName` and `plugins` defined on
	* the strategy object.
	*
	* The following plugin lifecycle methods are invoked when using this method:
	* - cacheKeyWillBeUsed()
	* - cacheWillUpdate()
	* - cacheDidUpdate()
	*
	* @param {Request|string} key The request or URL to use as the cache key.
	* @param {Response} response The response to cache.
	* @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
	* not be cached, and `true` otherwise.
	*/
	async cachePut(key, response) {
		const request = toRequest(key);
		await timeout(0);
		const effectiveRequest = await this.getCacheKey(request, "write");
		if (!response) throw new WorkboxError("cache-put-with-no-response", { url: getFriendlyURL(effectiveRequest.url) });
		const responseToCache = await this._ensureResponseSafeToCache(response);
		if (!responseToCache) return false;
		const { cacheName, matchOptions } = this._strategy;
		const cache = await self.caches.open(cacheName);
		const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
		const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(cache, effectiveRequest.clone(), ["__WB_REVISION__"], matchOptions) : null;
		try {
			await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
		} catch (error) {
			if (error instanceof Error) {
				if (error.name === "QuotaExceededError") await executeQuotaErrorCallbacks();
				throw error;
			}
		}
		for (const callback of this.iterateCallbacks("cacheDidUpdate")) await callback({
			cacheName,
			oldResponse,
			newResponse: responseToCache.clone(),
			request: effectiveRequest,
			event: this.event
		});
		return true;
	}
	/**
	* Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
	* executes any of those callbacks found in sequence. The final `Request`
	* object returned by the last plugin is treated as the cache key for cache
	* reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
	* been registered, the passed request is returned unmodified
	*
	* @param {Request} request
	* @param {string} mode
	* @return {Promise<Request>}
	*/
	async getCacheKey(request, mode) {
		const key = `${request.url} | ${mode}`;
		if (!this._cacheKeys[key]) {
			let effectiveRequest = request;
			for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) effectiveRequest = toRequest(await callback({
				mode,
				request: effectiveRequest,
				event: this.event,
				params: this.params
			}));
			this._cacheKeys[key] = effectiveRequest;
		}
		return this._cacheKeys[key];
	}
	/**
	* Returns true if the strategy has at least one plugin with the given
	* callback.
	*
	* @param {string} name The name of the callback to check for.
	* @return {boolean}
	*/
	hasCallback(name) {
		for (const plugin of this._strategy.plugins) if (name in plugin) return true;
		return false;
	}
	/**
	* Runs all plugin callbacks matching the given name, in order, passing the
	* given param object (merged ith the current plugin state) as the only
	* argument.
	*
	* Note: since this method runs all plugins, it's not suitable for cases
	* where the return value of a callback needs to be applied prior to calling
	* the next callback. See
	* {@link workbox-strategies.StrategyHandler#iterateCallbacks}
	* below for how to handle that case.
	*
	* @param {string} name The name of the callback to run within each plugin.
	* @param {Object} param The object to pass as the first (and only) param
	*     when executing each callback. This object will be merged with the
	*     current plugin state prior to callback execution.
	*/
	async runCallbacks(name, param) {
		for (const callback of this.iterateCallbacks(name)) await callback(param);
	}
	/**
	* Accepts a callback and returns an iterable of matching plugin callbacks,
	* where each callback is wrapped with the current handler state (i.e. when
	* you call each callback, whatever object parameter you pass it will
	* be merged with the plugin's current state).
	*
	* @param {string} name The name fo the callback to run
	* @return {Array<Function>}
	*/
	*iterateCallbacks(name) {
		for (const plugin of this._strategy.plugins) if (typeof plugin[name] === "function") {
			const state = this._pluginStateMap.get(plugin);
			const statefulCallback = (param) => {
				const statefulParam = Object.assign(Object.assign({}, param), { state });
				return plugin[name](statefulParam);
			};
			yield statefulCallback;
		}
	}
	/**
	* Adds a promise to the
	* [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
	* of the event associated with the request being handled (usually a
	* `FetchEvent`).
	*
	* Note: you can await
	* {@link workbox-strategies.StrategyHandler~doneWaiting}
	* to know when all added promises have settled.
	*
	* @param {Promise} promise A promise to add to the extend lifetime promises
	*     of the event that triggered the request.
	*/
	waitUntil(promise) {
		this._extendLifetimePromises.push(promise);
		return promise;
	}
	/**
	* Returns a promise that resolves once all promises passed to
	* {@link workbox-strategies.StrategyHandler~waitUntil}
	* have settled.
	*
	* Note: any work done after `doneWaiting()` settles should be manually
	* passed to an event's `waitUntil()` method (not this handler's
	* `waitUntil()` method), otherwise the service worker thread may be killed
	* prior to your work completing.
	*/
	async doneWaiting() {
		while (this._extendLifetimePromises.length) {
			const promises = this._extendLifetimePromises.splice(0);
			const firstRejection = (await Promise.allSettled(promises)).find((i) => i.status === "rejected");
			if (firstRejection) throw firstRejection.reason;
		}
	}
	/**
	* Stops running the strategy and immediately resolves any pending
	* `waitUntil()` promises.
	*/
	destroy() {
		this._handlerDeferred.resolve(null);
	}
	/**
	* This method will call cacheWillUpdate on the available plugins (or use
	* status === 200) to determine if the Response is safe and valid to cache.
	*
	* @param {Request} options.request
	* @param {Response} options.response
	* @return {Promise<Response|undefined>}
	*
	* @private
	*/
	async _ensureResponseSafeToCache(response) {
		let responseToCache = response;
		let pluginsUsed = false;
		for (const callback of this.iterateCallbacks("cacheWillUpdate")) {
			responseToCache = await callback({
				request: this.request,
				response: responseToCache,
				event: this.event
			}) || void 0;
			pluginsUsed = true;
			if (!responseToCache) break;
		}
		if (!pluginsUsed) {
			if (responseToCache && responseToCache.status !== 200) responseToCache = void 0;
		}
		return responseToCache;
	}
};
//#endregion
//#region node_modules/workbox-strategies/Strategy.js
/**
* An abstract base class that all other strategy classes must extend from:
*
* @memberof workbox-strategies
*/
var Strategy = class {
	/**
	* Creates a new instance of the strategy and sets all documented option
	* properties as public instance properties.
	*
	* Note: if a custom strategy class extends the base Strategy class and does
	* not need more than these properties, it does not need to define its own
	* constructor.
	*
	* @param {Object} [options]
	* @param {string} [options.cacheName] Cache name to store and retrieve
	* requests. Defaults to the cache names provided by
	* {@link workbox-core.cacheNames}.
	* @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
	* to use in conjunction with this caching strategy.
	* @param {Object} [options.fetchOptions] Values passed along to the
	* [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
	* of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
	* `fetch()` requests made by this strategy.
	* @param {Object} [options.matchOptions] The
	* [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
	* for any `cache.match()` or `cache.put()` calls made by this strategy.
	*/
	constructor(options = {}) {
		/**
		* Cache name to store and retrieve
		* requests. Defaults to the cache names provided by
		* {@link workbox-core.cacheNames}.
		*
		* @type {string}
		*/
		this.cacheName = cacheNames.getRuntimeName(options.cacheName);
		/**
		* The list
		* [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
		* used by this strategy.
		*
		* @type {Array<Object>}
		*/
		this.plugins = options.plugins || [];
		/**
		* Values passed along to the
		* [`init`]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters}
		* of all fetch() requests made by this strategy.
		*
		* @type {Object}
		*/
		this.fetchOptions = options.fetchOptions;
		/**
		* The
		* [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
		* for any `cache.match()` or `cache.put()` calls made by this strategy.
		*
		* @type {Object}
		*/
		this.matchOptions = options.matchOptions;
	}
	/**
	* Perform a request strategy and returns a `Promise` that will resolve with
	* a `Response`, invoking all relevant plugin callbacks.
	*
	* When a strategy instance is registered with a Workbox
	* {@link workbox-routing.Route}, this method is automatically
	* called when the route matches.
	*
	* Alternatively, this method can be used in a standalone `FetchEvent`
	* listener by passing it to `event.respondWith()`.
	*
	* @param {FetchEvent|Object} options A `FetchEvent` or an object with the
	*     properties listed below.
	* @param {Request|string} options.request A request to run this strategy for.
	* @param {ExtendableEvent} options.event The event associated with the
	*     request.
	* @param {URL} [options.url]
	* @param {*} [options.params]
	*/
	handle(options) {
		const [responseDone] = this.handleAll(options);
		return responseDone;
	}
	/**
	* Similar to {@link workbox-strategies.Strategy~handle}, but
	* instead of just returning a `Promise` that resolves to a `Response` it
	* it will return an tuple of `[response, done]` promises, where the former
	* (`response`) is equivalent to what `handle()` returns, and the latter is a
	* Promise that will resolve once any promises that were added to
	* `event.waitUntil()` as part of performing the strategy have completed.
	*
	* You can await the `done` promise to ensure any extra work performed by
	* the strategy (usually caching responses) completes successfully.
	*
	* @param {FetchEvent|Object} options A `FetchEvent` or an object with the
	*     properties listed below.
	* @param {Request|string} options.request A request to run this strategy for.
	* @param {ExtendableEvent} options.event The event associated with the
	*     request.
	* @param {URL} [options.url]
	* @param {*} [options.params]
	* @return {Array<Promise>} A tuple of [response, done]
	*     promises that can be used to determine when the response resolves as
	*     well as when the handler has completed all its work.
	*/
	handleAll(options) {
		if (options instanceof FetchEvent) options = {
			event: options,
			request: options.request
		};
		const event = options.event;
		const request = typeof options.request === "string" ? new Request(options.request) : options.request;
		const params = "params" in options ? options.params : void 0;
		const handler = new StrategyHandler(this, {
			event,
			request,
			params
		});
		const responseDone = this._getResponse(handler, request, event);
		return [responseDone, this._awaitComplete(responseDone, handler, request, event)];
	}
	async _getResponse(handler, request, event) {
		await handler.runCallbacks("handlerWillStart", {
			event,
			request
		});
		let response = void 0;
		try {
			response = await this._handle(request, handler);
			if (!response || response.type === "error") throw new WorkboxError("no-response", { url: request.url });
		} catch (error) {
			if (error instanceof Error) for (const callback of handler.iterateCallbacks("handlerDidError")) {
				response = await callback({
					error,
					event,
					request
				});
				if (response) break;
			}
			if (!response) throw error;
		}
		for (const callback of handler.iterateCallbacks("handlerWillRespond")) response = await callback({
			event,
			request,
			response
		});
		return response;
	}
	async _awaitComplete(responseDone, handler, request, event) {
		let response;
		let error;
		try {
			response = await responseDone;
		} catch (error) {}
		try {
			await handler.runCallbacks("handlerDidRespond", {
				event,
				request,
				response
			});
			await handler.doneWaiting();
		} catch (waitUntilError) {
			if (waitUntilError instanceof Error) error = waitUntilError;
		}
		await handler.runCallbacks("handlerDidComplete", {
			event,
			request,
			response,
			error
		});
		handler.destroy();
		if (error) throw error;
	}
};
/**
* Classes extending the `Strategy` based class should implement this method,
* and leverage the {@link workbox-strategies.StrategyHandler}
* arg to perform all fetching and cache logic, which will ensure all relevant
* cache, cache options, fetch options and plugins are used (per the current
* strategy instance).
*
* @name _handle
* @instance
* @abstract
* @function
* @param {Request} request
* @param {workbox-strategies.StrategyHandler} handler
* @return {Promise<Response>}
*
* @memberof workbox-strategies.Strategy
*/
//#endregion
//#region node_modules/workbox-precaching/PrecacheStrategy.js
/**
* A {@link workbox-strategies.Strategy} implementation
* specifically designed to work with
* {@link workbox-precaching.PrecacheController}
* to both cache and fetch precached assets.
*
* Note: an instance of this class is created automatically when creating a
* `PrecacheController`; it's generally not necessary to create this yourself.
*
* @extends workbox-strategies.Strategy
* @memberof workbox-precaching
*/
var PrecacheStrategy = class PrecacheStrategy extends Strategy {
	/**
	*
	* @param {Object} [options]
	* @param {string} [options.cacheName] Cache name to store and retrieve
	* requests. Defaults to the cache names provided by
	* {@link workbox-core.cacheNames}.
	* @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
	* to use in conjunction with this caching strategy.
	* @param {Object} [options.fetchOptions] Values passed along to the
	* {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
	* of all fetch() requests made by this strategy.
	* @param {Object} [options.matchOptions] The
	* {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
	* for any `cache.match()` or `cache.put()` calls made by this strategy.
	* @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
	* get the response from the network if there's a precache miss.
	*/
	constructor(options = {}) {
		options.cacheName = cacheNames.getPrecacheName(options.cacheName);
		super(options);
		this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
		this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
	}
	/**
	* @private
	* @param {Request|string} request A request to run this strategy for.
	* @param {workbox-strategies.StrategyHandler} handler The event that
	*     triggered the request.
	* @return {Promise<Response>}
	*/
	async _handle(request, handler) {
		const response = await handler.cacheMatch(request);
		if (response) return response;
		if (handler.event && handler.event.type === "install") return await this._handleInstall(request, handler);
		return await this._handleFetch(request, handler);
	}
	async _handleFetch(request, handler) {
		let response;
		const params = handler.params || {};
		if (this._fallbackToNetwork) {
			const integrityInManifest = params.integrity;
			const integrityInRequest = request.integrity;
			const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;
			response = await handler.fetch(new Request(request, { integrity: request.mode !== "no-cors" ? integrityInRequest || integrityInManifest : void 0 }));
			if (integrityInManifest && noIntegrityConflict && request.mode !== "no-cors") {
				this._useDefaultCacheabilityPluginIfNeeded();
				await handler.cachePut(request, response.clone());
			}
		} else throw new WorkboxError("missing-precache-entry", {
			cacheName: this.cacheName,
			url: request.url
		});
		return response;
	}
	async _handleInstall(request, handler) {
		this._useDefaultCacheabilityPluginIfNeeded();
		const response = await handler.fetch(request);
		if (!await handler.cachePut(request, response.clone())) throw new WorkboxError("bad-precaching-response", {
			url: request.url,
			status: response.status
		});
		return response;
	}
	/**
	* This method is complex, as there a number of things to account for:
	*
	* The `plugins` array can be set at construction, and/or it might be added to
	* to at any time before the strategy is used.
	*
	* At the time the strategy is used (i.e. during an `install` event), there
	* needs to be at least one plugin that implements `cacheWillUpdate` in the
	* array, other than `copyRedirectedCacheableResponsesPlugin`.
	*
	* - If this method is called and there are no suitable `cacheWillUpdate`
	* plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
	*
	* - If this method is called and there is exactly one `cacheWillUpdate`, then
	* we don't have to do anything (this might be a previously added
	* `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
	*
	* - If this method is called and there is more than one `cacheWillUpdate`,
	* then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
	* we need to remove it. (This situation is unlikely, but it could happen if
	* the strategy is used multiple times, the first without a `cacheWillUpdate`,
	* and then later on after manually adding a custom `cacheWillUpdate`.)
	*
	* See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
	*
	* @private
	*/
	_useDefaultCacheabilityPluginIfNeeded() {
		let defaultPluginIndex = null;
		let cacheWillUpdatePluginCount = 0;
		for (const [index, plugin] of this.plugins.entries()) {
			if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) continue;
			if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) defaultPluginIndex = index;
			if (plugin.cacheWillUpdate) cacheWillUpdatePluginCount++;
		}
		if (cacheWillUpdatePluginCount === 0) this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
		else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) this.plugins.splice(defaultPluginIndex, 1);
	}
};
PrecacheStrategy.defaultPrecacheCacheabilityPlugin = { async cacheWillUpdate({ response }) {
	if (!response || response.status >= 400) return null;
	return response;
} };
PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = { async cacheWillUpdate({ response }) {
	return response.redirected ? await copyResponse(response) : response;
} };
//#endregion
//#region node_modules/workbox-precaching/PrecacheController.js
/**
* Performs efficient precaching of assets.
*
* @memberof workbox-precaching
*/
var PrecacheController = class {
	/**
	* Create a new PrecacheController.
	*
	* @param {Object} [options]
	* @param {string} [options.cacheName] The cache to use for precaching.
	* @param {string} [options.plugins] Plugins to use when precaching as well
	* as responding to fetch events for precached assets.
	* @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
	* get the response from the network if there's a precache miss.
	*/
	constructor({ cacheName, plugins = [], fallbackToNetwork = true } = {}) {
		this._urlsToCacheKeys = /* @__PURE__ */ new Map();
		this._urlsToCacheModes = /* @__PURE__ */ new Map();
		this._cacheKeysToIntegrities = /* @__PURE__ */ new Map();
		this._strategy = new PrecacheStrategy({
			cacheName: cacheNames.getPrecacheName(cacheName),
			plugins: [...plugins, new PrecacheCacheKeyPlugin({ precacheController: this })],
			fallbackToNetwork
		});
		this.install = this.install.bind(this);
		this.activate = this.activate.bind(this);
	}
	/**
	* @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
	* used to cache assets and respond to fetch events.
	*/
	get strategy() {
		return this._strategy;
	}
	/**
	* Adds items to the precache list, removing any duplicates and
	* stores the files in the
	* {@link workbox-core.cacheNames|"precache cache"} when the service
	* worker installs.
	*
	* This method can be called multiple times.
	*
	* @param {Array<Object|string>} [entries=[]] Array of entries to precache.
	*/
	precache(entries) {
		this.addToCacheList(entries);
		if (!this._installAndActiveListenersAdded) {
			self.addEventListener("install", this.install);
			self.addEventListener("activate", this.activate);
			this._installAndActiveListenersAdded = true;
		}
	}
	/**
	* This method will add items to the precache list, removing duplicates
	* and ensuring the information is valid.
	*
	* @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
	*     Array of entries to precache.
	*/
	addToCacheList(entries) {
		const urlsToWarnAbout = [];
		for (const entry of entries) {
			if (typeof entry === "string") urlsToWarnAbout.push(entry);
			else if (entry && entry.revision === void 0) urlsToWarnAbout.push(entry.url);
			const { cacheKey, url } = createCacheKey(entry);
			const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
			if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) throw new WorkboxError("add-to-cache-list-conflicting-entries", {
				firstEntry: this._urlsToCacheKeys.get(url),
				secondEntry: cacheKey
			});
			if (typeof entry !== "string" && entry.integrity) {
				if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) throw new WorkboxError("add-to-cache-list-conflicting-integrities", { url });
				this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
			}
			this._urlsToCacheKeys.set(url, cacheKey);
			this._urlsToCacheModes.set(url, cacheMode);
			if (urlsToWarnAbout.length > 0) {
				const warningMessage = `Workbox is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
				console.warn(warningMessage);
			}
		}
	}
	/**
	* Precaches new and updated assets. Call this method from the service worker
	* install event.
	*
	* Note: this method calls `event.waitUntil()` for you, so you do not need
	* to call it yourself in your event handlers.
	*
	* @param {ExtendableEvent} event
	* @return {Promise<workbox-precaching.InstallResult>}
	*/
	install(event) {
		return waitUntil(event, async () => {
			const installReportPlugin = new PrecacheInstallReportPlugin();
			this.strategy.plugins.push(installReportPlugin);
			for (const [url, cacheKey] of this._urlsToCacheKeys) {
				const integrity = this._cacheKeysToIntegrities.get(cacheKey);
				const cacheMode = this._urlsToCacheModes.get(url);
				const request = new Request(url, {
					integrity,
					cache: cacheMode,
					credentials: "same-origin"
				});
				await Promise.all(this.strategy.handleAll({
					params: { cacheKey },
					request,
					event
				}));
			}
			const { updatedURLs, notUpdatedURLs } = installReportPlugin;
			return {
				updatedURLs,
				notUpdatedURLs
			};
		});
	}
	/**
	* Deletes assets that are no longer present in the current precache manifest.
	* Call this method from the service worker activate event.
	*
	* Note: this method calls `event.waitUntil()` for you, so you do not need
	* to call it yourself in your event handlers.
	*
	* @param {ExtendableEvent} event
	* @return {Promise<workbox-precaching.CleanupResult>}
	*/
	activate(event) {
		return waitUntil(event, async () => {
			const cache = await self.caches.open(this.strategy.cacheName);
			const currentlyCachedRequests = await cache.keys();
			const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
			const deletedURLs = [];
			for (const request of currentlyCachedRequests) if (!expectedCacheKeys.has(request.url)) {
				await cache.delete(request);
				deletedURLs.push(request.url);
			}
			return { deletedURLs };
		});
	}
	/**
	* Returns a mapping of a precached URL to the corresponding cache key, taking
	* into account the revision information for the URL.
	*
	* @return {Map<string, string>} A URL to cache key mapping.
	*/
	getURLsToCacheKeys() {
		return this._urlsToCacheKeys;
	}
	/**
	* Returns a list of all the URLs that have been precached by the current
	* service worker.
	*
	* @return {Array<string>} The precached URLs.
	*/
	getCachedURLs() {
		return [...this._urlsToCacheKeys.keys()];
	}
	/**
	* Returns the cache key used for storing a given URL. If that URL is
	* unversioned, like `/index.html', then the cache key will be the original
	* URL with a search parameter appended to it.
	*
	* @param {string} url A URL whose cache key you want to look up.
	* @return {string} The versioned URL that corresponds to a cache key
	* for the original URL, or undefined if that URL isn't precached.
	*/
	getCacheKeyForURL(url) {
		const urlObject = new URL(url, location.href);
		return this._urlsToCacheKeys.get(urlObject.href);
	}
	/**
	* @param {string} url A cache key whose SRI you want to look up.
	* @return {string} The subresource integrity associated with the cache key,
	* or undefined if it's not set.
	*/
	getIntegrityForCacheKey(cacheKey) {
		return this._cacheKeysToIntegrities.get(cacheKey);
	}
	/**
	* This acts as a drop-in replacement for
	* [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
	* with the following differences:
	*
	* - It knows what the name of the precache is, and only checks in that cache.
	* - It allows you to pass in an "original" URL without versioning parameters,
	* and it will automatically look up the correct cache key for the currently
	* active revision of that URL.
	*
	* E.g., `matchPrecache('index.html')` will find the correct precached
	* response for the currently active service worker, even if the actual cache
	* key is `'/index.html?__WB_REVISION__=1234abcd'`.
	*
	* @param {string|Request} request The key (without revisioning parameters)
	* to look up in the precache.
	* @return {Promise<Response|undefined>}
	*/
	async matchPrecache(request) {
		const url = request instanceof Request ? request.url : request;
		const cacheKey = this.getCacheKeyForURL(url);
		if (cacheKey) return (await self.caches.open(this.strategy.cacheName)).match(cacheKey);
	}
	/**
	* Returns a function that looks up `url` in the precache (taking into
	* account revision information), and returns the corresponding `Response`.
	*
	* @param {string} url The precached URL which will be used to lookup the
	* `Response`.
	* @return {workbox-routing~handlerCallback}
	*/
	createHandlerBoundToURL(url) {
		const cacheKey = this.getCacheKeyForURL(url);
		if (!cacheKey) throw new WorkboxError("non-precached-url", { url });
		return (options) => {
			options.request = new Request(url);
			options.params = Object.assign({ cacheKey }, options.params);
			return this.strategy.handle(options);
		};
	}
};
//#endregion
//#region node_modules/workbox-precaching/utils/getOrCreatePrecacheController.js
var precacheController;
/**
* @return {PrecacheController}
* @private
*/
var getOrCreatePrecacheController = () => {
	if (!precacheController) precacheController = new PrecacheController();
	return precacheController;
};
//#endregion
//#region node_modules/workbox-routing/_version.js
try {
	self["workbox:routing:7.4.0"] && _();
} catch (e) {}
//#endregion
//#region node_modules/workbox-routing/utils/normalizeHandler.js
/**
* @param {function()|Object} handler Either a function, or an object with a
* 'handle' method.
* @return {Object} An object with a handle method.
*
* @private
*/
var normalizeHandler = (handler) => {
	if (handler && typeof handler === "object") return handler;
	else return { handle: handler };
};
//#endregion
//#region node_modules/workbox-routing/Route.js
/**
* A `Route` consists of a pair of callback functions, "match" and "handler".
* The "match" callback determine if a route should be used to "handle" a
* request by returning a non-falsy value if it can. The "handler" callback
* is called when there is a match and should return a Promise that resolves
* to a `Response`.
*
* @memberof workbox-routing
*/
var Route = class {
	/**
	* Constructor for Route class.
	*
	* @param {workbox-routing~matchCallback} match
	* A callback function that determines whether the route matches a given
	* `fetch` event by returning a non-falsy value.
	* @param {workbox-routing~handlerCallback} handler A callback
	* function that returns a Promise resolving to a Response.
	* @param {string} [method='GET'] The HTTP method to match the Route
	* against.
	*/
	constructor(match, handler, method = "GET") {
		this.handler = normalizeHandler(handler);
		this.match = match;
		this.method = method;
	}
	/**
	*
	* @param {workbox-routing-handlerCallback} handler A callback
	* function that returns a Promise resolving to a Response
	*/
	setCatchHandler(handler) {
		this.catchHandler = normalizeHandler(handler);
	}
};
//#endregion
//#region node_modules/workbox-routing/RegExpRoute.js
/**
* RegExpRoute makes it easy to create a regular expression based
* {@link workbox-routing.Route}.
*
* For same-origin requests the RegExp only needs to match part of the URL. For
* requests against third-party servers, you must define a RegExp that matches
* the start of the URL.
*
* @memberof workbox-routing
* @extends workbox-routing.Route
*/
var RegExpRoute = class extends Route {
	/**
	* If the regular expression contains
	* [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
	* the captured values will be passed to the
	* {@link workbox-routing~handlerCallback} `params`
	* argument.
	*
	* @param {RegExp} regExp The regular expression to match against URLs.
	* @param {workbox-routing~handlerCallback} handler A callback
	* function that returns a Promise resulting in a Response.
	* @param {string} [method='GET'] The HTTP method to match the Route
	* against.
	*/
	constructor(regExp, handler, method) {
		const match = ({ url }) => {
			const result = regExp.exec(url.href);
			if (!result) return;
			if (url.origin !== location.origin && result.index !== 0) return;
			return result.slice(1);
		};
		super(match, handler, method);
	}
};
//#endregion
//#region node_modules/workbox-routing/Router.js
/**
* The Router can be used to process a `FetchEvent` using one or more
* {@link workbox-routing.Route}, responding with a `Response` if
* a matching route exists.
*
* If no route matches a given a request, the Router will use a "default"
* handler if one is defined.
*
* Should the matching Route throw an error, the Router will use a "catch"
* handler if one is defined to gracefully deal with issues and respond with a
* Request.
*
* If a request matches multiple routes, the **earliest** registered route will
* be used to respond to the request.
*
* @memberof workbox-routing
*/
var Router = class {
	/**
	* Initializes a new Router.
	*/
	constructor() {
		this._routes = /* @__PURE__ */ new Map();
		this._defaultHandlerMap = /* @__PURE__ */ new Map();
	}
	/**
	* @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
	* method name ('GET', etc.) to an array of all the corresponding `Route`
	* instances that are registered.
	*/
	get routes() {
		return this._routes;
	}
	/**
	* Adds a fetch event listener to respond to events when a route matches
	* the event's request.
	*/
	addFetchListener() {
		self.addEventListener("fetch", ((event) => {
			const { request } = event;
			const responsePromise = this.handleRequest({
				request,
				event
			});
			if (responsePromise) event.respondWith(responsePromise);
		}));
	}
	/**
	* Adds a message event listener for URLs to cache from the window.
	* This is useful to cache resources loaded on the page prior to when the
	* service worker started controlling it.
	*
	* The format of the message data sent from the window should be as follows.
	* Where the `urlsToCache` array may consist of URL strings or an array of
	* URL string + `requestInit` object (the same as you'd pass to `fetch()`).
	*
	* ```
	* {
	*   type: 'CACHE_URLS',
	*   payload: {
	*     urlsToCache: [
	*       './script1.js',
	*       './script2.js',
	*       ['./script3.js', {mode: 'no-cors'}],
	*     ],
	*   },
	* }
	* ```
	*/
	addCacheListener() {
		self.addEventListener("message", ((event) => {
			if (event.data && event.data.type === "CACHE_URLS") {
				const { payload } = event.data;
				const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
					if (typeof entry === "string") entry = [entry];
					const request = new Request(...entry);
					return this.handleRequest({
						request,
						event
					});
				}));
				event.waitUntil(requestPromises);
				if (event.ports && event.ports[0]) requestPromises.then(() => event.ports[0].postMessage(true));
			}
		}));
	}
	/**
	* Apply the routing rules to a FetchEvent object to get a Response from an
	* appropriate Route's handler.
	*
	* @param {Object} options
	* @param {Request} options.request The request to handle.
	* @param {ExtendableEvent} options.event The event that triggered the
	*     request.
	* @return {Promise<Response>|undefined} A promise is returned if a
	*     registered route can handle the request. If there is no matching
	*     route and there's no `defaultHandler`, `undefined` is returned.
	*/
	handleRequest({ request, event }) {
		const url = new URL(request.url, location.href);
		if (!url.protocol.startsWith("http")) return;
		const sameOrigin = url.origin === location.origin;
		const { params, route } = this.findMatchingRoute({
			event,
			request,
			sameOrigin,
			url
		});
		let handler = route && route.handler;
		const method = request.method;
		if (!handler && this._defaultHandlerMap.has(method)) handler = this._defaultHandlerMap.get(method);
		if (!handler) return;
		let responsePromise;
		try {
			responsePromise = handler.handle({
				url,
				request,
				event,
				params
			});
		} catch (err) {
			responsePromise = Promise.reject(err);
		}
		const catchHandler = route && route.catchHandler;
		if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) responsePromise = responsePromise.catch(async (err) => {
			if (catchHandler) try {
				return await catchHandler.handle({
					url,
					request,
					event,
					params
				});
			} catch (catchErr) {
				if (catchErr instanceof Error) err = catchErr;
			}
			if (this._catchHandler) return this._catchHandler.handle({
				url,
				request,
				event
			});
			throw err;
		});
		return responsePromise;
	}
	/**
	* Checks a request and URL (and optionally an event) against the list of
	* registered routes, and if there's a match, returns the corresponding
	* route along with any params generated by the match.
	*
	* @param {Object} options
	* @param {URL} options.url
	* @param {boolean} options.sameOrigin The result of comparing `url.origin`
	*     against the current origin.
	* @param {Request} options.request The request to match.
	* @param {Event} options.event The corresponding event.
	* @return {Object} An object with `route` and `params` properties.
	*     They are populated if a matching route was found or `undefined`
	*     otherwise.
	*/
	findMatchingRoute({ url, sameOrigin, request, event }) {
		const routes = this._routes.get(request.method) || [];
		for (const route of routes) {
			let params;
			const matchResult = route.match({
				url,
				sameOrigin,
				request,
				event
			});
			if (matchResult) {
				params = matchResult;
				if (Array.isArray(params) && params.length === 0) params = void 0;
				else if (matchResult.constructor === Object && Object.keys(matchResult).length === 0) params = void 0;
				else if (typeof matchResult === "boolean") params = void 0;
				return {
					route,
					params
				};
			}
		}
		return {};
	}
	/**
	* Define a default `handler` that's called when no routes explicitly
	* match the incoming request.
	*
	* Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
	*
	* Without a default handler, unmatched requests will go against the
	* network as if there were no service worker present.
	*
	* @param {workbox-routing~handlerCallback} handler A callback
	* function that returns a Promise resulting in a Response.
	* @param {string} [method='GET'] The HTTP method to associate with this
	* default handler. Each method has its own default.
	*/
	setDefaultHandler(handler, method = "GET") {
		this._defaultHandlerMap.set(method, normalizeHandler(handler));
	}
	/**
	* If a Route throws an error while handling a request, this `handler`
	* will be called and given a chance to provide a response.
	*
	* @param {workbox-routing~handlerCallback} handler A callback
	* function that returns a Promise resulting in a Response.
	*/
	setCatchHandler(handler) {
		this._catchHandler = normalizeHandler(handler);
	}
	/**
	* Registers a route with the router.
	*
	* @param {workbox-routing.Route} route The route to register.
	*/
	registerRoute(route) {
		if (!this._routes.has(route.method)) this._routes.set(route.method, []);
		this._routes.get(route.method).push(route);
	}
	/**
	* Unregisters a route with the router.
	*
	* @param {workbox-routing.Route} route The route to unregister.
	*/
	unregisterRoute(route) {
		if (!this._routes.has(route.method)) throw new WorkboxError("unregister-route-but-not-found-with-method", { method: route.method });
		const routeIndex = this._routes.get(route.method).indexOf(route);
		if (routeIndex > -1) this._routes.get(route.method).splice(routeIndex, 1);
		else throw new WorkboxError("unregister-route-route-not-registered");
	}
};
//#endregion
//#region node_modules/workbox-routing/utils/getOrCreateDefaultRouter.js
var defaultRouter;
/**
* Creates a new, singleton Router instance if one does not exist. If one
* does already exist, that instance is returned.
*
* @private
* @return {Router}
*/
var getOrCreateDefaultRouter = () => {
	if (!defaultRouter) {
		defaultRouter = new Router();
		defaultRouter.addFetchListener();
		defaultRouter.addCacheListener();
	}
	return defaultRouter;
};
//#endregion
//#region node_modules/workbox-routing/registerRoute.js
/**
* Easily register a RegExp, string, or function with a caching
* strategy to a singleton Router instance.
*
* This method will generate a Route for you if needed and
* call {@link workbox-routing.Router#registerRoute}.
*
* @param {RegExp|string|workbox-routing.Route~matchCallback|workbox-routing.Route} capture
* If the capture param is a `Route`, all other arguments will be ignored.
* @param {workbox-routing~handlerCallback} [handler] A callback
* function that returns a Promise resulting in a Response. This parameter
* is required if `capture` is not a `Route` object.
* @param {string} [method='GET'] The HTTP method to match the Route
* against.
* @return {workbox-routing.Route} The generated `Route`.
*
* @memberof workbox-routing
*/
function registerRoute(capture, handler, method) {
	let route;
	if (typeof capture === "string") {
		const captureUrl = new URL(capture, location.href);
		const matchCallback = ({ url }) => {
			return url.href === captureUrl.href;
		};
		route = new Route(matchCallback, handler, method);
	} else if (capture instanceof RegExp) route = new RegExpRoute(capture, handler, method);
	else if (typeof capture === "function") route = new Route(capture, handler, method);
	else if (capture instanceof Route) route = capture;
	else throw new WorkboxError("unsupported-route-type", {
		moduleName: "workbox-routing",
		funcName: "registerRoute",
		paramName: "capture"
	});
	getOrCreateDefaultRouter().registerRoute(route);
	return route;
}
//#endregion
//#region node_modules/workbox-precaching/utils/removeIgnoredSearchParams.js
/**
* Removes any URL search parameters that should be ignored.
*
* @param {URL} urlObject The original URL.
* @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
* each search parameter name. Matches mean that the search parameter should be
* ignored.
* @return {URL} The URL with any ignored search parameters removed.
*
* @private
* @memberof workbox-precaching
*/
function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
	for (const paramName of [...urlObject.searchParams.keys()]) if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) urlObject.searchParams.delete(paramName);
	return urlObject;
}
//#endregion
//#region node_modules/workbox-precaching/utils/generateURLVariations.js
/**
* Generator function that yields possible variations on the original URL to
* check, one at a time.
*
* @param {string} url
* @param {Object} options
*
* @private
* @memberof workbox-precaching
*/
function* generateURLVariations(url, { ignoreURLParametersMatching = [/^utm_/, /^fbclid$/], directoryIndex = "index.html", cleanURLs = true, urlManipulation } = {}) {
	const urlObject = new URL(url, location.href);
	urlObject.hash = "";
	yield urlObject.href;
	const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
	yield urlWithoutIgnoredParams.href;
	if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
		const directoryURL = new URL(urlWithoutIgnoredParams.href);
		directoryURL.pathname += directoryIndex;
		yield directoryURL.href;
	}
	if (cleanURLs) {
		const cleanURL = new URL(urlWithoutIgnoredParams.href);
		cleanURL.pathname += ".html";
		yield cleanURL.href;
	}
	if (urlManipulation) {
		const additionalURLs = urlManipulation({ url: urlObject });
		for (const urlToAttempt of additionalURLs) yield urlToAttempt.href;
	}
}
//#endregion
//#region node_modules/workbox-precaching/PrecacheRoute.js
/**
* A subclass of {@link workbox-routing.Route} that takes a
* {@link workbox-precaching.PrecacheController}
* instance and uses it to match incoming requests and handle fetching
* responses from the precache.
*
* @memberof workbox-precaching
* @extends workbox-routing.Route
*/
var PrecacheRoute = class extends Route {
	/**
	* @param {PrecacheController} precacheController A `PrecacheController`
	* instance used to both match requests and respond to fetch events.
	* @param {Object} [options] Options to control how requests are matched
	* against the list of precached URLs.
	* @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
	* check cache entries for a URLs ending with '/' to see if there is a hit when
	* appending the `directoryIndex` value.
	* @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
	* array of regex's to remove search params when looking for a cache match.
	* @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
	* check the cache for the URL with a `.html` added to the end of the end.
	* @param {workbox-precaching~urlManipulation} [options.urlManipulation]
	* This is a function that should take a URL and return an array of
	* alternative URLs that should be checked for precache matches.
	*/
	constructor(precacheController, options) {
		const match = ({ request }) => {
			const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
			for (const possibleURL of generateURLVariations(request.url, options)) {
				const cacheKey = urlsToCacheKeys.get(possibleURL);
				if (cacheKey) return {
					cacheKey,
					integrity: precacheController.getIntegrityForCacheKey(cacheKey)
				};
			}
		};
		super(match, precacheController.strategy);
	}
};
//#endregion
//#region node_modules/workbox-precaching/addRoute.js
/**
* Add a `fetch` listener to the service worker that will
* respond to
* [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
* with precached assets.
*
* Requests for assets that aren't precached, the `FetchEvent` will not be
* responded to, allowing the event to fall through to other `fetch` event
* listeners.
*
* @param {Object} [options] See the {@link workbox-precaching.PrecacheRoute}
* options.
*
* @memberof workbox-precaching
*/
function addRoute(options) {
	registerRoute(new PrecacheRoute(getOrCreatePrecacheController(), options));
}
//#endregion
//#region node_modules/workbox-precaching/utils/deleteOutdatedCaches.js
var SUBSTRING_TO_FIND = "-precache-";
/**
* Cleans up incompatible precaches that were created by older versions of
* Workbox, by a service worker registered under the current scope.
*
* This is meant to be called as part of the `activate` event.
*
* This should be safe to use as long as you don't include `substringToFind`
* (defaulting to `-precache-`) in your non-precache cache names.
*
* @param {string} currentPrecacheName The cache name currently in use for
* precaching. This cache won't be deleted.
* @param {string} [substringToFind='-precache-'] Cache names which include this
* substring will be deleted (excluding `currentPrecacheName`).
* @return {Array<string>} A list of all the cache names that were deleted.
*
* @private
* @memberof workbox-precaching
*/
var deleteOutdatedCaches = async (currentPrecacheName, substringToFind = SUBSTRING_TO_FIND) => {
	const cacheNamesToDelete = (await self.caches.keys()).filter((cacheName) => {
		return cacheName.includes(substringToFind) && cacheName.includes(self.registration.scope) && cacheName !== currentPrecacheName;
	});
	await Promise.all(cacheNamesToDelete.map((cacheName) => self.caches.delete(cacheName)));
	return cacheNamesToDelete;
};
//#endregion
//#region node_modules/workbox-precaching/cleanupOutdatedCaches.js
/**
* Adds an `activate` event listener which will clean up incompatible
* precaches that were created by older versions of Workbox.
*
* @memberof workbox-precaching
*/
function cleanupOutdatedCaches() {
	self.addEventListener("activate", ((event) => {
		const cacheName = cacheNames.getPrecacheName();
		event.waitUntil(deleteOutdatedCaches(cacheName).then((cachesDeleted) => {}));
	}));
}
//#endregion
//#region node_modules/workbox-precaching/matchPrecache.js
/**
* Helper function that calls
* {@link PrecacheController#matchPrecache} on the default
* {@link PrecacheController} instance.
*
* If you are creating your own {@link PrecacheController}, then call
* {@link PrecacheController#matchPrecache} on that instance,
* instead of using this function.
*
* @param {string|Request} request The key (without revisioning parameters)
* to look up in the precache.
* @return {Promise<Response|undefined>}
*
* @memberof workbox-precaching
*/
function matchPrecache(request) {
	return getOrCreatePrecacheController().matchPrecache(request);
}
//#endregion
//#region node_modules/workbox-precaching/precache.js
/**
* Adds items to the precache list, removing any duplicates and
* stores the files in the
* {@link workbox-core.cacheNames|"precache cache"} when the service
* worker installs.
*
* This method can be called multiple times.
*
* Please note: This method **will not** serve any of the cached files for you.
* It only precaches files. To respond to a network request you call
* {@link workbox-precaching.addRoute}.
*
* If you have a single array of files to precache, you can just call
* {@link workbox-precaching.precacheAndRoute}.
*
* @param {Array<Object|string>} [entries=[]] Array of entries to precache.
*
* @memberof workbox-precaching
*/
function precache(entries) {
	getOrCreatePrecacheController().precache(entries);
}
//#endregion
//#region node_modules/workbox-precaching/precacheAndRoute.js
/**
* This method will add entries to the precache list and add a route to
* respond to fetch events.
*
* This is a convenience method that will call
* {@link workbox-precaching.precache} and
* {@link workbox-precaching.addRoute} in a single call.
*
* @param {Array<Object|string>} entries Array of entries to precache.
* @param {Object} [options] See the
* {@link workbox-precaching.PrecacheRoute} options.
*
* @memberof workbox-precaching
*/
function precacheAndRoute(entries, options) {
	precache(entries);
	addRoute(options);
}
//#endregion
//#region node_modules/workbox-precaching/_types.js
/**
* @typedef {Object} InstallResult
* @property {Array<string>} updatedURLs List of URLs that were updated during
* installation.
* @property {Array<string>} notUpdatedURLs List of URLs that were already up to
* date.
*
* @memberof workbox-precaching
*/
/**
* @typedef {Object} CleanupResult
* @property {Array<string>} deletedCacheRequests List of URLs that were deleted
* while cleaning up the cache.
*
* @memberof workbox-precaching
*/
/**
* @typedef {Object} PrecacheEntry
* @property {string} url URL to precache.
* @property {string} [revision] Revision information for the URL.
* @property {string} [integrity] Integrity metadata that will be used when
* making the network request for the URL.
*
* @memberof workbox-precaching
*/
/**
* The "urlManipulation" callback can be used to determine if there are any
* additional permutations of a URL that should be used to check against
* the available precached files.
*
* For example, Workbox supports checking for '/index.html' when the URL
* '/' is provided. This callback allows additional, custom checks.
*
* @callback ~urlManipulation
* @param {Object} context
* @param {URL} context.url The request's URL.
* @return {Array<URL>} To add additional urls to test, return an Array of
* URLs. Please note that these **should not be strings**, but URL objects.
*
* @memberof workbox-precaching
*/
//#endregion
//#region node_modules/workbox-routing/setCatchHandler.js
/**
* If a Route throws an error while handling a request, this `handler`
* will be called and given a chance to provide a response.
*
* @param {workbox-routing~handlerCallback} handler A callback
* function that returns a Promise resulting in a Response.
*
* @memberof workbox-routing
*/
function setCatchHandler(handler) {
	getOrCreateDefaultRouter().setCatchHandler(handler);
}
//#endregion
//#region node_modules/workbox-strategies/CacheFirst.js
/**
* An implementation of a [cache-first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network)
* request strategy.
*
* A cache first strategy is useful for assets that have been revisioned,
* such as URLs like `/styles/example.a8f5f1.css`, since they
* can be cached for long periods of time.
*
* If the network request fails, and there is no cache match, this will throw
* a `WorkboxError` exception.
*
* @extends workbox-strategies.Strategy
* @memberof workbox-strategies
*/
var CacheFirst = class extends Strategy {
	/**
	* @private
	* @param {Request|string} request A request to run this strategy for.
	* @param {workbox-strategies.StrategyHandler} handler The event that
	*     triggered the request.
	* @return {Promise<Response>}
	*/
	async _handle(request, handler) {
		let response = await handler.cacheMatch(request);
		let error = void 0;
		if (!response) try {
			response = await handler.fetchAndCachePut(request);
		} catch (err) {
			if (err instanceof Error) error = err;
		}
		if (!response) throw new WorkboxError("no-response", {
			url: request.url,
			error
		});
		return response;
	}
};
//#endregion
//#region node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.js
var cacheOkAndOpaquePlugin = { 
/**
* Returns a valid response (to allow caching) if the status is 200 (OK) or
* 0 (opaque).
*
* @param {Object} options
* @param {Response} options.response
* @return {Response|null}
*
* @private
*/
cacheWillUpdate: async ({ response }) => {
	if (response.status === 200 || response.status === 0) return response;
	return null;
} };
//#endregion
//#region node_modules/workbox-strategies/NetworkFirst.js
/**
* An implementation of a
* [network first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache)
* request strategy.
*
* By default, this strategy will cache responses with a 200 status code as
* well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
* Opaque responses are are cross-origin requests where the response doesn't
* support [CORS](https://enable-cors.org/).
*
* If the network request fails, and there is no cache match, this will throw
* a `WorkboxError` exception.
*
* @extends workbox-strategies.Strategy
* @memberof workbox-strategies
*/
var NetworkFirst = class extends Strategy {
	/**
	* @param {Object} [options]
	* @param {string} [options.cacheName] Cache name to store and retrieve
	* requests. Defaults to cache names provided by
	* {@link workbox-core.cacheNames}.
	* @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
	* to use in conjunction with this caching strategy.
	* @param {Object} [options.fetchOptions] Values passed along to the
	* [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
	* of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
	* `fetch()` requests made by this strategy.
	* @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
	* @param {number} [options.networkTimeoutSeconds] If set, any network requests
	* that fail to respond within the timeout will fallback to the cache.
	*
	* This option can be used to combat
	* "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
	* scenarios.
	*/
	constructor(options = {}) {
		super(options);
		if (!this.plugins.some((p) => "cacheWillUpdate" in p)) this.plugins.unshift(cacheOkAndOpaquePlugin);
		this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
	}
	/**
	* @private
	* @param {Request|string} request A request to run this strategy for.
	* @param {workbox-strategies.StrategyHandler} handler The event that
	*     triggered the request.
	* @return {Promise<Response>}
	*/
	async _handle(request, handler) {
		const logs = [];
		const promises = [];
		let timeoutId;
		if (this._networkTimeoutSeconds) {
			const { id, promise } = this._getTimeoutPromise({
				request,
				logs,
				handler
			});
			timeoutId = id;
			promises.push(promise);
		}
		const networkPromise = this._getNetworkPromise({
			timeoutId,
			request,
			logs,
			handler
		});
		promises.push(networkPromise);
		const response = await handler.waitUntil((async () => {
			return await handler.waitUntil(Promise.race(promises)) || await networkPromise;
		})());
		if (!response) throw new WorkboxError("no-response", { url: request.url });
		return response;
	}
	/**
	* @param {Object} options
	* @param {Request} options.request
	* @param {Array} options.logs A reference to the logs array
	* @param {Event} options.event
	* @return {Promise<Response>}
	*
	* @private
	*/
	_getTimeoutPromise({ request, logs, handler }) {
		let timeoutId;
		return {
			promise: new Promise((resolve) => {
				const onNetworkTimeout = async () => {
					resolve(await handler.cacheMatch(request));
				};
				timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1e3);
			}),
			id: timeoutId
		};
	}
	/**
	* @param {Object} options
	* @param {number|undefined} options.timeoutId
	* @param {Request} options.request
	* @param {Array} options.logs A reference to the logs Array.
	* @param {Event} options.event
	* @return {Promise<Response>}
	*
	* @private
	*/
	async _getNetworkPromise({ timeoutId, request, logs, handler }) {
		let error;
		let response;
		try {
			response = await handler.fetchAndCachePut(request);
		} catch (fetchError) {
			if (fetchError instanceof Error) error = fetchError;
		}
		if (timeoutId) clearTimeout(timeoutId);
		if (error || !response) response = await handler.cacheMatch(request);
		return response;
	}
};
//#endregion
//#region node_modules/workbox-strategies/StaleWhileRevalidate.js
/**
* An implementation of a
* [stale-while-revalidate](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate)
* request strategy.
*
* Resources are requested from both the cache and the network in parallel.
* The strategy will respond with the cached version if available, otherwise
* wait for the network response. The cache is updated with the network response
* with each successful request.
*
* By default, this strategy will cache responses with a 200 status code as
* well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
* Opaque responses are cross-origin requests where the response doesn't
* support [CORS](https://enable-cors.org/).
*
* If the network request fails, and there is no cache match, this will throw
* a `WorkboxError` exception.
*
* @extends workbox-strategies.Strategy
* @memberof workbox-strategies
*/
var StaleWhileRevalidate = class extends Strategy {
	/**
	* @param {Object} [options]
	* @param {string} [options.cacheName] Cache name to store and retrieve
	* requests. Defaults to cache names provided by
	* {@link workbox-core.cacheNames}.
	* @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
	* to use in conjunction with this caching strategy.
	* @param {Object} [options.fetchOptions] Values passed along to the
	* [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
	* of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
	* `fetch()` requests made by this strategy.
	* @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
	*/
	constructor(options = {}) {
		super(options);
		if (!this.plugins.some((p) => "cacheWillUpdate" in p)) this.plugins.unshift(cacheOkAndOpaquePlugin);
	}
	/**
	* @private
	* @param {Request|string} request A request to run this strategy for.
	* @param {workbox-strategies.StrategyHandler} handler The event that
	*     triggered the request.
	* @return {Promise<Response>}
	*/
	async _handle(request, handler) {
		const fetchAndCachePromise = handler.fetchAndCachePut(request).catch(() => {});
		handler.waitUntil(fetchAndCachePromise);
		let response = await handler.cacheMatch(request);
		let error;
		if (response) {} else try {
			response = await fetchAndCachePromise;
		} catch (err) {
			if (err instanceof Error) error = err;
		}
		if (!response) throw new WorkboxError("no-response", {
			url: request.url,
			error
		});
		return response;
	}
};
//#endregion
//#region node_modules/workbox-core/_private/dontWaitFor.js
/**
* A helper function that prevents a promise from being flagged as unused.
*
* @private
**/
function dontWaitFor(promise) {
	promise.then(() => {});
}
//#endregion
//#region node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
	return idbProxyableTypes || (idbProxyableTypes = [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	]);
}
function getCursorAdvanceMethods() {
	return cursorAdvanceMethods || (cursorAdvanceMethods = [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
	const promise = new Promise((resolve, reject) => {
		const unlisten = () => {
			request.removeEventListener("success", success);
			request.removeEventListener("error", error);
		};
		const success = () => {
			resolve(wrap(request.result));
			unlisten();
		};
		const error = () => {
			reject(request.error);
			unlisten();
		};
		request.addEventListener("success", success);
		request.addEventListener("error", error);
	});
	promise.then((value) => {
		if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
	}).catch(() => {});
	reverseTransformCache.set(promise, request);
	return promise;
}
function cacheDonePromiseForTransaction(tx) {
	if (transactionDoneMap.has(tx)) return;
	const done = new Promise((resolve, reject) => {
		const unlisten = () => {
			tx.removeEventListener("complete", complete);
			tx.removeEventListener("error", error);
			tx.removeEventListener("abort", error);
		};
		const complete = () => {
			resolve();
			unlisten();
		};
		const error = () => {
			reject(tx.error || new DOMException("AbortError", "AbortError"));
			unlisten();
		};
		tx.addEventListener("complete", complete);
		tx.addEventListener("error", error);
		tx.addEventListener("abort", error);
	});
	transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
	get(target, prop, receiver) {
		if (target instanceof IDBTransaction) {
			if (prop === "done") return transactionDoneMap.get(target);
			if (prop === "objectStoreNames") return target.objectStoreNames || transactionStoreNamesMap.get(target);
			if (prop === "store") return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
		}
		return wrap(target[prop]);
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
	has(target, prop) {
		if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
		return prop in target;
	}
};
function replaceTraps(callback) {
	idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
	if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
		const tx = func.call(unwrap(this), storeNames, ...args);
		transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
		return wrap(tx);
	};
	if (getCursorAdvanceMethods().includes(func)) return function(...args) {
		func.apply(unwrap(this), args);
		return wrap(cursorRequestMap.get(this));
	};
	return function(...args) {
		return wrap(func.apply(unwrap(this), args));
	};
}
function transformCachableValue(value) {
	if (typeof value === "function") return wrapFunction(value);
	if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
	if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
	return value;
}
function wrap(value) {
	if (value instanceof IDBRequest) return promisifyRequest(value);
	if (transformCache.has(value)) return transformCache.get(value);
	const newValue = transformCachableValue(value);
	if (newValue !== value) {
		transformCache.set(value, newValue);
		reverseTransformCache.set(newValue, value);
	}
	return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
//#endregion
//#region node_modules/idb/build/index.js
/**
* Open a database.
*
* @param name Name of the database.
* @param version Schema version.
* @param callbacks Additional callbacks.
*/
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
	const request = indexedDB.open(name, version);
	const openPromise = wrap(request);
	if (upgrade) request.addEventListener("upgradeneeded", (event) => {
		upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
	});
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
	openPromise.then((db) => {
		if (terminated) db.addEventListener("close", () => terminated());
		if (blocking) db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
	}).catch(() => {});
	return openPromise;
}
/**
* Delete a database.
*
* @param name Name of the database.
*/
function deleteDB(name, { blocked } = {}) {
	const request = indexedDB.deleteDatabase(name);
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event));
	return wrap(request).then(() => void 0);
}
var readMethods = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
];
var writeMethods = [
	"put",
	"add",
	"delete",
	"clear"
];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
	if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) return;
	if (cachedMethods.get(prop)) return cachedMethods.get(prop);
	const targetFuncName = prop.replace(/FromIndex$/, "");
	const useIndex = prop !== targetFuncName;
	const isWrite = writeMethods.includes(targetFuncName);
	if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
	const method = async function(storeName, ...args) {
		const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
		let target = tx.store;
		if (useIndex) target = target.index(args.shift());
		return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
	};
	cachedMethods.set(prop, method);
	return method;
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
	has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
//#endregion
//#region node_modules/workbox-expiration/_version.js
try {
	self["workbox:expiration:7.4.0"] && _();
} catch (e) {}
//#endregion
//#region node_modules/workbox-expiration/models/CacheTimestampsModel.js
var DB_NAME = "workbox-expiration";
var CACHE_OBJECT_STORE = "cache-entries";
var normalizeURL = (unNormalizedUrl) => {
	const url = new URL(unNormalizedUrl, location.href);
	url.hash = "";
	return url.href;
};
/**
* Returns the timestamp model.
*
* @private
*/
var CacheTimestampsModel = class {
	/**
	*
	* @param {string} cacheName
	*
	* @private
	*/
	constructor(cacheName) {
		this._db = null;
		this._cacheName = cacheName;
	}
	/**
	* Performs an upgrade of indexedDB.
	*
	* @param {IDBPDatabase<CacheDbSchema>} db
	*
	* @private
	*/
	_upgradeDb(db) {
		const objStore = db.createObjectStore(CACHE_OBJECT_STORE, { keyPath: "id" });
		objStore.createIndex("cacheName", "cacheName", { unique: false });
		objStore.createIndex("timestamp", "timestamp", { unique: false });
	}
	/**
	* Performs an upgrade of indexedDB and deletes deprecated DBs.
	*
	* @param {IDBPDatabase<CacheDbSchema>} db
	*
	* @private
	*/
	_upgradeDbAndDeleteOldDbs(db) {
		this._upgradeDb(db);
		if (this._cacheName) deleteDB(this._cacheName);
	}
	/**
	* @param {string} url
	* @param {number} timestamp
	*
	* @private
	*/
	async setTimestamp(url, timestamp) {
		url = normalizeURL(url);
		const entry = {
			url,
			timestamp,
			cacheName: this._cacheName,
			id: this._getId(url)
		};
		const tx = (await this.getDb()).transaction(CACHE_OBJECT_STORE, "readwrite", { durability: "relaxed" });
		await tx.store.put(entry);
		await tx.done;
	}
	/**
	* Returns the timestamp stored for a given URL.
	*
	* @param {string} url
	* @return {number | undefined}
	*
	* @private
	*/
	async getTimestamp(url) {
		const entry = await (await this.getDb()).get(CACHE_OBJECT_STORE, this._getId(url));
		return entry === null || entry === void 0 ? void 0 : entry.timestamp;
	}
	/**
	* Iterates through all the entries in the object store (from newest to
	* oldest) and removes entries once either `maxCount` is reached or the
	* entry's timestamp is less than `minTimestamp`.
	*
	* @param {number} minTimestamp
	* @param {number} maxCount
	* @return {Array<string>}
	*
	* @private
	*/
	async expireEntries(minTimestamp, maxCount) {
		const db = await this.getDb();
		let cursor = await db.transaction(CACHE_OBJECT_STORE).store.index("timestamp").openCursor(null, "prev");
		const entriesToDelete = [];
		let entriesNotDeletedCount = 0;
		while (cursor) {
			const result = cursor.value;
			if (result.cacheName === this._cacheName) if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) entriesToDelete.push(cursor.value);
			else entriesNotDeletedCount++;
			cursor = await cursor.continue();
		}
		const urlsDeleted = [];
		for (const entry of entriesToDelete) {
			await db.delete(CACHE_OBJECT_STORE, entry.id);
			urlsDeleted.push(entry.url);
		}
		return urlsDeleted;
	}
	/**
	* Takes a URL and returns an ID that will be unique in the object store.
	*
	* @param {string} url
	* @return {string}
	*
	* @private
	*/
	_getId(url) {
		return this._cacheName + "|" + normalizeURL(url);
	}
	/**
	* Returns an open connection to the database.
	*
	* @private
	*/
	async getDb() {
		if (!this._db) this._db = await openDB(DB_NAME, 1, { upgrade: this._upgradeDbAndDeleteOldDbs.bind(this) });
		return this._db;
	}
};
//#endregion
//#region node_modules/workbox-expiration/CacheExpiration.js
/**
* The `CacheExpiration` class allows you define an expiration and / or
* limit on the number of responses stored in a
* [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
*
* @memberof workbox-expiration
*/
var CacheExpiration = class {
	/**
	* To construct a new CacheExpiration instance you must provide at least
	* one of the `config` properties.
	*
	* @param {string} cacheName Name of the cache to apply restrictions to.
	* @param {Object} config
	* @param {number} [config.maxEntries] The maximum number of entries to cache.
	* Entries used the least will be removed as the maximum is reached.
	* @param {number} [config.maxAgeSeconds] The maximum age of an entry before
	* it's treated as stale and removed.
	* @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
	* that will be used when calling `delete()` on the cache.
	*/
	constructor(cacheName, config = {}) {
		this._isRunning = false;
		this._rerunRequested = false;
		this._maxEntries = config.maxEntries;
		this._maxAgeSeconds = config.maxAgeSeconds;
		this._matchOptions = config.matchOptions;
		this._cacheName = cacheName;
		this._timestampModel = new CacheTimestampsModel(cacheName);
	}
	/**
	* Expires entries for the given cache and given criteria.
	*/
	async expireEntries() {
		if (this._isRunning) {
			this._rerunRequested = true;
			return;
		}
		this._isRunning = true;
		const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0;
		const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
		const cache = await self.caches.open(this._cacheName);
		for (const url of urlsExpired) await cache.delete(url, this._matchOptions);
		this._isRunning = false;
		if (this._rerunRequested) {
			this._rerunRequested = false;
			dontWaitFor(this.expireEntries());
		}
	}
	/**
	* Update the timestamp for the given URL. This ensures the when
	* removing entries based on maximum entries, most recently used
	* is accurate or when expiring, the timestamp is up-to-date.
	*
	* @param {string} url
	*/
	async updateTimestamp(url) {
		await this._timestampModel.setTimestamp(url, Date.now());
	}
	/**
	* Can be used to check if a URL has expired or not before it's used.
	*
	* This requires a look up from IndexedDB, so can be slow.
	*
	* Note: This method will not remove the cached entry, call
	* `expireEntries()` to remove indexedDB and Cache entries.
	*
	* @param {string} url
	* @return {boolean}
	*/
	async isURLExpired(url) {
		if (!this._maxAgeSeconds) return false;
		else {
			const timestamp = await this._timestampModel.getTimestamp(url);
			const expireOlderThan = Date.now() - this._maxAgeSeconds * 1e3;
			return timestamp !== void 0 ? timestamp < expireOlderThan : true;
		}
	}
	/**
	* Removes the IndexedDB object store used to keep track of cache expiration
	* metadata.
	*/
	async delete() {
		this._rerunRequested = false;
		await this._timestampModel.expireEntries(Infinity);
	}
};
//#endregion
//#region node_modules/workbox-core/registerQuotaErrorCallback.js
/**
* Adds a function to the set of quotaErrorCallbacks that will be executed if
* there's a quota error.
*
* @param {Function} callback
* @memberof workbox-core
*/
function registerQuotaErrorCallback(callback) {
	quotaErrorCallbacks.add(callback);
}
//#endregion
//#region node_modules/workbox-expiration/ExpirationPlugin.js
/**
* This plugin can be used in a `workbox-strategy` to regularly enforce a
* limit on the age and / or the number of cached requests.
*
* It can only be used with `workbox-strategy` instances that have a
* [custom `cacheName` property set](/web/tools/workbox/guides/configure-workbox#custom_cache_names_in_strategies).
* In other words, it can't be used to expire entries in strategy that uses the
* default runtime cache name.
*
* Whenever a cached response is used or updated, this plugin will look
* at the associated cache and remove any old or extra responses.
*
* When using `maxAgeSeconds`, responses may be used *once* after expiring
* because the expiration clean up will not have occurred until *after* the
* cached response has been used. If the response has a "Date" header, then
* a light weight expiration check is performed and the response will not be
* used immediately.
*
* When using `maxEntries`, the entry least-recently requested will be removed
* from the cache first.
*
* @memberof workbox-expiration
*/
var ExpirationPlugin = class {
	/**
	* @param {ExpirationPluginOptions} config
	* @param {number} [config.maxEntries] The maximum number of entries to cache.
	* Entries used the least will be removed as the maximum is reached.
	* @param {number} [config.maxAgeSeconds] The maximum age of an entry before
	* it's treated as stale and removed.
	* @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
	* that will be used when calling `delete()` on the cache.
	* @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
	* automatic deletion if the available storage quota has been exceeded.
	*/
	constructor(config = {}) {
		/**
		* A "lifecycle" callback that will be triggered automatically by the
		* `workbox-strategies` handlers when a `Response` is about to be returned
		* from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
		* the handler. It allows the `Response` to be inspected for freshness and
		* prevents it from being used if the `Response`'s `Date` header value is
		* older than the configured `maxAgeSeconds`.
		*
		* @param {Object} options
		* @param {string} options.cacheName Name of the cache the response is in.
		* @param {Response} options.cachedResponse The `Response` object that's been
		*     read from a cache and whose freshness should be checked.
		* @return {Response} Either the `cachedResponse`, if it's
		*     fresh, or `null` if the `Response` is older than `maxAgeSeconds`.
		*
		* @private
		*/
		this.cachedResponseWillBeUsed = async ({ event, request, cacheName, cachedResponse }) => {
			if (!cachedResponse) return null;
			const isFresh = this._isResponseDateFresh(cachedResponse);
			const cacheExpiration = this._getCacheExpiration(cacheName);
			dontWaitFor(cacheExpiration.expireEntries());
			const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
			if (event) try {
				event.waitUntil(updateTimestampDone);
			} catch (error) {}
			return isFresh ? cachedResponse : null;
		};
		/**
		* A "lifecycle" callback that will be triggered automatically by the
		* `workbox-strategies` handlers when an entry is added to a cache.
		*
		* @param {Object} options
		* @param {string} options.cacheName Name of the cache that was updated.
		* @param {string} options.request The Request for the cached entry.
		*
		* @private
		*/
		this.cacheDidUpdate = async ({ cacheName, request }) => {
			const cacheExpiration = this._getCacheExpiration(cacheName);
			await cacheExpiration.updateTimestamp(request.url);
			await cacheExpiration.expireEntries();
		};
		this._config = config;
		this._maxAgeSeconds = config.maxAgeSeconds;
		this._cacheExpirations = /* @__PURE__ */ new Map();
		if (config.purgeOnQuotaError) registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
	}
	/**
	* A simple helper method to return a CacheExpiration instance for a given
	* cache name.
	*
	* @param {string} cacheName
	* @return {CacheExpiration}
	*
	* @private
	*/
	_getCacheExpiration(cacheName) {
		if (cacheName === cacheNames.getRuntimeName()) throw new WorkboxError("expire-custom-caches-only");
		let cacheExpiration = this._cacheExpirations.get(cacheName);
		if (!cacheExpiration) {
			cacheExpiration = new CacheExpiration(cacheName, this._config);
			this._cacheExpirations.set(cacheName, cacheExpiration);
		}
		return cacheExpiration;
	}
	/**
	* @param {Response} cachedResponse
	* @return {boolean}
	*
	* @private
	*/
	_isResponseDateFresh(cachedResponse) {
		if (!this._maxAgeSeconds) return true;
		const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
		if (dateHeaderTimestamp === null) return true;
		return dateHeaderTimestamp >= Date.now() - this._maxAgeSeconds * 1e3;
	}
	/**
	* This method will extract the data header and parse it into a useful
	* value.
	*
	* @param {Response} cachedResponse
	* @return {number|null}
	*
	* @private
	*/
	_getDateHeaderTimestamp(cachedResponse) {
		if (!cachedResponse.headers.has("date")) return null;
		const dateHeader = cachedResponse.headers.get("date");
		const headerTime = new Date(dateHeader).getTime();
		if (isNaN(headerTime)) return null;
		return headerTime;
	}
	/**
	* This is a helper method that performs two operations:
	*
	* - Deletes *all* the underlying Cache instances associated with this plugin
	* instance, by calling caches.delete() on your behalf.
	* - Deletes the metadata from IndexedDB used to keep track of expiration
	* details for each Cache instance.
	*
	* When using cache expiration, calling this method is preferable to calling
	* `caches.delete()` directly, since this will ensure that the IndexedDB
	* metadata is also cleanly removed and open IndexedDB instances are deleted.
	*
	* Note that if you're *not* using cache expiration for a given cache, calling
	* `caches.delete()` and passing in the cache's name should be sufficient.
	* There is no Workbox-specific method needed for cleanup in that case.
	*/
	async deleteCacheAndMetadata() {
		for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
			await self.caches.delete(cacheName);
			await cacheExpiration.delete();
		}
		this._cacheExpirations = /* @__PURE__ */ new Map();
	}
};
//#endregion
//#region node_modules/workbox-cacheable-response/_version.js
try {
	self["workbox:cacheable-response:7.4.0"] && _();
} catch (e) {}
//#endregion
//#region node_modules/workbox-cacheable-response/CacheableResponse.js
/**
* This class allows you to set up rules determining what
* status codes and/or headers need to be present in order for a
* [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* to be considered cacheable.
*
* @memberof workbox-cacheable-response
*/
var CacheableResponse = class {
	/**
	* To construct a new CacheableResponse instance you must provide at least
	* one of the `config` properties.
	*
	* If both `statuses` and `headers` are specified, then both conditions must
	* be met for the `Response` to be considered cacheable.
	*
	* @param {Object} config
	* @param {Array<number>} [config.statuses] One or more status codes that a
	* `Response` can have and be considered cacheable.
	* @param {Object<string,string>} [config.headers] A mapping of header names
	* and expected values that a `Response` can have and be considered cacheable.
	* If multiple headers are provided, only one needs to be present.
	*/
	constructor(config = {}) {
		this._statuses = config.statuses;
		this._headers = config.headers;
	}
	/**
	* Checks a response to see whether it's cacheable or not, based on this
	* object's configuration.
	*
	* @param {Response} response The response whose cacheability is being
	* checked.
	* @return {boolean} `true` if the `Response` is cacheable, and `false`
	* otherwise.
	*/
	isResponseCacheable(response) {
		let cacheable = true;
		if (this._statuses) cacheable = this._statuses.includes(response.status);
		if (this._headers && cacheable) cacheable = Object.keys(this._headers).some((headerName) => {
			return response.headers.get(headerName) === this._headers[headerName];
		});
		return cacheable;
	}
};
//#endregion
//#region node_modules/workbox-cacheable-response/CacheableResponsePlugin.js
/**
* A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
* easier to add in cacheability checks to requests made via Workbox's built-in
* strategies.
*
* @memberof workbox-cacheable-response
*/
var CacheableResponsePlugin = class {
	/**
	* To construct a new CacheableResponsePlugin instance you must provide at
	* least one of the `config` properties.
	*
	* If both `statuses` and `headers` are specified, then both conditions must
	* be met for the `Response` to be considered cacheable.
	*
	* @param {Object} config
	* @param {Array<number>} [config.statuses] One or more status codes that a
	* `Response` can have and be considered cacheable.
	* @param {Object<string,string>} [config.headers] A mapping of header names
	* and expected values that a `Response` can have and be considered cacheable.
	* If multiple headers are provided, only one needs to be present.
	*/
	constructor(config) {
		/**
		* @param {Object} options
		* @param {Response} options.response
		* @return {Response|null}
		* @private
		*/
		this.cacheWillUpdate = async ({ response }) => {
			if (this._cacheableResponse.isResponseCacheable(response)) return response;
			return null;
		};
		this._cacheableResponse = new CacheableResponse(config);
	}
};
//#endregion
//#region src/sw.js
self.skipWaiting();
self.clients.claim();
cleanupOutdatedCaches();
precacheAndRoute([{"revision":"0228c52a534a695a3a39ebefbaffc2c6","url":"/"},{"revision":null,"url":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.DqQ1FovR.js"},{"revision":"3fe8f08922b2bcf741d88f963317a221","url":"x-wing/"},{"revision":"29b93643948e713023a0ab57db313a86","url":"x-wing/v1_4_3_1/"},{"revision":"3cb683450fc5cf2e24f056ba8bf36e5e","url":"terminal/"},{"revision":"8cf3d4ecf7d2f51b32dd709e8597f43a","url":"tech/"},{"revision":"1c9b15e470fd592c125ee13661086771","url":"tdd-jokenpo/"},{"revision":"cda160487aee4fffddafb62b4b92f607","url":"tdd/"},{"revision":"a0d7dcc3ee7c0cfe747aee6f7ffd65f0","url":"strategy-pattern/"},{"revision":"211ab6f503c06b9739be6127e7f81e06","url":"simple.data/"},{"revision":"6290e1f853dd262734e53a7b8458f9c9","url":"search/"},{"revision":"2bdfa5e5f3b6b15b9aab4aea317a0cca","url":"rtti-run-time-type-information-no-delphi/"},{"revision":"30f7cf0ed674f1281894ca96b5e66b85","url":"rtti-class-helper-no-delphi/"},{"revision":"a2dfeb24cc02e2d26ca8dccda26c0919","url":"regras-de-usabilidade/"},{"revision":"ad4ce624b16c2f39c2900f47ffb61de4","url":"registrar-logs-no-event-viewer-com-delphi/"},{"revision":"20a8027245fe8a081ca3d9529b92ed6b","url":"projects/"},{"revision":"f538a6f4a6d1058485689c1f04fb4610","url":"princpio-de-segregao-de-interface/"},{"revision":"4dd835d1a4fa7b5f5c69307e1b97a1e0","url":"poems/"},{"revision":"978e904204055b9f420af80d43d93e2a","url":"page/2/"},{"revision":"5c2a374d9fe16c12f1c41f4d18485ba5","url":"offline/"},{"revision":"889bf84b08bebd88ac90772aa904e5aa","url":"nhibernate/"},{"revision":"da6844ed0e598c7183443bafc70dd0c3","url":"json-javascript-object-notation-e-generics-no-delphi/"},{"revision":"9216b6577edf1f4f09d7fb118ecbbdcc","url":"jekyll-no-windows-7/"},{"revision":"05a4cb94eb32385686911c191ecc8dd4","url":"garbage-collector-no-delphi-parte-ii/"},{"revision":"a4cc1c05f663450507eb854b3cdd2a0c","url":"garbage-collector-no-delphi-parte-i/"},{"revision":"e9192c2fe0a31fbb3b7cd6a28b2309cd","url":"fonts/source-serif-4-var-latin.woff2"},{"revision":"33ba75072ebcb4b01e5433a1ba3dc7c5","url":"fonts/source-serif-4-var-latin-ext.woff2"},{"revision":"66c33f6b248f76850cff4a00118c80e4","url":"fonts/source-serif-4-var-italic-latin.woff2"},{"revision":"3ff52c8f866c0f98779e9778408d26d7","url":"fonts/source-serif-4-var-italic-latin-ext.woff2"},{"revision":"bd2bb116d8276633fec3aba46fe9d254","url":"fonts/raleway-semibold.woff2"},{"revision":"2075794c8e9e7e48e5fbf1b2313e7adf","url":"fonts/raleway-regular.woff2"},{"revision":"1acb42d704823f91723455986436f721","url":"fonts/raleway-light.woff2"},{"revision":"b636a65da4f00129f08c7df6e5dd75ac","url":"fonts/jetbrains-mono-700-latin.woff2"},{"revision":"bd4781a31b4215a1e80868802b3d0e05","url":"fonts/jetbrains-mono-700-latin-ext.woff2"},{"revision":"b636a65da4f00129f08c7df6e5dd75ac","url":"fonts/jetbrains-mono-500-latin.woff2"},{"revision":"bd4781a31b4215a1e80868802b3d0e05","url":"fonts/jetbrains-mono-500-latin-ext.woff2"},{"revision":"b636a65da4f00129f08c7df6e5dd75ac","url":"fonts/jetbrains-mono-400-latin.woff2"},{"revision":"bd4781a31b4215a1e80868802b3d0e05","url":"fonts/jetbrains-mono-400-latin-ext.woff2"},{"revision":"de3b78e0765bdd856319000db0782d0b","url":"fonts/cormorant-700-latin.woff2"},{"revision":"a832f80eab1d8a02fbc608c808376daa","url":"fonts/cormorant-700-latin-ext.woff2"},{"revision":"75c6e2a160127edb2439c3399e11b5b4","url":"fonts/cormorant-500-latin.woff2"},{"revision":"7f5b725a4f5dd040c316dcceb847862a","url":"fonts/cormorant-500-latin-ext.woff2"},{"revision":"73d594f21aee312dedd233d7d9c2e4a3","url":"fonts/cormorant-400-latin.woff2"},{"revision":"3c9fc413a21d6e53b9b9bf2d63da43e2","url":"fonts/cormorant-400-latin-ext.woff2"},{"revision":"2b3e6c0978749b17b0dafb4fe4871907","url":"fonts/cormorant-400-italic-latin.woff2"},{"revision":"e38c2b4f0f3d32d1e975250f3f118eda","url":"fonts/cormorant-400-italic-latin-ext.woff2"},{"revision":"913493da239424233420afc32621d6b7","url":"drawings/"},{"revision":"70db93fd9d66feacc9da12679c3cfd51","url":"criando-aplicacao-web-com-nancy/"},{"revision":"ff8d2924e2b873f5a81ca23593483aac","url":"consumindo-datasnap-server-com-php/"},{"revision":"82a9168b1fb012482ae110fccd5fc642","url":"consumindo-datasnap-server-com-c-sharp/"},{"revision":"a1245917e717552999a80f9ba57182c4","url":"assets/xwing/xwing-miniatures.css"},{"revision":"eaedfd48192aad352352228696c806a6","url":"assets/images/og-default.png"},{"revision":"d9bf1d65204c64f2ae1d7558c5215ee2","url":"assets/images/logo.svg"},{"revision":"e78c95340fad58101e9a7df51754b711","url":"assets/images/favicon@512.png"},{"revision":"5f2ac6c2b1c3ed8564e769c19dbf59b6","url":"assets/images/favicon@256.png"},{"revision":"6b94b5d758fc98fa94852c79017a3b00","url":"assets/images/favicon@192.png"},{"revision":"6f8e3a8c63f26ccd1fd63cda45c31c86","url":"assets/images/favicon@128.png"},{"revision":"d9bf1d65204c64f2ae1d7558c5215ee2","url":"assets/images/favicon.svg"},{"revision":"54329adedbfb638502740444f9981d47","url":"assets/images/favicon.png"},{"revision":"6f906a86db944b6a81770387e165241b","url":"assets/images/x-wing/amg.png"},{"revision":"1dee6072a472826d7e37731cc6f2a765","url":"assets/icons/terminal-stroke.svg"},{"revision":"cb6092fe12afa0807ed331a718e0f606","url":"assets/icons/tech-stroke.svg"},{"revision":"79ce8c8ee80601b403889650116d71ba","url":"assets/icons/poem.svg"},{"revision":"4b903ed5f74dc291f3176c89c9c34899","url":"assets/icons/poem-stroke.svg"},{"revision":"dbec3e28ce27daa97071b92b7a957217","url":"assets/icons/link-external.svg"},{"revision":"3abc9bfd5f4582b2f3708646b6dcc8aa","url":"assets/icons/drawing-stroke.svg"},{"revision":"1604171e8a2d9c58f0a49c6886aa1e63","url":"assets/drawings/sample-rooftops.svg"}] || []);
var OFFLINE_URL = "/offline/";
registerRoute(({ request }) => request.mode === "navigate", new NetworkFirst({
	cacheName: "pages",
	networkTimeoutSeconds: 3,
	plugins: [new CacheableResponsePlugin({ statuses: [0, 200] }), new ExpirationPlugin({
		maxEntries: 50,
		maxAgeSeconds: 3600 * 24 * 30
	})]
}));
registerRoute(({ url }) => url.pathname.startsWith("/fonts/") && url.pathname.endsWith(".woff2"), new CacheFirst({
	cacheName: "fonts",
	plugins: [new CacheableResponsePlugin({ statuses: [0, 200] }), new ExpirationPlugin({
		maxEntries: 30,
		maxAgeSeconds: 3600 * 24 * 365
	})]
}));
registerRoute(({ url }) => url.pathname.startsWith("/assets/") && /\.(png|svg|jpe?g|webp|gif|ico)$/.test(url.pathname), new StaleWhileRevalidate({
	cacheName: "assets",
	plugins: [new CacheableResponsePlugin({ statuses: [0, 200] }), new ExpirationPlugin({
		maxEntries: 100,
		maxAgeSeconds: 3600 * 24 * 60
	})]
}));
setCatchHandler(async ({ request }) => {
	if (request.mode === "navigate") {
		const offline = await matchPrecache(OFFLINE_URL);
		if (offline) return offline;
	}
	return Response.error();
});
//#endregion
