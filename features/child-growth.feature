Feature: Child Growth 

Background: 
# fully onboarded user
  Given user has opened the account in the application
  * user has logged in into application
  * user has entered child essential data
  * user has entered child birth data


Scenario: Initial state of the growth section
  Given user has opened the growth section
  When user is opened growth section for the first time
  Then application enables user to enter initial child measures
  # https://invis.io/GBUJ3D6CV3E#/390239335_Rast_Bebe_-_Prazno_Stanje

Scenario: Growth data is entered for the current period
  Given user has entered the growth data
  When user saves the growth data
  Then application shows updated chart for all growth measures
  And application shows the accompanying text about the growth in current period
  And application shows the informational text that explains how the child growth progresses according to entered measures, based on provided algorythm and typical data from WHO
  And application shows last updated measures
  And application enables user to enter new measures
# https://invis.io/GBUJ3D6CV3E#/390239337_Rast_Bebe_-_Podaci_Nisu_Az-urirani_-_2

Scenario: Growth data is missing for certain periods
  Given user has opened the growth section
  When there is missing data for certain preprogrammed periods of growth
  Then application reminds user to enter missing measures for certain preprogrammed periods
  # https://invis.io/GBUJ3D6CV3E#/390239337_Rast_Bebe_-_Podaci_Nisu_Az-urirani_-_2


Scenario: Growth data is entered for previous period where data is missing
  Given there is missing growth data for the certain previous growth period
  When user has entered the growth data for certain growth period where data is missing
  * user has saved the data in the application
  * certain growth period is not current growth period
  * certain growth period is only period where data is missing
  Then the reminder for missing growth data is not shown on growth screen
  # https://invis.io/GBUJ3D6CV3E#/415705068_Rast_Bebe_-_Nakon_Druge_Godine

Scenario: Editing last entered measure
  Given user has opened the growth section
  And user has entered at least growth data section after the birth
  When user opens screen with all measures
  Then application enables user to edit last entered measures
  # https://invis.io/GBUJ3D6CV3E#/390239339_Sve_Mere
