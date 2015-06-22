"""Setup for <%= xblockName %>."""
import os
import subprocess
import setuptools
from setuptools.command.install import install


def package_data(pkg, roots):
    """
    Generic function to find package_data.
    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.
    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


class BundleInstallCommand(install):
    """Bundle assets before installation"""
    def run(self):
        subprocess.call(['npm', 'install'])
        install.run(self)


setuptools.setup(
    name='xblock-<%= xblockName %>',
    version='0.1.0',
    description='<%= description %>',
    license='MIT',
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
        '<%= pkg %>': '<%= pkg %>',
    },
    package_data=package_data('<%= pkg %>', ['<%= STATIC_DIR_NAME %>']),
    cmdclass={'install': BundleInstallCommand}
)
