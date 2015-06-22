"""
Views for the XBlock.
"""
import os
import pkg_resources
from xblock.fragment import Fragment
from .utils import render_template


class ViewMixin(object):
    """
    View mixin for the XBlock.
    """
    STATIC_ROOT = '<%= STATIC_DIR_NAME %>'
    VIEW_ROOT = None

    def url(self, filename):
        """
        Returns an url relative to the VIEW_ROOT.
        """
        return os.path.join(self.STATIC_ROOT, self.VIEW_ROOT, filename)

    def get_context(self, additional_context=None):
        """
        Returns a context needed for the templates.
        """
        context = {'self': self}
        if isinstance(additional_context, dict):
            context.update(additional_context);
        return context;

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
    """
    Student View Mixin.
    """
    VIEW_ROOT = 'student'
    def student_view(self, context=None):
        """
        Build the fragment for the student view.
        """
        frag = Fragment(self.render_template('student_view.html'))
        frag.add_css_url(self.get_resource_url('student_view.css'))
        frag.add_javascript_url(self.get_resource_url('student_view.min.js'))
        frag.initialize_js('<%= className %>View')
        return frag


class StudioViewMixin(ViewMixin):
    """
    Studio View Mixin.
    """
    VIEW_ROOT = 'studio'
    def studio_view(self, context=None):
        """
        Build the fragment for the studio view.
        """
        frag = Fragment(self.render_template('studio_edit.html'))
        frag.add_css_url(self.get_resource_url('studio_edit.css'))
        frag.add_javascript_url(self.get_resource_url('studio_edit.min.js'))
        frag.initialize_js('<%= className %>Edit')
        return frag
