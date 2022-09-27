
/**
 * this app.js file helps to implement the yipper website which is the website allows the user
 * to share some information. this file can help to return some yips data from the database
 * according to different situation like searching a term, get the yip of specifc user
 * also add new yips to the database.
 */

'use strict';

const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const multer = require("multer");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" moduleTIME

// return yips contans the given term, if the term doesn't exist return all yips
app.get("/yipper/yips", async function(req, res) {
  try {
    let db = await getDBConnection();
    let term = req.query.search;
    let yips = "";
    if (!term) {
      yips = await db.all("SELECT * FROM yips ORDER BY datetime(date) DESC");
    } else {
      yips = await db.all("SELECT * FROM yips ORDER BY id ASC");
    }
    let yip = convertion(yips, term);
    res.send(yip);
  } catch (error) {
    res.status(500);
    res.type("text");
    res.send("An error occurred on the server. Try again later.");
  }
});

// return all yips of the given user
app.get("/yipper/user/:user", async function(req, res) {
  let name = req.params.user;
  let names = await uniqueNames("name");

  if (names.includes(name)) {
    try {
      let db = await getDBConnection();
      let query = "SELECT * FROM yips WHERE yips.name = ? ORDER BY datetime(date) DESC";
      let yips = await db.all(query, name);
      yips = userYips(yips);
      res.status(200);
      res.send(yips);
    } catch (error) {
      res.status(500);
      res.type("text");
      res.send("An error occurred on the server. Try again later.");
    }
  } else {
    res.status(400);
    res.type("text");
    res.send("Yikes. User does not exist.");
  }
});

// adding the new yips to the database and return the new yip
app.post("/yipper/new", async function(req, res) {
  let names = await uniqueNames("name");
  if (req.body.full || req.body.name) {
    if (names.includes(req.body.name)) {
      try {
        if (null) {
          let result = await adding(req.body.name, req.body.full);
          res.send(result[0]);
        } else {
          res.type("text");
          res.status(400);
          res.send("Yikes. Yip format is invalid.");
        }
      } catch (error) {
        res.status(500);
        res.type("text");
        res.send("An error occurred on the server. Try again later.");
      }
    } else {
      res.status(400);
      res.type("text");
      res.send("Yikes. User does not exist.");
    }
  } else {
    res.status(400);
    res.type("text");
    res.send("Missing one or more of the required params.");
  }
});

// adding the returning the number of likes for a specific user
app.post("/yipper/likes", async function(req, res) {
  let id = req.body.id;
  if (id) {
    let names = await uniqueNames("id");
    if (names.includes(parseInt(id))) {
      try {
        let db = await getDBConnection();
        let numbers = await db.all("SELECT likes FROM yips WHERE yips.id = ?", id);
        await db.run("UPDATE yips SET likes = ? WHERE yips.id = ?", [numbers[0].likes + 1, id]);
        res.status(200);
        res.type("text");
        res.send(numbers[0].likes + 1 + "");
      } catch (error) {
        res.status(500);
        res.type("text");
        res.send("An error occurred on the server. Try again later.");
      }
    } else {
      res.status(400);
      res.type("text");
      res.send("Yikes. ID does not exist.");
    }
  } else {
    res.status(400);
    res.type("text");
    res.send("Missing one or more of the required params.");
  }
});

/**
* convert the array format of the yips into the json format which we want
* @param {Array} yips - contains json of yips
* @param {String} term - the given search term, if don't have one, it is ""
* @returns {Object} - the json object that contains the information about yips
*/
function convertion(yips, term) {
  let result = {};
  let search = [];
  if (term) {
    for (let i = 0; i < yips.length; i++) {
      let identification = {};
      let key = yips[i];
      if (key["yip"].toLowerCase().includes(term)) {
        identification["id"] = key.id;
        search.push(identification);
      }
    }
    result["yips"] = search;
  } else {
    result["yips"] = yips;
  }
  return result;
}

/**
* Establishes a database connection to the database and returns the database object.
* Any errors that occur should be caught in the function that calls this one.
* @returns {sqlite3.Database} - The database object for the connection.
*/
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'yipper.db',
    driver: sqlite3.Database
  });
  return db;
}

/**
* get the unique names or ids in the database
* @param {String} param - decide if the returning array should contains id or name.
* @returns {Array} - the array that contains unique ids or names.
*/
async function uniqueNames(param) {
  let db = await getDBConnection();
  let unique = await db.all("SELECT DISTINCT " + param + " FROM yips");
  let names = [];
  for (let i = 0; i < unique.length; i++) {
    if (param === "name") {
      names.push(unique[i].name);
    } else {
      names.push(unique[i].id);
    }
  }
  return names;
}

/**
* adding the new yip into the database and return the json object contains information of that yip
* @param {String} name - the name of the new yip
* @param {String} full - the text of the yip
* @returns {Array} - returns the array that contains the information about the new yip
*/
async function adding(name, full) {
  let down = full.split("#");
  let yip = down[0];
  let tag = down[1];
  let like = 0;
  let query = 'INSERT INTO yips ("name", "yip", "hashtag", "likes") VALUES (?, ?, ?, ?)';
  let db = await getDBConnection();
  let rows = await db.run(query, [name, yip.trim(), tag, like]);
  let id = rows.lastID;
  let result = await db.all('SELECT * FROM yips WHERE yips.id = ?', id);
  return result;
}

/**
* this function get rid of the id and likes of yips of a specific user
* @param {Array} yips - contains the yips of a given user
* @returns {Array} - array yips without id and likes
*/
function userYips(yips) {
  let user = [];
  for (let i = 0; i < yips.length; i++) {
    let yip = yips[i];
    delete yip["id"];
    delete yip["likes"];
    user.push(yip);
  }
  return user;
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);