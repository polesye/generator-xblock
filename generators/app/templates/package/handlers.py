"""
Handlers for the XBlock.
"""
from xblock.core import XBlock


class HandlersMixin(object):
    """
    Contains all general handlers.
    """
    FIELDS_ACCEPTED_TO_SAVE = ['display_name']
    FIELD_CONVERSIONS = {
        # 'display_name': json.dumps // for example.
        # 'display_name': lambda value: value + 'Xblock' // for example.
    }
    FIELD_SETTERS = {
        # 'display_name': lambda x, v: x.new_field = v // for example.
    }

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Saves XBlock fields.
        Only fields in the FIELDS_ACCEPTED_TO_SAVE list will be save.
        If pre-save conversion is required (for instance, serialization/deserialization),
        FIELD_CONVERSIONS dict can be used (where key is a field name, value - function, that
        makes appropriate conversion).
        FIELD_SETTERS dict provides possibility to set custom saving logic (for instance,
        if some field needs to be saved under another name).
        """
        for key in data:
            if key in self.FIELDS_ACCEPTED_TO_SAVE:
                if key in self.FIELD_CONVERSIONS:
                    value = self.FIELD_CONVERSIONS[key](data[key])
                else:
                    value = data[key]

                if key in self.FIELD_SETTERS:
                    self.FIELD_SETTERS[key](self, value)
                else:
                    setattr(self, key, value)
            # @TODO: add a debug logger for the `else` case

        return {'result': 'success'}
