(function() {

//
// filter 
// format check
// callback
//

var checkers = [];
var progress;

var Checker = function(elem, filt, fmt, cb, prog) {
  this.$domobj = $(elem);
  this.filter = filt;   // this will filter the input
  this.format = fmt;    // this checks the format of the filed
  this.cb = cb;     // this is a custom callbackl to apply
  this.checks = {
    fmt : !(this.format instanceof RegExp && this.format instanceof Function),
    cb : !(this.cb instanceof Function)
  };

  this.progress = prog;

  var self = this;

  // set the filter event

  if ( this.filter instanceof RegExp ) {
    this.$domobj.on('keyup', function(event) {
      var res = $(this).val().match(self.filter);
      if (res) $(this).val(res[0]);
    });
  } else if ( this.filter instanceof Function ) {
    this.$domobj.on('keyup', function(event) {
      self.filter.call(this, event);
    });
  }

  //

  if ( this.format instanceof RegExp ) {
    this.$domobj.on('keyup', function(event) {
      if ( self.format.test( $(this).val()) ) {
        self.checks.fmt = true;
      } else {
        self.checks.fmt = false;
      }
    });
  } else if  ( this.format instanceof Function ) {
    if ( self.format.call( this, self ) ) {
      self.checks.fmt = true;
    } else {
      self.checks.fmt = false;
    }
  }

  if ( self.cb instanceof Function ) {
    if (self.cb.call(this, event)) {
      self.checks.cb = true;
    } else
      self.checks.cb = false;
  }

  this.$domobj.on('keyup', function(event) {
    if (self.is_good()) {
      progress.change(self.progress, self.$domobj.attr('name'));
    } else {
      progress.change(0, self.$domobj.attr('name'));
    }
  });
};

Checker.prototype.is_good = function () {
  var self = this;
  return Object.keys(this.checks).every(function (k) {
    return self.checks[k];
  });
};


/////////////////////////////////////////////////

var Progress = function (pobj) {
  this.parts = {};
  this.$pobj = $(pobj);
};

Progress.prototype.change = function(val, what) {
  this.parts[what] = val;
  this.update();
};

Progress.prototype.update = function() {
  var t = this.total();
  this.$pobj.find('div').css({ width : t + '%' });
};

Progress.prototype.total = function() {
  var self = this;
  var pvals = Object.keys(self.parts).map(function(e) {
    return self.parts[e];
  });

  return pvals.reduce(function(a, b) {
    return a + b; });
};

/////////////////////////////////////////////////

function setCheckers() {

  $('#regform input[data-ftype=username]').each(function(i, e) {
    checkers[this.name] = new Checker(
      this,
      /([\w\d]+)/,
      /([\w\d]+)/,
      undefined,
      25
    );
  });

  $('#regform input[data-ftype=password]').each(function(i, e) {
    checkers[this.name] = new Checker(
      this,
      /([\w\d]+)/,
      /.{8,}/,
      undefined,
      25
    );
  });

  $('#regform input[data-ftype=nodigits]').each(function(i, e) {
    checkers[this.name] = new Checker(
      this,
      undefined,
      /[^\d]+/,
      undefined,
      25
    );
  });

}


$(document).ready(function () {
  progress = new Progress('div.progress');
  setCheckers();
});


})();