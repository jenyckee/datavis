import urllib
import re


url = "http://polling2014.belgium.be/en/cha/results/results_tab_CKC11002.html"
htmlfile = urllib.urlopen(url)
#htmlfile = open("test.html")

htmltext = htmlfile.read()
regex = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tdcatbg03">.*<table width="100%".*>(.+?)</table>'


#regex = 'title.*multi(.+?)</head>'

pattern = re.compile(regex, re.DOTALL)
target = re.findall(pattern, htmltext)
print target
#print htmltext
