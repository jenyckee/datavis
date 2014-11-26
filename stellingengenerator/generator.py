import json
import numpy as np

file = open('original_stellingen')

outputfilenm = "stellingen.json"
outputfile = open(outputfilenm, 'w')

outputfile.write("[\n")

idcntr = 1

for row in file:
    outputfile.write("{\n")
    
    outputfile.write('"id" : ' + str(idcntr) + ",\n")
    outputfile.write('"text" : "' + row[:-1] +'",\n')
    outputfile.write('"parties" : ["CD&V", "Groen", "N-VA", "OpenVLD", "SP.A", "Vlaams Belang"]\n') 
    outputfile.write("},\n")
    idcntr+=1

outputfile.write("]")

outputfile.close()
