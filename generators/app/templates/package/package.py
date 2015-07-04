"""
This is the core logic for the <%= className %>
"""
from xblock.core import XBlock
from xblock.fields import Scope, String

from .handlers import HandlersMixin
from .view import StudentViewMixin, StudioViewMixin
<% if (options.events) { %>from .events import EventsMixin<% } %>
<% if (options.gradable) { %>from .grade import GradeMixin<% } %>
<%
    mixins = ['HandlersMixin', 'StudentViewMixin', 'StudioViewMixin'];
    if (options.events) mixins.push('EventsMixin')
    if (options.gradable) mixins.push('GradeMixin')
%>

class <%= className %>(XBlock, <%= mixins.join(', ') %>):
    """
    <%= description %>
    """
    display_name=String(
        display_name="Display Name",
        help="This name appears in the horizontal navigation at the top of the page.",
        scope=Scope.settings,
        default="<%= className %>"
    )
    <% if (options.gradable) {%>
    has_score = True

    def get_score(self):
        return self.weight

    def max_score(self):
        return self.weight
    <% } %>
    @staticmethod
    def workbench_scenarios():
        """
        Gather scenarios to be displayed in the workbench
        """
        return [(
            '<%= className %>',
            """<vertical_demo>
                    <<%= pkg %> />
                </vertical_demo>
            """
        )]
