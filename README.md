# Nightlife APP

#User Stories
1. As an unauthenticated user, I can view all bars in my area.
2. As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
3. As an authenticated user, I can remove myself from a bar if I no longer want to go there.
4. As an unauthenticated user, when I login I should not have to search again.

## Technology

Server side, it uses Drywall which is built with the [Express](http://expressjs.com/)
framework. 
Using [MongoDB](http://www.mongodb.org/) as a data store.

We're using [Grunt](http://gruntjs.com/) for the asset pipeline.

| On The Server | On The Client  | Development |
| ------------- | -------------- | ----------- |
| Express       | Bootstrap      | Grunt       |
| Jade          | Backbone.js    |             |
| Mongoose      | jQuery         |             |
| Passport      | Underscore.js  |             |
| Async         | Font-Awesome   |             |
| EmailJS       | Moment.js      |             |


## Live demo

| Platform                       
| ----------------------------------------
| https://nightlifetonigh.herokuapp.com/


## Running the app
$ npm start


## Features

 - Login system with forgot password and reset password.
 - Signup and Login with Facebook, Twitter, GitHub, Google and Tumblr.
 - Optional email verification during signup flow.
 
