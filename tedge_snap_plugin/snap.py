#!/usr/bin/env python3

import csv
import subprocess
import sys

import click

'''
Agent https://thin-edge.github.io/thin-edge.io-specs/software-management/sm-agent.html
Plugin How to Write Guide https://thin-edge.github.io/thin-edge.io/html/tutorials/write-my-software-management-plugin.html

Exit status
The exit status of plugins are interpreted by agent as follows:

0: success.
1: usage. The command arguments cannot be interpreted, and the command has not been launched.
2: failure. The command failed and there is no point to retry.
3: retry. The command failed but might be successful later (for instance, when the network will be back).

Assumptions:
* Device has installed and configured `snap`.
* thin-edge.io is deployed on the device and configured.

'''


@click.group()
def cli():
    pass


@click.command(name="list")
def list_cli():
    '''
    The most basic command supported by sm plugins is `list` command.
    Command is used to recognise plugin as well as to list current list of software packages installed using this plugin.
    For `snap` the following interface could be used: `snap list` as per https://snapcraft.io/docs/getting-started.
    The agent expects the plugin to return the list as `tab (\t)` separated values on stdout.

    API spec: https://thin-edge.github.io/thin-edge.io-specs/software-management/plugin-api.html#the-list-command

    snap list stdout:
    Name   Version    Rev    Tracking       Publisher   Notes
    core   16-2.54.2  12600  latest/stable  canonical✓  core


    Agent expected:
    `core    16-2.54.2`
    '''

    proc = subprocess.run(
        ['snap', 'list'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )

    if proc.returncode != 0:
        sys.exit(2)

    snaps = csv.DictReader(proc.stdout.splitlines(), delimiter=' ', lineterminator='\n')
    for snap in snaps:
        print(f'{snap["Name"]}\t{snap["Version"]}')


@click.command()
@click.argument('name')
@click.option('--version', required=False)
@click.option('--file', type=click.Path(exists=True), required=False)
def install(name: str, _version: str, _file: str):
    '''
    Another important capability of a plugin is `install` command.
    Plugin API defines that the command should take 1 parameter and support 2 optional:
    `name` -> name of the package to be installed
    `--version` -> to specify which version of the package should be installed
    `--file` -> allows to use downloaded files if remote location to be used

    https://thin-edge.github.io/thin-edge.io-specs/software-management/plugin-api.html#the-install-command

    `snap` supports automatic version selection from the channel, meaning that in our basic implementation we will just use the `name` of the package.

    ./snap install hello
    '''
    proc = subprocess.run(
        ['snap', 'install', f'{name}'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )

    if proc.returncode != 0:
        sys.exit(2)


@click.command()
@click.argument('name')
@click.option('--version', required=False)
def remove(name: str, version: str,):
    '''
    The remove command serves the purpose of removing software from our device.
    Similar to install command it requires a `name` of the package to be removed.
    https://thin-edge.github.io/thin-edge.io-specs/software-management/plugin-api.html#the-remove-command

    `snap`'s `remove` command can be used to uninstall command form the device.
    We use `--purge` switch to force full removal of the `snap` resources.

    '''
    proc = subprocess.run(
        ['snap', 'remove', f'{name}', '--purge'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )

    if proc.returncode != 0:
        sys.exit(2)


@click.command()
def update_list():
    '''
    Per Plugin API the `update list` command would be the default operation called, as `snap` doesn't support install and remove in a single command.
    To signify that we are going to return exit code `1` so the alternative option is going to be used.
    https://thin-edge.github.io/thin-edge.io-specs/software-management/plugin-api.html#input-output-and-errors
    '''

    sys.exit(1)


@click.command()
def prepare():
    proc = subprocess.run(
        ['snap', 'refresh'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )

    if proc.returncode != 0:
        sys.exit(2)


@click.command()
def finalize():
    pass


cli.add_command(cmd=list_cli)
cli.add_command(cmd=prepare)
cli.add_command(cmd=install)
cli.add_command(cmd=update_list)
cli.add_command(cmd=remove)
cli.add_command(cmd=finalize)


if __name__ == '__main__':
    cli()
