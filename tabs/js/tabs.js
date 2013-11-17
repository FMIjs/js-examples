;(function () {

  'use strict';

  function Tabs(root) {
    this.selected = 0;
    this._uid = Math.round(Math.random() * 1000) + '' + new Date().getTime();
    this.root = root;
    this.refresh();
  }

  Tabs.prototype.refresh = function () {
    this._ul = this.root.children('ul').first();
    this._lis = this._ul.children();
    this._contents = this.root.children('div');
    this.destroy();
    this.addClasses(this.root);
    this.addHandlers();
    this.select(0);
    this.root.data('tabs', this);
  };

  Tabs.prototype.select = function (idx) {
    this._lis.removeClass('awesome-tab-item-selected');
    $(this._lis[idx]).addClass('awesome-tab-item-selected');
    this._contents.addClass('awesome-tab-content-hidden');
    $(this._contents[idx]).removeClass('awesome-tab-content-hidden');
  };

  Tabs.prototype.addHandlers = function () {
    var self = this;
    this._lis.on('click.tabs-' + this._uid, function () {
      var item = -1,
          li = this;
      self._lis.each(function (idx) {
        if (this === li) {
          item = idx;
          return;
        }
      });
      self.select(item);
    });
  };

  Tabs.prototype.destroy = function () {
    this._lis.off('click.tabs-' + this._uid);
    this.root.addClass('awesome-tab');
    this._lis.removeClass('awesome-tab-item-selected');
    this._lis.removeClass('awesome-tab-item');
    this._contents.removeClass('awesome-tab-content');
    this._contents.removeClass('awesome-tab-content-hidden');
    this.root.removeData('tabs');
  };

  Tabs.prototype.addClasses = function (elem) {
    this._lis.addClass('awesome-tab-item');
    this._ul.addClass('awesome-tab-items-wrapper');
    this._contents.addClass('awesome-tab-content');
    elem.addClass('awesome-tab');
  };

  $.fn.tabs = function (method) {
    var tabs = this.data('tabs');
    if (tabs) {
      if (typeof tabs[method] === 'function') {
        tabs[method].call(tabs, Array.prototype.slice.call(arguments, 1));
      }
    } else {
      new Tabs(this);
    }
  };

}());

$('#tabs').tabs();
$('#tabs').tabs('select', 1);