'use strict';
var $ = window.jQuery || window.$;

var sendRequest = function(url, options) {
  options = $.extend({
      'type': 'POST',
      'async': true
  }, options);

  return $.ajax(url, options);
};

var Events = function(url) {
  this.url = url;
};

Events.prototype = {
  emit: function(eventType, data) {
    data = $.extend({}, data, {'event_type': eventType});
    return sendRequest(this.url, {
      data: JSON.stringify(data)
    });
  }
};

Events.factory = function(runtime, element) {
  var url = runtime.handlerUrl(element, 'publish_event');
  return new Events(url);
};

module.exports.Events = Events;
