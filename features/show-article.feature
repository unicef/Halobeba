Feature: Show Article Page and Article itself

Scenario: Showing default list of articles on home page 
  Given User has logged in
  But User has not entered child birth data
  When User opens home page 
  Then list of popular articles is shown
  But list of popular articles is not contextualized (by age, gender, period of the year)
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238732

Scenario: Showing personalized list of articles on home page 
  Given User has logged in
  * User has entered child birth data
  When User opens home page
  Then categorized list of articles is shown on home page
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238736

Scenario: Ordering of articles within the category on home page
  Given User has logged in
  When user has opened the home page
  Then articles in the list from the certain category appear ordered by growth tag 
  * articles appear starting from the current child's age 
  * articles appear continuing with upcoming growth tag
  * articles appear in the collection of five randomized articles per each category

Scenario: Ordering of articles on the category page
  Given User has logged in
  When user has opened the home page
  Then articles in the list appear ordered by growth tag 
  * articles appear starting from the current child's age 
  * articles appear continuing with upcoming growth tag

Scenario: Showing development content segment on the home page
  Given User has logged in
  * user has entered child birth data
  * child age approaches 10 days prior to the development period or child age is into development period no more than 10 days
  When user has opened the home page
  Then additional segment is shown on the home page above the default article collections that gives more information about child development
  * articles in the list from the certain category appear ordered by growth tag 
  * articles appear starting from the current child's age 
  * articles appear continuing with upcoming growth tag
  * articles appear in the collection of five randomized articles per each category  
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238737

Scenario: Showing related articles on article page
  Given User has opened the article from the certain category
  When There are more than one article from the category user has opened
  Then Related articles are shown on article page ordered randomly
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390239227
