#Warzone lat matches tracker app
this is a fullstack app who track the last matches of warzone, for get the data the expressJS backend consumes the rapid api call of duty: MW, after the reactJS frontend fetch the data from the backend and show it .


##run the app:
- git clone https://github.com/simon8889/warzone-matches-tracker
- go to server directory
- run: npm install
- made a .env file with API_KEY (your rapid api key), API_HOST (your rapid api host)
- start the backend: npm start
- go to client directory
- run: npm install
- made a .env file with REACT_APP_BACKEND_REQUEST_URL (the url to wich the client do the api request)
- up the frontend: npm start
- go to your localhost:3000
- search your last matches stats of warzone
