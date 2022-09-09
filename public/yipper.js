/**
 * this file implements the client side of the website yipper, by
 * enabling user to add a new yip, go to the home page, search a yip by
 * giving a term, check the yips of a specific user.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * enable the user to click home button, search button
   * when user type something except space, add a new yip button.
   * also, load the page with yips.
   */
  function init() {
    id("home-btn").addEventListener("click", goHome);
    id("search-term").addEventListener("input", function() {
      if (id("search-term").value.trim()) {
        id("search-btn").disabled = false;
      } else {
        id("search-btn").disabled = true;
      }
    });
    id("search-btn").addEventListener("click", search);
    id("yip-btn").addEventListener("click", createYip);
    load();
  }

  /**
   * helps to load the page with yips.
   */
  function load() {
    fetch("/yipper/yips")
      .then(statusCheck)
      .then(res => (res.json()))
      .then(allCards)
      .catch(callError);
  }

  /**
   * handle when the error happens, shows the error message on the screen and
   * disable all buttons.
   */
  function callError() {
    id("yipper-data").classList.add("hidden");
    id("error").classList.remove("hidden");
    let buttons = qsa("nav button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  /**
   * switch the current view to creating the new yip view
   * enable the user to click the submit form button
   */
  function createYip() {
    id("user").classList.add("hidden");
    id("home").classList.add("hidden");
    id("new").classList.remove("hidden");
    qs("form").addEventListener("submit", function(Event) {
      yipNew();
      Event.preventDefault();
    });
  }

  /**
   * helps to create new yip, and add new yip to the databaes
   */
  function yipNew() {
    let form = new FormData(qs("form"));
    fetch("/yipper/new", {method: "POST", body: form})
      .then(statusCheck)
      .then(res => (res.json()))
      .then(add)
      .catch(callError);
  }

  /**
   * this function helps to add the new yip to the home page and data base
   * after that return to homepage
   * @param {Object} newThing - jason object contains info about a yip
   */
  function add(newThing) {
    qs("form").reset();
    let yip = newYips(newThing);
    id("home").prepend(yip);
    setTimeout(switchView, 2000);
  }

  /**
   * switching the view from creating new yip page to home page
   */
  function switchView() {
    id("new").classList.add("hidden");
    id("home").classList.remove("hidden");
  }

  /**
   * helps to go to the home page and clean the search input
   */
  function goHome() {
    id("user").classList.add("hidden");
    id("new").classList.add("hidden");
    id("home").classList.remove("hidden");
    id("search-term").value = "";
    id("search-btn").disabled = true;
    let yips = qsa("#home > .hidden");
    for (let i = 0; i < yips.length; i++) {
      yips[i].classList.remove("hidden");
    }
  }

  /**
   * helps to search corresponding yips using
   * the given term showing on the home page
   */
  function search() {
    id("new").classList.add("hidden");
    id("user").classList.add("hidden");
    id("home").classList.remove("hidden");
    let term = id("search-term").value.trim();
    let request = "/yipper/yips?search=" + term;
    fetch(request)
      .then(statusCheck)
      .then(res => (res.json()))
      .then(visible)
      .catch(callError);
  }

  /**
   * helps to find the specific yips according to the search term
   * @param {Object} selected - jason object contains the information of selected yips
   */
  function visible(selected) {
    let identifications = [];
    let searchYip = selected["yips"];
    for (let i = 0; i < searchYip.length; i++) {
      identifications.push(searchYip[i].id);
    }
    let all = qsa("#home > *");
    for (let i = 0; i < all.length; i++) {
      let yip = all[i];
      if (!identifications.includes(parseInt(all[i].id))) {
        yip.classList.add("hidden");
      } else {
        yip.classList.remove("hidden");
      }
    }
  }

  /**
   * help loading the yips on the home page
   * @param {Array} yips - array contains contain jason object with information about yips
   */
  function allCards(yips) {
    let allYips = yips["yips"];
    for (let i = 0; i < allYips.length; i++) {
      let yip = newYips(allYips[i]);
      id("home").append(yip);
    }
  }

  /**
   * creating each single yip according to the information
   * @param {Object} yip - json object contains each yip's information
   * @returns {object} - a html element that contains the information of a yip
   */
  function newYips(yip) {
    let article = gen("article");
    article.setAttribute("id", yip["id"]);
    article.classList.add("card");
    let img = gen("img");
    img.src = "img/" + getName(yip);
    let divOne = gen("div");
    let pOne = gen("p");
    pOne.textContent = yip["name"];
    let pTwo = gen("p");
    pTwo.textContent = yip["yip"] + " #" + yip["hashtag"];
    divOne.append(pOne, pTwo);
    pOne.classList.add("individual");
    pOne.addEventListener("click", getUser);
    let divTwo = gen("div");
    divTwo.classList.add("meta");
    let pThree = gen("p");
    pThree.textContent = new Date(yip["date"]).toLocaleString();
    let divThree = gen("div");
    let imgDiv = gen("img");
    imgDiv.src = "img/heart.png";
    addHeart(imgDiv, yip);
    let pDiv = gen("p");
    pDiv.textContent = yip["likes"];
    divThree.append(imgDiv, pDiv);
    divTwo.append(pThree, divThree);
    article.append(img, divOne, divTwo);
    return article;
  }

  /**
   * get the URL for the yip image
   * @param {Object} yip - json object contains the information about a yip
   * @returns {String} - the URL for the yip image
   */
  function getName(yip) {
    let name = yip["name"].toLowerCase().split(" ");
    let image = name.join("-") + ".png";
    return image;
  }

  /**
   * helps to enable to like a yip by cliking heart
   * @param {Object} image - the heart imagee
   * @param {Object} yip - a json object contains information of a yip
   */
  function addHeart(image, yip) {
    image.addEventListener("click", function() {
      let number = this.parentNode.children[1];
      like(yip["id"], number);
    });
  }

  /**
   * helps to update the number of like when the like is clicked
   * @param {Number} identification - the id of the yip that is liked
   * @param {object} heart - the DOM element indicates the number of likes
   */
  function like(identification, heart) {
    let form = new FormData();
    form.append("id", identification);
    fetch("/yipper/likes", {method: "POST", body: form})
      .then(statusCheck)
      .then(res => (res.text()))
      .then(function(likes) {heart.textContent = likes;})
      .catch(callError);
  }

  /**
   * helps to get all the yips that is shared by a specific user
   * and switch the current view to show all yips on the screen
   */
  function getUser() {
    id("home").classList.add("hidden");
    id("new").classList.add("hidden");
    id("user").classList.remove("hidden");
    id("user").innerHTML = "";
    let name = this.textContent;
    fetch("/yipper/user/" + name)
      .then(statusCheck)
      .then(res => (res.json()))
      .then(cards)
      .catch(callError);
  }

  /**
   * helps to create all the shared yips of specific user and show them on the screen
   * @param {Object} yips - the json object that contains the information about yips
   * of a specific user
   */
  function cards(yips) {
    let users = gen("artcle");
    let description = gen("h2");
    description.textContent = "Yips shared by " + yips[0].name;
    users.append(description);
    users.classList.add("single");
    for (let i = 0; i < yips.length; i++) {
      let user = addPost(yips[i], i);
      users.append(user);
    }
    id("user").append(users);
  }

  /**
   * create the text context of the user's yip
   * @param {Object} yip - json object that contains information about the yip of a user
   * @param {Number} number - the number of the yip
   * @returns {object} - the DOM element p of the yip
   */
  function addPost(yip, number) {
    let post = gen("p");
    post.textContent = "Yip " + number + ": " + yip["yip"] + " #" + yip["hashtag"];
    return post;
  }

  /**
   * check if an error occurs, if it does
   * throw an error
   * @param {Object} res - the response onject
   * @returns {Object} res - the response object
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.json());
    }
    return res;
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns all the elements matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {Array} - An array of DOM objects associated selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns an new elements according to the given element.
   * @param {string} element - CSS query selector.
   * @returns {object} - new DOM object according to given element
   */
  function gen(element) {
    return document.createElement(element);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }
})();