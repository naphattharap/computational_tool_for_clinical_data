class BizValidationExption(Exception):

    def __init__(self, label, value): 
        self.label = label 
        self.value = value 
  
    # __str__ is to print() the value 
    def __str__(self): 
        return(repr(self.label + self.value)) 
