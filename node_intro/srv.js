var http = require('http'),
    url = require('url');

var server = http.createServer(function (request, response) {
    var url_data = url.parse(request.url, true);
    console.log(request.url);
    console.log(url_data);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Добрутру!');
    response.end()
});
