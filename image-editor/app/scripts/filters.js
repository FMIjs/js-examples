this.addEventListener('message', function (e) {
  var data = e.data;
  this.postMessage(Filters[data.filter].call(null, data.pixels, data.parameters));
});

var Filters = {
  grayscale: grayscale,
  threshold: threshold,
  brightness: brightness,
  inverse: inverse
};

function grayscale(data) {
  var r, g, b;
  var temp = data;
  data = data.data;
  for (var i = 0; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = r * 0.1 + g * 0.8 + b * 0.1;
  }
  return temp;
}

function threshold(data) {
  var r, g, b, val;
  var temp = data;
  data = data.data;
  for (var i = 0; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    val = r * 0.1 + g * 0.8 + b * 0.1;
    data[i] = data[i + 1] = data[i + 2] = (val > 150) ? 255 : 0;
  }
  return temp;
}

function brightness(data, delta) {
  var temp = data;
  data = data.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i] += delta;
    data[i + 1] += delta;
    data[i + 2] += delta;
  }
  return temp;
}

function inverse(data) {
  var temp = data;
  data = data.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return temp;
}