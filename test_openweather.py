import urllib.request
import urllib.parse
import urllib.error

key = 'abcfeea61d04caf2b69a2865402a1035'
city = 'Grudziadz'
url = 'https://api.openweathermap.org/data/2.5/weather?q=' + urllib.parse.quote(city) + '&units=metric&lang=pl&appid=' + key
print(url)
try:
    r = urllib.request.urlopen(url, timeout=15)
    print(r.status)
    print(r.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTPError', e.code)
    body = e.read().decode('utf-8')
    print(body)
except Exception as e:
    print('ERROR', type(e).__name__, e)
