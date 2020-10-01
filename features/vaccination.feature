Feature: Vaccination

Scenario: Showing content of vaccination screen 
  Given user is logged in
  When user has opened the vaccination screen
  Then application shows all vaccinations
  And application signalize user which vaccination period is next
  # https://invis.io/GBUJ3D6CV3E#/416108051_Vakcinacije_-_Podaci_Su_Az-urirani_-_Primer_2

Scenario: Notifying user that vaccination data is not updated
  Given user opened the vaccination section
  When child has reached certain vaccination period
  And there is missing data in one or more previous vaccination periods
  Then application reminds user that data is missing in the certain vaccination period
  And application enables user to enter vaccination data in each period where data is missing
  # https://invis.io/GBUJ3D6CV3E#/416108049_Vakcinacije_-_Podaci_Nisu_Az-urirani_-_Primer_2

Scenario: User wants to know more about the vaccination in the certain period
  Given user has opened vaccination screen
  When user clicks on the designated section on particular vaccination period 
  Then application shows more information about the vaccination in particular vaccination period
  # section "5. - 6. mesec":
  # https://invis.io/GBUJ3D6CV3E#/416108048_Vakcinacije_-_Podaci_Nisu_Az-urirani

  Scenario: The child has reached vaccination period
    Given child has reached certain vaccination period
    When user opens the vaccination screen
    Then application enables user to enter vaccination data for certain upcoming period
    # https://invis.io/GBUJ3D6CV3E#/416108048_Vakcinacije_-_Podaci_Nisu_Az-urirani