import urllib
import re

urls = ["http://www.google.be", "http://www.nytimes.com", "http://cnn.com"]

# iterator over urls
i=0

regex = '<title>(.+?)</title>' # Maak een patroon om op te zoeken
pattern = re.compile(regex) # Regex omzettn naar re-compatibel formaat

while i<len(urls):
  # Een url openen
  htmlfile = urllib.urlopen(urls[i])
  # HTML code van de binnengehaalde url inlezen
  htmltext = htmlfile.read()
  titles = re.findall(pattern, htmltext)

  print titles
  print "\n"  # newline
  i+=1
