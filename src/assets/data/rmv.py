import json

with open('n_states.json', 'r') as data_file:
    data = json.load(data_file)

for element in data:
    element.pop('2005:Q1', None)
    element.pop('2005:Q2', None)
    element.pop('2005:Q3', None)
    element.pop('2005:Q4', None)
    element.pop('2006:Q1', None)
    element.pop('2006:Q2', None)
    element.pop('2006:Q3', None)
    element.pop('2006:Q4', None)
    element.pop('2007:Q1', None)
    element.pop('2007:Q2', None)
    element.pop('2007:Q3', None)
    element.pop('2007:Q4', None)
    element.pop('2008:Q1', None)
    element.pop('2008:Q2', None)
    element.pop('2008:Q3', None)
    element.pop('2008:Q4', None)
    element.pop('2009:Q1', None)
    element.pop('2009:Q2', None)
    element.pop('2009:Q3', None)
    element.pop('2009:Q4', None)
    element.pop('2010:Q1', None)
    element.pop('2010:Q2', None)
    element.pop('2010:Q3', None)
    element.pop('2010:Q4', None)
    element.pop('2011:Q1', None)
    element.pop('2011:Q2', None)
    element.pop('2011:Q3', None)
    element.pop('2011:Q4', None)
    element.pop('2012:Q1', None)
    element.pop('2012:Q2', None)
    element.pop('2012:Q3', None)
    element.pop('2012:Q4', None)
    element.pop('2013:Q1', None)
    element.pop('2013:Q2', None)
    element.pop('2013:Q3', None)
    element.pop('2013:Q4', None)
    element.pop('2014:Q1', None)
    element.pop('2014:Q2', None)
    element.pop('2014:Q3', None)
    element.pop('2014:Q4', None)
    element.pop('2015:Q1', None)
    element.pop('2015:Q2', None)
    element.pop('2015:Q3', None)
    element.pop('2015:Q4', None)

    element.pop('n2005:Q1', None)
    element.pop('n2005:Q2', None)
    element.pop('n2005:Q3', None)
    element.pop('n2005:Q4', None)
    element.pop('n2006:Q1', None)
    element.pop('n2006:Q2', None)
    element.pop('n2006:Q3', None)
    element.pop('n2006:Q4', None)
    element.pop('n2007:Q1', None)
    element.pop('n2007:Q2', None)
    element.pop('n2007:Q3', None)
    element.pop('n2007:Q4', None)
    element.pop('n2008:Q1', None)
    element.pop('n2008:Q2', None)
    element.pop('n2008:Q3', None)
    element.pop('n2008:Q4', None)
    element.pop('n2009:Q1', None)
    element.pop('n2009:Q2', None)
    element.pop('n2009:Q3', None)
    element.pop('n2009:Q4', None)
    element.pop('n2010:Q1', None)
    element.pop('n2010:Q2', None)
    element.pop('n2010:Q3', None)
    element.pop('n2010:Q4', None)
    element.pop('n2011:Q1', None)
    element.pop('n2011:Q2', None)
    element.pop('n2011:Q3', None)
    element.pop('n2011:Q4', None)
    element.pop('n2012:Q1', None)
    element.pop('n2012:Q2', None)
    element.pop('n2012:Q3', None)
    element.pop('n2012:Q4', None)
    element.pop('n2013:Q1', None)
    element.pop('n2013:Q2', None)
    element.pop('n2013:Q3', None)
    element.pop('n2013:Q4', None)
    element.pop('n2014:Q1', None)
    element.pop('n2014:Q2', None)
    element.pop('n2014:Q3', None)
    element.pop('n2014:Q4', None)
    element.pop('n2015:Q1', None)
    element.pop('n2015:Q2', None)
    element.pop('n2015:Q3', None)
    element.pop('n2015:Q4', None)
    

with open('n_states.json', 'w') as data_file:
    data = json.dump(data, data_file)