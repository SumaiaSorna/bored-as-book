const choicesContainer = $("#choices-container");
const cardContainer = $("#card-container");
const baseURL = "https://www.boredapi.com";

// to store api data
let choiceData;

const resetChoicesCSS = function (buttons) {
  const removeSuccessClass = function (buttonOption) {
    const button = $(buttonOption);
    if (button.hasClass("is-success")) {
      button.removeClass("is-success");
    }
  };
  buttons.forEach(removeSuccessClass);
};

// function to make the API call
const getApiCall = async function (url) {
  const data = await fetch(url);
  return data.json();
};

const renderActivityCard = async function (categorySelected) {
  const url =
    categorySelected === "random"
      ? `${baseURL}/api/activity`
      : `${baseURL}/api/activity?type=${categorySelected}`;
  choiceData = await getApiCall(url);
  constructActivityCard(choiceData);
};

const handleSelectedChoice = async function (event) {
  const target = $(event.target);
  const currentTarget = $(event.currentTarget);

  if (target.is("button")) {
    // reset the selected button
    resetChoicesCSS([...currentTarget.find("button")]);

    // set the selected button to green
    target.addClass("is-success");

    // render the selected activity card
    const categorySelected = target.data("category");
    renderActivityCard(categorySelected);
  }
};

const handleUserChoices = async function (event) {
  const target = $(event.target);

  if (target.data("choice") === "yes") {
    // get data from local storage
    const myActivities = JSON.parse(localStorage.getItem("myActivities")) ?? {};

    // get the category
    const category = target.data("category");

    // get the category list
    const activities = myActivities[category] ?? [];

    // calculating current time
    const timeStamp = moment();
    choiceData.timeStamp = timeStamp;

    // push the choice data in the list
    activities.push(choiceData);

    // set the list back in object
    myActivities[category] = activities;

    // store choice data in local storage
    localStorage.setItem("myActivities", JSON.stringify(myActivities));
  }

  if (target.is("button")) {
    // render the selected activity card
    const categorySelected = target.data("category");
    renderActivityCard(categorySelected);
  }
};

// Add Dollar Sign to activity.price
const constructActivityCard = function (activity) {
  const activityParent = $("#card-container");

  const activityCard = `<div class="card ml-3 mr-3">
    <div class="card-content">
      <p id="activity-name" class="activity-text">
        ${activity.activity}
      </p>
      <p id="activity-type" class="activity-text">${activity.type}</p>
      <p id="activity-cost" class="activity-text">Cost Index: ${
        activity.price * 10
      }/10</p>
    </div>
    <div class="card-footer">
      <button data-choice="no" id="no-btn" class="card-footer-item button is-danger" data-category=${
        activity.type
      }>
        No
      </button>
      <button data-choice="yes" id="yes-btn" class="card-footer-item button is-success" data-category=${
        activity.type
      }>
        Yes
      </button>
    </div>
  </div>`;

  activityParent.empty();
  activityParent.append(activityCard);
};

choicesContainer.on("click", handleSelectedChoice);
cardContainer.on("click", handleUserChoices);
