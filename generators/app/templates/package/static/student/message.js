'use strict';
var $ = require('../vendor/jquery/dist/jquery.min');

var messageFactory = (function() {
  var proto = {
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

  return function(options) {
    var Message = function() {
      this.type = options.type || 'info';
      this.tagName = options.tagName || 'p';
      this.message = null;
    };
    Message.prototype = proto;
    return Message;
  };
})();

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
  'success': messageFactory({type: 'success'}),
  'error': messageFactory({type: 'error'}),
  'info': messageFactory({type: 'info'})
};

module.exports.MessageManager = MessageManager;
