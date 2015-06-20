def baseRenderer(template, context):
    return template.format(**context)

def render_template(template, context, renderer=baseRenderer):
    return renderer(template, context)
