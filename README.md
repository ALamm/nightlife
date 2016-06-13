# Nightlife APP

#User Stories
1. As an unauthenticated user, I can view all bars in my area.
2. As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
3. As an authenticated user, I can remove myself from a bar if I no longer want to go there.
4. As an unauthenticated user, when I login I should not have to search again.
5. ADDED - hover over 'the number of users going' and get a tooltip showing 'who is going'

## Technology

Server side, I used Drywall which is built with the [Express](http://expressjs.com/)
framework. 

Using [MongoDB](http://www.mongodb.org/) as a data store.

Using Jade/Pug - Node template engine for the View

Using [Grunt](http://gruntjs.com/) for the asset pipeline.

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
| https://nightlifetonight.herokuapp.com/


## Features

 - Login system with forgot password and reset password.
 - Signup and Login with Facebook, Twitter, GitHub, Google and Tumblr.
 - Optional email verification during signup flow.
 
