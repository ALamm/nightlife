'use strict';

exports.init = function(req, res){

//  DELETE THE DATABASE DAILY BETWEEN 4-5am 
function deleteDaily(){
    var hours =new Date().getHours();
    if (hours >4 && hours < 5) { // between 4 and 5
      var collection = req.app.db.collection("bars");
      collection.drop();  // REMOVES the entire collection, including indexes.  MongoDB re-creates collection upon first reference to it
    }
}
setInterval(deleteDaily, 3600000); // one hour check.

  res.render('index', {city:''});
};


exports.search = function(req,res) {
  
  var arr=[];
  var city = req.body.city;
  var config = require('../config'); 
  var Yelp = require('yelp');
  
  console.log('top of index.js. city:', city);

  var yelp = new Yelp({
    consumer_key: config.yelp.consumer_key || 'consumer-key',
    consumer_secret: config.yelp.consumer_secret || 'consumer-secret',
    token: config.yelp.token || 'token',
    token_secret: config.yelp.token_secret || 'token-secret',
  });
  
  // See http://www.yelp.com/developers/documentation/v2/search_api
  yelp.search({ term: 'bars', location: city }, function(err, data) {
    if (err) { res.render('index');}
    else {
      // loop through the req.body object and get values you require - push to array
      for (var i = 0; i < data.businesses.length; i++) {
        var temp = [];
        temp.push(data.businesses[i].name);           // '0'
        temp.push(data.businesses[i].image_url);      // '1'
        temp.push(data.businesses[i].snippet_text);   // '2'
        temp.push(data.businesses[i].url);            // '3'
        temp.push(data.businesses[i].id);             // '4'
        // PUSH the data to the array
        arr.push(temp);
      }

      // get the list of bar id's - and put in an array
      var count=[];
      for (var k=0; k<arr.length; k++) {
        count.push(arr[k][4]);
      }
      
      // Get the number of attendees for each bar id in the list
      if (req.body.city) {
        var collection = req.app.db.collection("bars");
        // Note the use of $in:   - this lets you search the db for any records that match the array 'count' for instance
        collection.find({id: {$in:count}},{ _id: 0, id:1, attendees: 1}).toArray(function (err,docs) {
          if (err) {console.error('find error'); }

          // send the jade template the following info:
          res.render('index',{data:arr, city: req.body.city, docs: docs}); 
        });
      }
    } 
  });
};


exports.going = function(req, res) {

  // // UPDATE THE DB
  var collection = req.app.db.collection("bars"); 
  
  // get the 'data' passed from index.jade's ajax call
  // parse 'val' from JSON to a regular JS object
  var val = Object.keys(req.body)[0];
  val = JSON.parse(val);
  
  var number;
  var goingList;

  // Authenticated user 
  if(req.isAuthenticated()) {
    
    var barName = val.id;
  
    // check if the user is already in the database of attendees
    collection.find({id: barName, attendees: req.user.username},{ _id: 0, attendees: 1}).toArray(function (err,docs) {
      if (err) {console.error('find error'); }
      
      var answer=[];
      
      // USER is already in the db - remove them because the button was clicked again signifying they aren't going
      if (docs[0]) {
        
        console.log('USER is in db, removing them');
        
        answer = docs[0].attendees;
        var index = answer.indexOf(req.user.username);  // get the location of the user in the array of users attending
        answer.splice(index,1);  // remove this user

                
        collection.update( {id:barName },{$set: {attendees: answer}}, function (err,result) {  // remove one document
            if (err) { console.error('remove err'); }
          
          console.log("authenticated user, removed from bar with id: ", barName);
            
            collection.find({id: barName},{ _id: 0, attendees: 1}).toArray(function (err,docs) {
              if (err) {console.error('find error'); }
              
              number = docs[0].attendees.length;
              console.log('number of attendees is now: ', number);
              goingList = docs[0].attendees;
              
               res.send('{"success" : "user removed from db", "status" : 200, "number" : "' + number + '", "list" : "' + goingList + '"}');
            });
        });        
      }
      
      // USER is NOT in the db - add them
      else {
        
        console.log('not in db, adding them');
         
         collection.find({id: barName},{ _id: 0, id:1, attendees:1}).toArray(function (err,docs) {
            if (err) {console.error('find error'); }        
            
            // bar exists, add the user
            if(docs[0]) {
              
              // other users exist for this bar in the db
              if (docs[0].attendees) {
                answer = docs[0].attendees;
                answer.push(req.user.username);  // add this user to the array
                console.log('other users exist for this bar in the db, they are:', answer);
              }
              // no other users for this bar in the db (e.g. no users at all, but bar exists)
              else {
                answer.push(req.user.username);  // add this user to the array
                console.log('no other users for this bar in the db, so array is', answer);
              }
      
              collection.update({id:barName },{$set: {attendees: answer}}, function (err, result) {
                if (err) {console.error('find error'); } 
                
                console.log("authenticated user, added to bar with id: ", barName);
                  
                  collection.find({id: barName},{ _id: 0, attendees: 1}).toArray(function (err,docs) {
                    if (err) {console.error('find error'); }
                    
                    number = docs[0].attendees.length;
                    console.log('number of attendees is now: ', number);
                    
                    goingList = docs[0].attendees;
                    
                     res.send('{"success" : "user added to db", "status" : 200, "number" : "' + number + '", "list" : "' + goingList + '"}'); 
                  });
              });  
            }
            
            // bar doesn't exist in DB - add the bar and the user
            else {
                console.log('no user or bar - add them both');
                answer.push(req.user.username); // add this user to the array
                
                var fieldsToSet = {
                      id: barName,
                      attendees: answer
                  };
                
                collection.insertOne(fieldsToSet, function(err, user) {
                    if (err) {console.error('find error'); }
                    
                    console.log('user and bar added to db');
  
                    collection.find({id: barName},{ _id: 0, attendees: 1}).toArray(function (err,docs) {
                      if (err) {console.error('find error'); }
                      
                      number = docs[0].attendees.length;
                      console.log('number of attendees is now: ', number);
                      
                      goingList = docs[0].attendees;
                      
                       res.send('{"success" : "user AND bar added to db", "status" : 200, "number" : "' + number + '", "list" : "' + goingList + '"}');
                    });
                });
            }
        });
      }
    });
  }
  
  // NOT authenticated - send them onwards to login or signup
  
  // USE THE DATA PASSED FROM AJAX CALL WHICH HAS WHAT THEY WERE SEARCHING FOR (SO THEY CAN BE REDIRECTED BACK AGAIN WHEN FINISHED SIGNING UP)
  // SEE INDEX.JADE
  else {
    res.send('{"error" : "Not logged in", "status" : 500}');
    res.end();
  }
};

