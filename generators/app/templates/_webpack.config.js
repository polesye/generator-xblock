var path = require('path');
module.exports = {
  entry: {
    'studio/studio_edit': path.join(
      __dirname, '<%= pkg %>', '<%= STATIC_DIR_NAME %>', 'studio', 'studio_edit.js'
    ),
    'student/student_view': path.join(
      __dirname, '<%= pkg %>', '<%= STATIC_DIR_NAME %>', 'student', 'student_view.js'
    ),
  },
  output: {
    path: path.join(__dirname, '<%= pkg %>', '<%= STATIC_DIR_NAME %>'),
    filename: '[name].min.js'
  }
};
