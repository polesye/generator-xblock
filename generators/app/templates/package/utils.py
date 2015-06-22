"""
Utils for the XBlock.
"""

def render_template(template, context):
    """
    Renders a `template` using `context`.
    """
    return template.format(**context)
