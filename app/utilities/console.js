var basic = console.log;

var preMiddlewares = [];
var postMiddlewares = [];

/*console.log = function () {
	if (arguments.length > 1) {
		basic.apply(console,arguments);
		return;
	}
	for (i = 0; i < preMiddlewares.length; i++) {
		preMiddlewares[i]();
	}
	basic.apply(console,arguments);
	for (i = 0; i < postMiddlewares.length; i++) {
		postMiddlewares[i]();
	}
})*/

console.pre = function (middlewareFn) {
	preMiddlewares.push(middlewareFn);
}

console.post = function (middlewareFn) {
	postMiddlewares.push(middlewareFn);
}