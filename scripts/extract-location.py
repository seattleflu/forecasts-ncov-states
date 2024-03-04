import sys
import json
LOCATION="Washington"
print(f"Reading a forecasting JSON from STDIN, extracting 'location={LOCATION}' and writing to STDOUT", file=sys.stderr)
j = json.load(sys.stdin)
assert(LOCATION in j['metadata']['location'])
j['metadata']['location'] = [LOCATION]
j['data'] = [d for d in j['data'] if d['location']==LOCATION]
print(json.dumps(j))
print("Done!", file=sys.stderr)
