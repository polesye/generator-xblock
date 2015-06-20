from xblock.core import XBlock

class HandlersMixin(object):
    FIELD_ACCEPTED = ['display_name']
    FIELD_CONVERSIONS = {
        # 'display_name': json.dumps // for example.
    }
    FIELD_SETTERS = {
        # 'display_name': lambda x, v: x.new_field = v // for example.
    }

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Save XBlock fields.
        """
        for key in data:
            if key in self.FIELD_ACCEPTED:
                if key in self.FIELD_CONVERSIONS:
                    value = self.FIELD_CONVERSIONS[key](data[key])
                else:
                    value = data[key]

                if key in self.FIELD_SETTERS:
                    self.FIELD_SETTERS[key](self, value)
                else:
                    setattr(self, key, value)

        return {'result': 'success'}
