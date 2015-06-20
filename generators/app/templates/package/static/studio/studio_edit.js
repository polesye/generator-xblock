'use strict';
var $ = require('../vendor/jquery/dist/jquery.min');

var <%= className %>Edit = function(runtime, element) {
  this.element = element;
  this.runtime = runtime;
};

<%= className %>Edit.prototype = {
  initialize: function() {
    this.buttonSave = $('.save-button', this.element);
    this.buttonCancel = $('.cancel-button', this.element);
    this.url = this.runtime.handlerUrl(this.element, 'studio_view_save');
    this.bindHandlers();
  },
  bindHandlers: function() {
    this.buttonSave.on('click.<%= className %>', this.cancel.save(this));
    this.buttonCancel.on('click.<%= className %>', this.cancel.bind(this));
  },
  unBindHandlers: function() {
    this.buttonSave.off('.<%= className %>');
    this.buttonCancel.off('.<%= className %>');
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
