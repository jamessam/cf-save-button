'''
This python script looks at the includes field of a Contentful entries
collection, store as a valid JSON file. It counts the number of entries per
content type and prints this out to the terminal.

It's a very simple, fragile script that assumes the JSON file is in the same
directory as the script.
'''

import json
import sys

f = sys.argv[1]

with open(f, 'r', encoding='utf8') as file:
    includes = json.loads(file.read())

entries = includes['includes']['Entry']

cts = {}

for entry in entries:
    ct = entry['sys']['contentType']['sys']['id']
    if ct in cts.keys():
        cts[ct] += 1
        continue
    cts[ct] = 1

print(f'entries per content types in {f}:')
[print(ct+':', cts[ct]) for ct in cts]
