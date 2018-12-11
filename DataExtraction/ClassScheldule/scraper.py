from bs4 import BeautifulSoup
import requests
import unicodedata
import json

#for debigging
# import re
# import urllib2
# import io


def save(courseName):

    data = {'r_search_type':'F','boption':'Search','staff_access':'false','acadsem':'2018;1','r_subj_code':''}

    #for debugging 
    #url = "/home/gphofficial/Dev/NTUVisualizer/DataExtraction/Class Schedule.html"
    #page = io.open(url)

    res = requests.post("https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1", data=data)
    print("Retrieved Webpage")

    soup = BeautifulSoup(unicodedata.normalize("NFKD", res.text).strip(), "html5lib")
    #soup = BeautifulSoup(unicodedata.normalize("NFKD", page.read()).strip(), "html5lib")
    count = 0
    scheldule = {}
    moduleObject = {
        'modCode': '',
        'modTitle': '',
        'modCreditUnit': '',
        'modRemark': '',
        'modSessions': []
    }

    for items in soup.find_all('table'):

            titlecount = 0
            remarkcount = 0
            fieldcount = 0


            modTitle = ""
            modCode = ""
            modCreditUnit = ""
            modRemark = ""

            # Session specifics
            index = ""
            type = ""
            group = ""
            day = ""
            time = ""
            venue = ""
            remark = ""

            sessionCount = 1
            for item in items.find_all('td'):

                text = unicodedata.normalize("NFKD", item.text).strip()
                header = item.find('font')

                if header is not None:
                    if header['color'] == '#0000FF':
                        if titlecount == 0:

                            if moduleObject['modCode'] != '':
                                scheldule[moduleObject['modCode']] = moduleObject

                            moduleObject = {
                                'modCode': '',
                                'modTitle': '',
                                'modCreditUnit': '',
                                'modRemark': '',
                                'modSessions': []
                            }

                            moduleObject['modCode'] = text

                        elif titlecount == 1:
                            moduleObject['modTitle'] = text
                        else:
                            moduleObject['modCreditUnit'] = text

                        titlecount += 1
                        titlecount %= 3

                    elif header['color'] == '#FF00FF':
                        if remarkcount == 1:
                            moduleObject['modRemark'] = text
                        
                        remarkcount += 1
                        remarkcount %= 2

                else:

                    
                    if fieldcount == 0:
                        if text != '':
                            index = text
                    elif fieldcount == 1:
                        type = text
                    elif fieldcount == 2:
                        group = text
                    elif fieldcount == 3:
                        day = text
                    elif fieldcount == 4:
                        time = text
                    elif fieldcount == 5:
                        venue = text
                    if fieldcount == 6:
                        remark = text

                        moduleObject['modSessions'].append({
                                'index': index,
                                'type': type,
                                'group': group,
                                'day': day,
                                'time': time,
                                'venue': venue,
                                'remark': remark
                        })



                    fieldcount += 1
                    fieldcount %= 7
            
    scheldule[moduleObject['modCode']] = moduleObject
    with open('../Data/Raw/ClassScheldule/' + data['acadsem'] + '.json', 'w') as jsonfile:
        json.dump(scheldule, jsonfile)

save("")