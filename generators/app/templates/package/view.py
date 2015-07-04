"""
Views for the XBlock.
"""
import os
import copy
import json
import pkg_resources
from xblock.core import XBlock
from xblock.fragment import Fragment
from .utils import render_template


class ViewMixin(object):
    """
    View mixin for the XBlock.
    """
    def url(self, filename):
        """
        Returns an url relative to the VIEW_ROOT.
        """
        return os.path.join('<%= STATIC_DIR_NAME %>', os.path.normpath(filename))

    def get_context(self, *args):
        """
        Returns a context needed for the templates.
        """
        context = copy.deepcopy(self.fields)
        for arg in args:
            if isinstance(arg, dict):
                context.update(arg);

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
    def student_view(self, context=None):
        """
        Build the fragment for the student view.
        """
        frag = Fragment(self.render_template('student/student_view.html', self.get_context(context)))
        frag.add_css_url(self.get_resource_url('student/student_view.css'))
        frag.add_javascript_url(self.get_resource_url('student/student_view.min.js'))
        frag.initialize_js('<%= className %>View')
        return frag


FIELD_CONVERSIONS = {
    # 'display_name': json.dumps // for example.
    # 'display_name': lambda value: value + 'Xblock' // for example.
}


FIELD_SETTERS = {
    # 'display_name': def f(x, v): x.new_field = v // for example.
}


class StudioViewMixin(ViewMixin):
    """
    Studio View Mixin.
    """

    def studio_view(self, context=None):
        """
        Build the fragment for the studio view.
        """
        frag = Fragment(self.render_template('studio/studio_edit.html',
            self.get_context(context, {
                'metadata': self.editable_metadata_fields
            })
        ))
        frag.add_css_url(self.get_resource_url('studio/studio_edit.css'))
        frag.add_javascript_url(self.get_resource_url('studio/studio_edit.min.js'))
        frag.initialize_js('<%= className %>Edit')
        return frag

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Saves XBlock fields.
        Only fields in the editable_metadata_fields list will be save.
        If pre-save conversion is required (for instance, serialization/deserialization),
        FIELD_CONVERSIONS dict can be used (where key is a field name, value - function, that
        makes appropriate conversion).
        FIELD_SETTERS dict provides possibility to set custom saving logic (for instance,
        if some field needs to be saved under another name).
        """
        for key in data:
            if key in self.editable_metadata_fields:
                if key in FIELD_CONVERSIONS:
                    value = FIELD_CONVERSIONS[key](data[key])
                else:
                    value = data[key]

                if key in FIELD_SETTERS:
                    FIELD_SETTERS[key](self, value)
                else:
                    setattr(self, key, value)
            # @TODO: add a debug logger for the `else` case

        return {'result': 'success'}
