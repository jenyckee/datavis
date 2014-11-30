import csv
import numpy as np

# Input
file = open("uitslagen_2014_all_formatted.csv")
data = csv.reader(file)

# Output
outputfilenm = "out.csv"
outputfile = open(outputfilenm, 'w')
outputdata = csv.writer(outputfile)

regioprfx = ""
delim = "-"

def appnd_party(party, target):
  if(target != ""):
    return party + delim + target
  else:
    return party

# Modify
for row in data:
  if(row[0] == "0"):
    continue
    #row[0] = ""
  elif(row[0] == "1"):
    row[0] = regioprfx + "Antw"
  elif(row[0] == "2"):
      row[0] = regioprfx + "Bru"
  elif(row[0] == "3"):
    row[0] = regioprfx + "OVL"
  elif(row[0] == "4"):
    row[0] = regioprfx + "Hene"
  elif(row[0] == "5"):
    row[0] = regioprfx + "VlBr"
  elif(row[0] == "6"):
    row[0] = regioprfx + "Luik"
  elif(row[0] == "7"):
    row[0] = regioprfx + "Lim"
  elif(row[0] == "8"):
    row[0] = regioprfx + "Lux"
  elif(row[0] == "9"):
    row[0] = regioprfx + "Nam"
  elif(row[0] == "10"):
    row[0] = regioprfx + "WBr"
  elif(row[0] == "11"):
    row[0] = regioprfx + "WVL"

  if(row[1] == "Voters"):
    continue
  elif(row[1] == "Valid Votes"):
    continue
  elif(row[1] == "Blank and Invalid Votes"):
    continue
    #row[0] = appnd_party("Ongeldig", row[0])
  elif(row[1] == "New Flemish Alliance (N-VA)"):
    row[0] = appnd_party("NVA", row[0])
  elif(row[1] == "Socialist Party (PS)"):
    row[0] = appnd_party("PS", row[0])
  elif(row[1] == "Reform Movement (MR)"):
    row[0] = appnd_party("MR", row[0])
  elif(row[1] == "Christian Democratic & Flemish (CD&V)"):
    row[0] = appnd_party("CD&V", row[0])
  elif(row[1] == "Open VLD (Flemish Liberals and Democrats)"):
    row[0] = appnd_party("OpenVLD", row[0])
  elif(row[1] == "Socialist Party. Different (sp.a)"):
    row[0] = appnd_party("spa", row[0])
  elif(row[1] == "Humanist Democratic Center (CDH)"):
    row[0] = appnd_party("CDH", row[0])
  elif(row[1] == "Green"):
    row[0] = appnd_party("Groen", row[0])
  elif(row[1] == "Ecolo"):
    row[0] = appnd_party("Ecolo", row[0])
  elif(row[1] == "Flemish Interest (VB)"):
    row[0] = appnd_party("VB", row[0])
  elif(row[1] == "Workers' Party of Belgium (PTB/PVDA)" or row[1] == "Workers' Party of Belgium (PVDA)" or row[1] == "Workers' Party of Belgium (PTB)"):
    row[0] = appnd_party("PVDA", row[0])
  elif(row[1] == "Francophone Democratic Federalists (FDF)"):
    row[0] = appnd_party("FDF", row[0])
  elif(row[1] == "Popular Party (PP)"):
    row[0] = appnd_party("PP", row[0])
  elif(row[1] == "List Dedecker"):
    row[0] = appnd_party("LDD", row[0])
  elif(row[1] == "Others"):
    row[0] = appnd_party("Anderen", row[0])
  row.pop(1)
  outputdata.writerow(row)
