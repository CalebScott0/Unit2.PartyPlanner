//cohort
const COHORT = "2403-ftb-wt-web-pt";
// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventsList = document.getElementById("events-container");

const addEventForm = document.getElementById("new-event-form");
addEventForm.addEventListener("submit", addEvent);

// Syncs state with API and rerender events onto page
async function render() {
  await fetchEvents();
  renderEvents();
}
render();

// fetch events from API and update state
async function fetchEvents() {
  try {
    const response = await fetch(API_URL);
    // throw new error if bad fetch call
    if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
    const data = await response.json();

    state.events = data.data;
  } catch (error) {
    console.log(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventsList.innerHtml = "<li>No Events Found</li>";
    return;
  }
  // reset html of events container
  eventsList.innerHTML = "";

  // create list card for each event
   state.events.forEach((element) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <h2>${element.name}</h2>
    <p>${element.description}</p>
    <p>${element.date}</p>
    <p>${element.location}</p>
    <button class = "delete-button" data-id="${element.id}">
    Delete</button
    `;
    eventsList.appendChild(li);

    // select created button from above
    const deleteBtn = li.querySelector(".delete-button");

    // add event listener to delete button
    deleteBtn.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvent(event.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

// create new event based on form data
async function addEvent(event) {
  event.preventDefault();

  // POST method
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
      }),
    });

    // throw new error if bad fetch call
    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    // reset html form values
    addArtistForm.name.value = "";
    addArtistForm.description.value = "";
    addArtistForm.date.value = "";
    addArtistForm.location.value = "";

    render();
  } catch (error) {
    console.log(error);
  }
}

async function removeEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        render();
    } catch(error) {
        console.log(error);
    }
}