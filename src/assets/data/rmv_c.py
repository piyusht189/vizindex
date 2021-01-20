import json

with open('n_covid_all.json', 'r') as data_file:
    data = json.load(data_file)

for element in data:
    element.pop('dataQualityGrade', None)
    element.pop('deathConfirmed', None)
    element.pop('deathIncrease', None)
    element.pop('deathProbable', None)
    element.pop('hospitalizedCumulative', None)
    element.pop('hospitalized', None)
    element.pop('hospitalizedIncrease', None)
    element.pop('inIcuCumulative', None)
    element.pop('inIcuCurrently', None)
    element.pop('negative', None)
    element.pop('negativeIncrease', None)
    element.pop('negativeTestsAntibody', None)
    element.pop('negativeTestsPeopleAntibody', None)
    element.pop('negativeTestsViral', None)
    element.pop('onVentilatorCumulative', None)
    element.pop('positiveCasesViral', None)
    element.pop('positiveIncrease', None)
    element.pop('positiveScore', None)
    element.pop('positiveTestsAntibody', None)
    element.pop('positiveTestsAntigen', None)
    element.pop('positiveTestsPeopleAntibody', None)
    element.pop('positiveTestsPeopleAntigen', None)
    element.pop('totalTestEncountersViral', None)
    element.pop('totalTestEncountersViralIncrease', None)
    element.pop('totalTestResultsIncrease', None)
    element.pop('totalTestsAntibody', None)
    element.pop('totalTestsAntigen', None)
    element.pop('totalTestsPeopleAntibody', None)
    element.pop('totalTestsPeopleAntigen', None)
    element.pop('totalTestsPeopleViral', None)
    element.pop('totalTestsPeopleViralIncrease', None)
    element.pop('totalTestsViralIncrease', None)
    

with open('n_covid_all.json', 'w') as data_file:
    data = json.dump(data, data_file)