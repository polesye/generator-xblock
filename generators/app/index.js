'use strict';
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

  _copy: function(src, dst) {
    this.fs.copy(this.templatePath(src), this.destinationPath(dst));
  },

  writing: {
    app: function() {
      this._copyTpl('_requirements.txt', 'requirements.txt');
      this._copyTpl('_package.json', 'package.json');
      this._copyTpl('_bower.json', 'bower.json');
      this._copyTpl('_webpack.config.js', 'webpack.config.js');
    },

    projectfiles: function() {
      this._copy('editorconfig', '.editorconfig');
      this._copy('jshintrc', '.jshintrc');
      this._copy('travis.yml', '.travis.yml');
      this._copyTpl('bowerrc', '.bowerrc');
      this._copyTpl('README.md', 'README.md');
      this._copyTpl(
        path.join('scripts', 'watch'), path.join('scripts', 'watch')
      );
      this._copyTpl(
        path.join('scripts', 'build'), path.join('scripts', 'build')
      );
    },

    package: function() {
      var SRC_STATIC_ROOT = 'package',
          DEST_STATIC_ROOT = this.props.pkg,
          files = ['__init__.py', 'handlers.py', 'view.py', 'utils.py'];

      this._copyTpl('_setup.py', 'setup.py');
      this._copyTpl(
        path.join(SRC_STATIC_ROOT, 'package.py'),
        path.join(DEST_STATIC_ROOT, this.props.pkg + '.py')
      );

      if (this.props.options.events) files.push('events.py');
      if (this.props.options.gradable) files.push('grade.py');

      files.forEach(function(o) {
        this._copyTpl(
          path.join.apply(path, [SRC_STATIC_ROOT, o]),
          path.join.apply(path, [DEST_STATIC_ROOT, o])
        );
      }, this);
    },

    staticfiles: function() {
      var props = this.props,
          SRC_STATIC_ROOT = path.join('package', props.STATIC_DIR_NAME),
          DEST_STATIC_ROOT = path.join(props.pkg, props.STATIC_DIR_NAME),
          files = [
            ['student', 'student_view.html'],
            ['student', 'student_view.js'],
            ['student', 'student_view.styl'],

            ['studio', 'studio_edit.html'],
            ['studio', 'studio_edit.js'],
            ['studio', 'studio_edit.styl'],
          ];


      if (this.props.options.gradable) files.push(['student', 'message.js']);

      files.forEach(function(o) {
        this._copyTpl(
          path.join.apply(path, [SRC_STATIC_ROOT].concat(o)),
          path.join.apply(path, [DEST_STATIC_ROOT].concat(o))
        );
      }, this);
    }
  },

  install: function() {
    this.npmInstall();
  }
});
