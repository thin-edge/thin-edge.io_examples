import argparse
import logging
from .thin_edge_client import SenseHatThinEdgeClient

def start():
    parser = argparse.ArgumentParser(description='Starting thin-edge.io SenseHat Demo')
    parser.add_argument('--interval', type=int, default=10, nargs='?', help='the interval the sensors will be read in seconds (default: 10)')
    parser.add_argument('--logo', type=argparse_bool, default=True, nargs='?', help='whether the logo should be shown while running (default: True)')
    args = parser.parse_args()

    logging.info('Started with interval: ' + str(args.interval) + ' and image: ' + str(args.logo))

    thinEdgeClient = SenseHatThinEdgeClient(args.interval, args.logo)
    thinEdgeClient.start()

def argparse_bool(val):
    if isinstance(val, bool):
       return val
    if val.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif val.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean expected.')

