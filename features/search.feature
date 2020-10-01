Feature: Searching for content

Scenario: Enabling user to search
  Given User is on the home page
  When User is clicking the search icon
  Then Application enables the user to input the search term
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390239060


Scenario: Showing the search results
  Given User is searching for paticular term
  When User has entered the search term
  * user has clicked "Search" on keyboard
  Then Application shows search results
  * search results contain links to the articles and links to frequently asked questions
  * search results are ordered by relevance
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390239061