'use strict';
var $ = window.jQuery || window.$;

var <%= className %>Edit = function(runtime, element) {
  this.element = element;
  this.runtime = runtime;
  this.initialize();
};

<%= className %>Edit.prototype = {
  initialize: function() {
    this.url = this.runtime.handlerUrl(this.element, 'studio_view_save');
    this.bindHandlers();
  },
  bindHandlers: function() {
    $(this.element)
      .on('click.<%= className %>', '.save-button', this.save.bind(this))
      .on('click.<%= className %>', '.cancel-button', this.cancel.bind(this));
  },
  unBindHandlers: function() {
    $(this.element).off('.<%= className %>');
  },
  save: function() {
    this.runtime.notify('save', {state: 'start'});
    $.ajax(this.url, {
      type: 'POST',
      data: JSON.stringify({
        // @TODO: Add entries here for each field to be saved
        'name': $('#xblock-<%= viewClassName %>-name').val(),
      }),
      success: this.onSuccess.bind(this),
      error: this.onError.bind(this)
    });
    return false;
  },
  cancel: function() {
    this.runtime.notify('cancel', {});
    return false;
  },
  onSuccess: function() {
    this.runtime.notify('save', {state: 'end'});
  },
  onError: function() {
    this.runtime.notify('error', {});
  }
};

module.exports.<%= className %>Edit = window.<%= className %>Edit = <%= className %>Edit;
