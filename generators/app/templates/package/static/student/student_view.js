'use strict';
var $ = require('../vendor/jquery/dist/jquery.min');

var <%= className %>View = function(runtime, element) {
  this.element = element;
  this.runtime = runtime;
};
<% if (options.gradable) { %>
var MessageManager = require('./message');
<%= className %>View.prototype = {
  initialize: function() {
    this.buttonSubmit = $('.btn-primary', this.element);
    this.message = new MessageManager($('.msg-holder', this.element));
    this.bindHandlers();
  },
  bindHandlers: function() {
    this.buttonSubmit.on('click.<%= className %>', this.submit.bind(this));
  },
  unBindHandlers: function() {
    this.buttonSubmit.off('.<%= className %>');
  },
  submit: function() {
    var url = this.runtime.handlerUrl(this.element, 'student_submit');
    $.ajax(url, {
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
        // @TODO: Add entries here for each field to be saved
        'name': $('#xblock-<%= viewClassName %>-name').val(),
      }),
      success: function(data) {
        var types = {success: 'success', failure: 'error'};
        this.message.show(types[data.result], data.msg);
      }.bind(this),
      error: function(jqXhr, textStatus, errorThrown) {
        this.message.show('error', errorThrown);
      }.bind(this)
    });
    return false;
  }
};
<% } %>

module.exports.<%= className %>View = window.<%= className %>View = <%= className %>View;
