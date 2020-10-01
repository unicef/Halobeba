Feature: Notifying user for the certain actions

Scenario: Default Notification State
  Given User has logged in
  * User has entered child birth data
  When User opens home page
  Then Application shows parenting advise from the selected, randomized content from the repository of short parenting advises
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238736

Scenario: Showing development content segment in the notification area
  Given User has logged in
  * user has entered child birth data
  * child age approaches <<XX>> days prior to the predefined development period
  When user has opened the home page
  Then Application notifies user that development milestone period is approaching
  * Application shows parenting advise from the selected, randomized content from the repository of short parenting advises
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238737
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238742

Scenario: Notifying user that child measures, doctor visits and vaccination data are timely updated
  Given User has logged in
  * User has entered child birth data
  * User has entered child growth data, vaccination data and doctor visit data on time 
  # (there is no data missing for all periodical events that user is supposed to enter)
  When User has opened the home page
  Then Application notifies user that all data is timely entered
  * Application shows parenting advise from the selected, randomized content from the repository of short parenting advises
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238738

Scenario: Notifying user that data about the child should be updated
  Given User has logged in
  * User has entered child birth data
  * User has missed to entered either child growth data or vaccination data or doctor visit data on time 
  When User has opened the home page
  Then Application notifies user that certain data is missing
  * Application shows parenting advise from the selected, randomized content from the repository of short parenting advises
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238739
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238740
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238741
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238743

Scenario: User hides the notification area
  Given The notification area is shown on home page
  When User closes the notification area by clicking on close link 
  Then Application informs user about the consequence of the action
  * Notifications won't be displayed until next development period or until next predefined period of vaccination or until next predefined period of doctor visit 
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238744
