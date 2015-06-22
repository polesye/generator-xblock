'use strict';
var $ = window.jQuery || window.$;
<% if (options.gradable) { %>
var MessageManager = require('./message').MessageManager;
<% } %>

var <%= className %>View = function(runtime, element) {
  this.element = element;
  this.runtime = runtime;
  this.initialize();
};

<%= className %>View.prototype = {
  initialize: function() {
    <% if (options.gradable) { %>
    this.message = new MessageManager($('.msg-holder', this.element));
    <% } %>
    this.bindHandlers();
  },
  bindHandlers: function() {
    <% if (options.gradable) { %>
    $(this.element)
      .on('click.<%= className %>', '.btn-primary', this.submit.bind(this));
    <% } %>
  },
  <% if (options.gradable) { %>
  submit: function() {
    var url = this.runtime.handlerUrl(this.element, 'student_submit');
    $.ajax(url, {
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({}),
      success: function(data) {
        var types = {success: 'success', failure: 'error'};
        this.message.show(types[data.result], data.msg);
      }.bind(this),
      error: function(jqXhr, textStatus, errorThrown) {
        this.message.show('error', errorThrown);
      }.bind(this)
    });
    return false;
  },
  <% } %>
  unBindHandlers: function() {
    $(this.element).off('.<%= className %>');
  }
};

module.exports.<%= className %>View = window.<%= className %>View = <%= className %>View;
