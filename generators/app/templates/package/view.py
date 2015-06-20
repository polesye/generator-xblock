import os
import pkg_resources
from xblock.fragment import Fragment
from .utils import render_template

class ViewMixin(object):
    """
    Default views for the XBlock.
    """
    STATIC_ROOT = 'static'
    VIEW_DIR = None

    def url(filename):
        return os.path.join(self.STATIC_ROOT, self.VIEW_DIR, filename)

    def get_context(self, additional_context=None):
        context = {'self': self}
        if isinstance(additional_context, dict):
            context.update(additional_context);
        return context;
    }

    def render_template(self, template, context=None):
        return render_template(
            self.get_resource_string(template),
            self.get_context(context)
        )

    def get_resource_string(self, path):
        """
        Retrieve string contents for the file path.
        """
        resource_string = pkg_resources.resource_string(__name__, self.url(path))
        return resource_string.decode('utf8')

    def get_resource_url(self, path):
        """
        Retrieve a public URL for the file path.
        """
        resource_url = self.runtime.local_resource_url(self, self.url(path))
        return resource_url


class StudentViewMixin(ViewMixin):
    VIEW_DIR = 'student'
    def student_view(self, context=None):
        """
        Build the fragment for the default student view.
        """
        def url(filename):
            return os.path.join('student', filename)

        frag = Fragment(self.render_template('studio_view.html'))
        frag.add_css_url(self.get_resource_url('studio_view.min.css'))
        frag.add_javascript_url(self.get_resource_url('studio_view.min.js'))
        frag.initialize_js('<%= className %>View')
        return frag


class StudioViewMixin(ViewMixin):
    VIEW_DIR = 'studio'
    def studio_view(self, context=None):
        """
        Build the fragment for the studio view.
        Implementation is optional.
        """

        frag = Fragment(self.render_template('studio_edit.html'))
        frag.add_css_url(self.get_resource_url('studio_edit.min.css'))
        frag.add_javascript_url(self.get_resource_url('studio_edit.min.js'))
        frag.initialize_js('<%= className %>Edit')
        return frag
