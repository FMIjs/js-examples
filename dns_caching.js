var dns = require('dns');
var cache = {};

var original_lookup = dns.lookup;
dns.lookup = function (domain, family, callback) {
    if (!callback) {
        callback = family;
        family = null;
    }

    if (cache[domain]) {
        if (family) {
            var address = cache[domain], 
        }
        callback(undefined, 
    }
}
