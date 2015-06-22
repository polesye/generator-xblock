'use strict';
var $ = window.jQuery || window.$;

var Message = function(options) {
  this.type = options.type || 'info';
  this.tagName = options.tagName || 'div';
  this.message = null;
};

Message.prototype = {
  display: function(element, text) {
    this.message = $('<' + this.tagName + '/>', {
      'class': this.getClassName(),
      'text': text
    });
    $(element).html(this.message);
  },
  destroy: function() {
    this.message.remove();
    this.message = null;
  },
  getClassName: function() {
    return 'is-' + this.type;
  }
};

Message.factory = function(options) {
  return new Message(options);
};

var MessageManager = function(element) {
  this.element = $(element);
  this.message = null;
};

MessageManager.prototype = {
  show: function(type, text) {
    var message = MessageManager.TYPES[type];
    if (message) {
      this.hide(); // hide previous message.
      message.display(this.element, text);
      this.message = message;
    }
  },
  hide: function() {
    if (this.message) {
      this.message.destroy();
    }
  }
};

MessageManager.TYPES = {
  'success': Message.factory({type: 'success'}),
  'failure': Message.factory({type: 'failure'}),
  'error': Message.factory({type: 'error'}),
  'info': Message.factory({type: 'info'})
};

module.exports.MessageManager = MessageManager;
