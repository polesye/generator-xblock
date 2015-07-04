"""
Utils for the XBlock.
"""
from jinja2 import Template


def render_template(template, context):
    """
    Renders a `template` using `context`.
    """
    return Template(template).render(**context)
