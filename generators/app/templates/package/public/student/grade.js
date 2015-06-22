'use strict';
var $ = window.jQuery || window.$;
var MessageManager = require('./message').MessageManager;

var sendRequest = function(url, options) {
  options = $.extend({
      'type': 'POST',
      'async': true
  }, options);

  return $.ajax(url, options);
};

var Grade = function(element, options) {
  this.element = element;
  this.url = options.url;
  this.message = options.message;
  this.initialize();
};

Grade.prototype = {
  initialize: function() {
    this.bindHandlers();
  },
  bindHandlers: function() {
    $(this.element)
      .on('click.<%= className %>', '.btn-primary', this.onSubmit.bind(this));
  },
  submit: function(data) {
    var options = {
        data: JSON.stringify(data),
        success: this.onSuccess.bind(this),
        error: this.onError.bind(this)
      };

    return sendRequest(this.url, options);
  },
  onSuccess: function(data) {
    this.message.show(data.result, data.msg);
  },
  onError: function(jqXhr, textStatus, errorThrown) {
    this.message.show('error', errorThrown);
  },
  onSubmit: function() {
    var data = {};
    this.submit(data);
    return false;
  }
};

Grade.factory = function(runtime, element) {
  return new Grade(element, {
    url: runtime.handlerUrl(element, 'student_submit'),
    message: new MessageManager($('.msg-holder', element))
  });
};

module.exports.Grade = Grade;
