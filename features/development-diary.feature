Feature: Development Diary

Scenario: Entering survey data only for periods that child has matured
  Given User has entered child's birth data
  When User navigates to Development Diary Screen
  # https://invis.io/GBUJ3D6CV3E#/397935205_Razvojne_Prekretnice_-_Prazno_Stanje_V2
  Then User sees Survey screen which enables him to enter survey data only for periods that child has matured

Scenario: User enters Development survey data
  Given User has entered child's birth data
  When User navigates to Development Diary Screen
  # https://invis.io/GBUJ3D6CV3E#/397935205_Razvojne_Prekretnice_-_Prazno_Stanje_V2
  And User chooses to enter survey data for certain development period
  Then User sees Survey screen where he is able to enter survey for certain development period
  # https://invis.io/GBUJ3D6CV3E#/397935209_Upitnik_O_Razvoju_Deteta

Scenario: User is entering missing Development survey data
  Given User has entered child's birth data
  But has not entered child development survey data 
  When User goes to Development Diary screen
  # https://invis.io/GBUJ3D6CV3E#/397935205_Razvojne_Prekretnice_-_Prazno_Stanje_V2
  Then Development Diary screen enables user to update missing development survey data for certain period
  # https://invis.io/GBUJ3D6CV3E#/397935207_Upitnik_O_Razvoju_Deteta_-_Az-uriranje

Scenario: User is reminded about missing survey data on Development Diary page
  Given User has entered child's birth data
  And user has entered child development survey data for certain period
  And child has matured to next development period
  But has user not completed whole survey for the previous period
  When User goes to Development Diary screen
  And User starts to enter survey data
  Then Development Diary screen reminds user about missing development survey data from every previous period
  # https://invis.io/GBUJ3D6CV3E#/397935206_Upitnik_O_Razvoju_Deteta_-_Pitanja_Prenes-ena_Iz_Prethodnog_Meseca

Scenario: User wants to get more knowledge for certain survey question
  Given User has entered child's birth data
  When User goes to Development Diary screen
  And User starts to enter survey data
  And User expands survey question
  # https://invis.io/GBUJ3D6CV3E#/397935206_Upitnik_O_Razvoju_Deteta_-_Pitanja_Prenes-ena_Iz_Prethodnog_Meseca
  Then User sees additional text for the certain question and external links to related articles



