"""
Gradding mixin for the XBlock.
"""
from xblock.core import XBlock
from xblock.fields import Scope, Float


class GradeMixin(object):
    "Adds grading support."
    weight = Float(
        display_name="Weight",
        help="The maximum score that the user receives when the problem is successfully completed.",
        scope=Scope.settings,
        default=<%= weight %>
    )
    has_score = True

    @XBlock.json_handler
    def student_submit(self, data, suffix=''):
        """
        Grading handler for the XBlock.
        """
        is_correct = True
        # TODO: Add your logic here.

        # publish a grading event when student completes
        try:
            self.runtime.publish(self, 'grade', {
                'value': self.weight,
                'max_value': self.weight,
            })
        except NotImplementedError:
            # Note, this publish method is unimplemented in Studio runtimes, so
            # we have to figure that we're running in Studio for now
            pass
        if is_correct:
            return {'result': 'success', 'msg': 'Congratulations!'}
        else:
            return {'result': 'failure', 'msg': 'Sorry, but your answer is wrong.'}
