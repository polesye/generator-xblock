'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('Xblock') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'xblockName',
      message: 'Short name:',
      default: 'base'
    },
    {
      type: 'input',
      name: 'description',
      message: 'XBlock description:',
      default: 'It is a basic XBlock.'
    },
    {
      type: 'checkbox',
      name: 'options',
      choices: [
        {name: 'Gradable'},
        {name: 'Events'}
      ],
      message: 'Features:',
      filter: function(choices) {
        return choices.map(function(value) {
          return value.toLowerCase();
        });
      }
    },
    {
      type: 'input',
      name: 'weight',
      message: 'Default weight:',
      default: '1',
      validate: function(value) {
        var n = parseFloat(value);
        return (isFinite(n) && n > 0) ? true : 'Weight must be a number greater than 0.';
      },
      when: function(props) {
        return props.options.indexOf('gradable') > -1;
      }
    }];

    this.prompt(prompts, function(props) {
      this.props = props;
      this.props.viewClassName = s.trim(s.dasherize(props.xblockName), '-');
      this.props.className = s.classify(props.xblockName) + 'XBlock';
      this.props.pkg = s.underscored(props.xblockName);
      props.options.forEach(function(value) {
        this.props.options[value] = true;
      }, this);
      this.props._ = s;
      this.props.STATIC_DIR_NAME = 'public';
      done();
    }.bind(this));
  },

  _copyTpl: function(src, dst) {
    this.fs.copyTpl(
      this.templatePath(src), this.destinationPath(dst), this.props
    );
  },

  _bulkCopyTpl: function(items, src, dst) {
    items.forEach(function(item) {
      var from, to;
      if (util.isFunction(item.when) && !item.when()) return false;
      if (util.isObject(item)) {
        from = item.name;
        to = item.renameTo || item.name;
      } else {
        from = to = item;
      }
      this._copyTpl(
        path.join.apply(path, [src || '', from]),
        path.join.apply(path, [dst || '', to])
      );
    }, this);
  },

  _copy: function(src, dst) {
    this.fs.copy(this.templatePath(src), this.destinationPath(dst));
  },

  writing: {
    app: function() {
      this._bulkCopyTpl([
        {name: '_requirements.txt', renameTo: 'requirements.txt'},
        {name: '_package.json', renameTo: 'package.json'},
        {name: '_bower.json', renameTo: 'bower.json'},
        {name: '_webpack.config.js', renameTo: 'webpack.config.js'}
      ]);
    },

    projectfiles: function() {
      this._copy('editorconfig', '.editorconfig');
      this._copy('jshintrc', '.jshintrc');
      this._copy('travis.yml', '.travis.yml');
      this._bulkCopyTpl(['README.md', {name: 'bowerrc', renameTo: '.bowerrc'}]);
    },

    scriptfiles: function() {
      this._bulkCopyTpl(['watch', 'build'], 'scripts', 'scripts');
    },

    package: function() {
      var options = this.props.options;

      this._copyTpl('_setup.py', 'setup.py');
      this._bulkCopyTpl([
        '__init__.py', 'handlers.py', 'view.py', 'utils.py', 'fields.py',
        {name: 'package.py', renameTo: this.props.pkg + '.py'},
        {name: 'events.py', when: function() { return options.events; }},
        {name: 'grade.py', when: function() { return options.gradable; }}
      ], 'package', this.props.pkg);
    },

    staticfiles: function() {
      var props = this.props,
          STUDENT_SRC = path.join('package', props.STATIC_DIR_NAME, 'student'),
          STUDENT_DST = path.join(props.pkg, props.STATIC_DIR_NAME, 'student'),
          STUDIO_SRC = path.join('package', props.STATIC_DIR_NAME, 'studio'),
          STUDIO_DST = path.join(props.pkg, props.STATIC_DIR_NAME, 'studio'),
          options = this.props.options;

      this._bulkCopyTpl([
        'student_view.html', 'student_view.js', 'student_view.styl',
        {name: 'events.js', when: function() { return options.events; }},
        {name: 'grade.js', when: function() { return options.gradable; }},
        {name: 'message.js', when: function() { return options.gradable; }}
      ], STUDENT_SRC, STUDENT_DST);

      this._bulkCopyTpl([
        'studio_edit.html', 'studio_edit.js', 'studio_edit.styl'
      ], STUDIO_SRC, STUDIO_DST);
    }
  },

  install: function() {
    this.npmInstall();
  }
});
