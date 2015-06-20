from xblock.core import XBlock


class GradeMixin(object):
    "Provides grade support."
    weight = Float(
        display_name="Weight",
        help="This is the maximum score that the user receives when he/she successfully completes the problem",
        scope=Scope.settings,
        default=<%= weight %>
    )
    has_score = True

    @XBlock.json_handler
    def student_submit(self, data, suffix=''):
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
            return {'result': 'success', 'msg': 'Congutilations!'}
        else:
            return {'result': 'failure', 'msg': 'Sorry, but you answer is wrong.'}
        return {'result':'success'}
