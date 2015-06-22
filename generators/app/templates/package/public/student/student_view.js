'use strict';
var <%= className %>View = function(runtime, element) {
  this.element = element;
  this.runtime = runtime;
  this.initialize();
};

<%= className %>View.prototype = {
  initialize: function() {
    this.plugin = {};
    this.initializePlugins(<%= className %>View.plugins);
<% if (options.events) { %>
    // @TODO: Remove the events.emit below before start using the XBlock on
    // production. It's added just to show how to emit events.
    this.plugin.events.emit('xblock.<%= xblockName %>.initialized', {
      time: new Date()
    });<%
} %>
  },
  initializePlugins: function(plugins) {
    plugins.forEach(function(pluginInfo) {
      // Initialize each plugin and attach them to the `this.plugin`.
      this.plugin[pluginInfo.name] = pluginInfo.factory(
        this.runtime, this.element
      );
    }, this);
  }
};

<%= className %>View.plugins = [];
<%= className %>View.addPlugin = function(name, factory) {
  <%= className %>View.plugins.push({name: name, factory: factory});
};

<% if (options.events) { %><%= className %>View.addPlugin('events', require('./events').Events.factory);<% } %>
<% if (options.gradable) { %><%= className %>View.addPlugin('grade', require('./grade').Grade.factory);<% } %>

module.exports.<%= className %>View = window.<%= className %>View = <%= className %>View;
