Feature: User Onboarding

Scenario: First time user onboarding
  Given user opens the application 
  When application is opened for the first time
  Then application shows user login screen

Scenario: Walkthrough explanation of application features
  Given user successfuly created account 
  When user has logged in for the first time after creation the account
  Then application shows the walkthrough explanation of features

Scenario: Walktrough is showed only after first login
  Given user has logged out from the application
  When user has logged in again
  Then application shows homepage

Scenario: Entering child essential data 
  Given user is logged in for the first time after creation the account
  When user has finished walkthrough process
  Then application is showing user the screen for entering child essential data
  # https://invis.io/GBUJ3D6CV3E#/390237594_Napravi_Bebin_Profil_1

Scenario: Reminding user to enter child birth data
  Given user is logged in
  And user has entered child essential data
  But user has not entered child birth data
  When user opens home page
  Then application alerts the user to enter child birth data

Scenario: Entering child birth data
  Given user is logged in
  And user is on home page
  And user has entered child essential data
  But user has not entered child birth data
  # https://invis.io/GBUJ3D6CV3E#/390238732_Home_Stranica_-_Prvi_Bebini_Podaci
  When user opens the screen for entering child birth data 
  Then application shows screen for entering child birth data
  # https://invis.io/GBUJ3D6CV3E#/390238733_Podaci_Sa_Ro-enja_-_1

Scenario: Child birth data entry is completed
  Given user has created the account
  * user has completed entering child essential data
  * user has completed entering child birth data
  When user has opened the application
  Then application shows home screen

