"""Setup for <%= xblockName %>."""

import os
import setuptools

def package_data(pkg, roots):
    """Generic function to find package_data.
    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.
    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}

setuptools.setup(
    name='xblock-<%= xblockName %>',
    version='0.1.0',
    description='<%= description %>',
    license='AGPL-3.0',
    packages=['<%= pkg %>'],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            '<%= pkg %> = <%= pkg %>:<%= className %>',
        ],
    },
    package_dir={
        '<%= pkg %>': '<%= className %>',
    },
    package_data={
        "<%= pkg %>": package_data('<%= pkg %>', ['static']),
    },
    classifiers=[
        # https://pypi.python.org/pypi?%3Aaction=list_classifiers
        'Intended Audience :: Developers',
        'Intended Audience :: Education',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Operating System :: OS Independent',
        'Programming Language :: JavaScript',
        'Programming Language :: Python',
        'Topic :: Education',
        'Topic :: Internet :: WWW/HTTP',
    ],
)
