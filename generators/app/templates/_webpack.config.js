var path = require('path');
module.exports = {
  entry: {
    'studio/studio_edit': path.join(__dirname, '<%= pkg %>', 'static', 'studio', 'studio_edit.js'),
    'student/student_view': path.join(__dirname, '<%= pkg %>', 'static', 'student', 'student_view.js'),
  },
  output: {
    path: path.join(__dirname, '<%= pkg %>', 'static'),
    filename: '[name].min.js'
  }
};
