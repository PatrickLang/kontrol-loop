#!/usr/bin/env python3

import pprint as pp
import re
import subprocess

connections = [ 
    {'in': 'KeyStep', 'out': 'Digitone'},
    {'in': 'Launch Control XL', 'out': 'Digitakt'}
]

pattern = r"client (\d*)\: '([\d\w\s]*)'"

devices = []

with subprocess.Popen(["aconnect", "-l"], stdout=subprocess.PIPE) as proc:
    while True:
        line = proc.stdout.readline()
        if not line:
            break
        line = line.decode()
        match = re.match(pattern, line)
        if match:
            print("device {}: {}".format(match.group(1),match.group(2)))
            devices.append({'id': match.group(1), 'name': match.group(2)})
        else:
            print("NOMATCH: " + line)

pp.pprint(devices)
for a in devices:
    for b in devices:
        for c in connections:
            if c['in'] in a['name'] and c['out'] in b['name']:
                print("connecting {} to {}".format(a['name'], b['name']))
                subprocess.call("aconnect {}:0 {}:0".format(a['id'],b['id']), shell=True)