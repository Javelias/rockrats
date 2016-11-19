var jsStringEscape = require('js-string-escape');
var replaceall = require("replaceall");
var reqLib = require("request");
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/archive'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/eddb-bodies', function(request, response) {
  getEddbBodies(request.params.id, request, response);
});

app.get('/wiki', function(request, response) {
  response.render('wiki');
});

function getEddbBodies(myid, req, res) {
  var headers, options;

  // Set the headers
  headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  }

  // Configure the request
  options = {
    url: 'https://eddb.io/archive/v5/bodies.json',
    method: 'GET',
    headers: headers,
    qs: {'id': myid}
  }

  // Start the request
  reqLib(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
		var newJsonStr = "[";
		var jsonObj = JSON.parse(body);
		for(var i = 1; i <= jsonObj.length; i++) {
			newJsonStr += "{";
			var data = jsonObj[i];
			for(var j = 1; j <= data.materials.length; j++) {
				var matData = data.materials[j];
				if (matData["material_name"] == "Iron") {
					newJsonStr += "\"material_name\": \"" + matData["share"] + "\\\"\",";
				} else if () {
					
				}
				
			}
			if (i < jsonObj.length-1) {
				newJsonStr += ",";
			}
			newJsonStr += "}";
		}
		res.send(newJsonStr + "]");
    } else {
      console.log(error);
    }
  });
};

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


