import urllib.request
import re

html = urllib.request.urlopen('https://ridelab.tcdigital.cl/').read().decode('utf-8')
print("HTML:", html[:200])
matches = re.findall(r'src=["\']([^"\']+)["\']', html)
print("Scripts found:", matches)
if matches:
    js_url = 'https://ridelab.tcdigital.cl/' + matches[0].lstrip('./')
    print("Fetching JS:", js_url)
    js = urllib.request.urlopen(js_url).read().decode('utf-8')
    print("Fetched JS, size:", len(js))
