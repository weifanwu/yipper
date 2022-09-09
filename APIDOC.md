# App API Documentation
App API provides information about shared yips in the website and also allow the user to upload new yips in the website
it also allows the user to search a specific yip and a specific yips of the user.

## get all yips or search for yips in this service
**Request Format:** /yipper/yips

**Request Type:** GET

**Returned Data Format**: Json object

**Description:** return json objects of yips contans the given term, if the term doesn't exist return all json in the API


**Example Request:** /yipper/yips

**Example Response:**
```
  [
    {
      id: 1,
      name: 'Santa Paws',
      yip: 'have you all been good this year? santa paws is watchin',
      hashtag: 'begood',
      likes: 16,
      date: '2013-07-28 19:03:15'
    }
  ]
```

**Example Request:** /yipper/yips/search=chew

**Example Response:**
```
  [
    {
      id: 4,
      name: 'Jimmy Chew',
      yip: "chew chew chew everything up hope my human doesn't scream",
      hashtag: 'yumyuminmytum',
      likes: 2,
      date: '2019-06-28 20:26:14'
    }
  ]
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - if something wrong with the server: `An error occurred on the server. Try again later.`

## get yips of specifc user
**Request Format:** /yipper/user/:user

**Request Type:** GET

**Returned Data Format**: Json Object

**Description:** return a array that contains yips which belong to a specific user

**Example Request:** /yipper/user/Chewbarka

**Example Response:**

```
[
  {
    "name": "Chewbarka",
    "yip": "chewy or soft cookies. I chew them all",
    "hashtag": "largebrain",
    "date": "2020-07-09 22:26:38",
  },
  {
    "name": "Chewbarka",
    "yip": "Every snack you make every meal you bake every bite you take... I will be watching you.",
    "hashtag": "foodie",
    "date": "2019-06-28 23:22:21"
  }
]
```

**Error Handling:**
- Possible 400 (invalid request) errors (Plain text)
 - if the parameter is empty: `Yipes. User does not exist.`
- Possible 500 errors (all plain text):
  - if something wrong with the server: `An error occurred on the server.Try again later`

## add the new yip to the database, also get the information about the new yip
**Request Format:** /yipper/new

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Adding the new yip into the database and also return the json object about the new yip.

**Example Request:** /yipper/new

**Example Response:**

```json
{
  "id": 528,
  "name": "Chewbarka",
  "yip": "love to yip allllll day long",
  "hashtag": "coolkids",
  "likes": 0,
  "date": "2020-09-09 18:16:18"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - if missing params: `Missing one or more of the required params.`
- Possible 400 (invalid request) errors (all plain text):
  - if the user is not found in the order file: `Yikes. User does not exist.`
- Possible 400 (invalid request) errors (all plain text):
  - if the yip format is wrong: `Yikes. Yip format is invalid.`
- Possible 500 errors (all plain text):
  - if something wrong with the server: `something went wrong with the server.`

## get yips of specifc user
**Request Format:** /yipper/user/:user

**Request Type:** GET

**Returned Data Format**: Json Object

**Description:** return a array that contains yips which belong to a specific user

**Example Request:** /yipper/user/Chewbarka

**Example Response:**

```
[
  {
    "name": "Chewbarka",
    "yip": "chewy or soft cookies. I chew them all",
    "hashtag": "largebrain",
    "date": "2020-07-09 22:26:38",
  },
  {
    "name": "Chewbarka",
    "yip": "Every snack you make every meal you bake every bite you take... I will be watching you.",
    "hashtag": "foodie",
    "date": "2019-06-28 23:22:21"
  }
]
```

**Error Handling:**
- Possible 400 (invalid request) errors (Plain text)
 - if the parameter is empty: `Yipes. User does not exist.`
- Possible 500 errors (all plain text):
  - if something wrong with the server: `An error occurred on the server.Try again later`

## give like to a specific yip
**Request Format:** /yipper/likes

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** add the update the number of likes by one and return it as a plain text

**Example Request:** /yipper/likes

**Example Response:**

```json
8
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - if missing params: `Missing one or more of the required params.`
- Possible 400 (invalid request) errors (all plain text):
  - if the user is not found in the order file: `Yikes. ID does not exist.`
- Possible 500 errors (all plain text):
  - if something wrong with the server: `something went wrong with the server.`