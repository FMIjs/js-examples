(function () {


  // var pubsub = {};
  // (function () {
  //   var topics = {};
  //   pubsub.publish = function (evnt, data) {
  //     var callbacks = topics[evnt] || [];
  //     callbacks.forEach(function (c) {
  //       c.call(null, data);
  //     });
  //   };
  //   pubsub.subscribe = function (evnt, callback) {
  //     topics[evnt] = topics[evnt] || [];
  //     topics[evnt].push(callback);
  //   };
  // }(pubsub));

  function $(el, selector) {
    return el.querySelectorAll(selector);
  }

  function App(root) {
    this.root = root;
    this.editor = null;
  }
  App.prototype.addHandlers = function () {
    var root = this.root,
        self = this;
    $(root, 'form')[0].onsubmit = function (e) {
      var file = $(root, 'input[type="file"]')[0].files[0],
          reader = new FileReader(),
          image;
      reader.onload = function (e) {
        self.initializeEditor(e.target.result);
      };
      reader.readAsDataURL(file);
      e.preventDefault();
      return false;
    };
    $(root, 'input[type="range"]')[0].onchange = function () {
      self.editor.applyFilter('brightness', this.value);
    };
    var list = Array.prototype.slice.call($(root, '.filter-button'));
    list.forEach(function (btn) {
      btn.onclick = function () {
        if (self.editor) {
          self.editor.applyFilter(btn.getAttribute('data-filter'));
        }
      };
    });
  };

  App.prototype.initializeEditor = function (b64Image) {
    var img = document.createElement('img'),
        self = this;
    img.onload = function () {
      self.editor = new ImageEditor(this, $(self.root, '.editor-root')[0]);
      self.editor.init();
    };
    img.src = b64Image;
  };

  function ImageEditor(image, parent) {
    this.worker = new Worker('scripts/filters.js');
    this.image = image;
    this.parent = parent;
    this.canvas = null;
    this.context = null;
  }

  ImageEditor.prototype.init = function () {
    this.canvas = document.createElement('canvas');
    this.parent.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.context.drawImage(this.image, 0, 0);
    var c = this.context;
    this.worker.addEventListener('message', function (e) {
      var data = e.data;
      c.putImageData(data, 0, 0);
    });
  };

  ImageEditor.prototype.applyFilter = function (filter, parameters) {
    var pixels = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.worker.postMessage({
      pixels: pixels,
      filter: filter,
      parameters: parameters
    });
  };

  new App($(document, '#root')[0]).addHandlers();
}());