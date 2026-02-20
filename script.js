// Initialize counters and constants
let attendeeCount = 0;
let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;
let attendees = [];
const MAX_ATTENDEES = 50;

// Get form elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingElement = document.getElementById("greeting");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const attendeeListContainer = document.getElementById("attendeeListContainer");

// Load counts from local storage on page load
loadCountsFromLocalStorage();

// Load attendees from local storage on page load
loadAttendeesFromLocalStorage();
displayAttendeeList();

// Listen for form submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the values from input and dropdown
  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  // Check if inputs are valid
  if (!attendeeName || !selectedTeam) {
    return;
  }

  // Increment the total attendee count
  attendeeCount = attendeeCount + 1;

  // Update the correct team's count based on selected team
  if (selectedTeam === "water") {
    waterCount = waterCount + 1;
    updateTeamCount("water", waterCount, waterCountDisplay);
  } else if (selectedTeam === "zero") {
    zeroCount = zeroCount + 1;
    updateTeamCount("zero", zeroCount, zeroCountDisplay);
  } else if (selectedTeam === "power") {
    powerCount = powerCount + 1;
    updateTeamCount("power", powerCount, powerCountDisplay);
  }

  // Show the updated total count on the page
  attendeeCountDisplay.textContent = attendeeCount;

  // Calculate the percentage of the goal completed
  const progressPercentage = (attendeeCount / MAX_ATTENDEES) * 100;

  // Update the width of the progress bar using the percentage
  progressBar.style.width = progressPercentage + "%";

  // Save counts to local storage
  saveCountsToLocalStorage();

  // Add attendee to the list
  attendees.push({
    name: attendeeName,
    team: selectedTeam,
  });
  saveAttendeesToLocalStorage();
  displayAttendeeList();

  // Get the team label based on the team value
  const teamLabel = getTeamLabel(selectedTeam);

  // Combine name and team into a welcome message
  const welcomeMessage = `Welcome ${attendeeName} to ${teamLabel}!`;

  // Show a success message with someone's name and team
  displayGreeting(welcomeMessage);

  // Check if the attendance goal has been reached
  if (attendeeCount === MAX_ATTENDEES) {
    displayCelebration();
  }

  // Reset the form after it's submitted
  checkInForm.reset();
});

// Function to get the full team label from team value
function getTeamLabel(teamValue) {
  if (teamValue === "water") {
    return "🌊 Team Water Wise";
  } else if (teamValue === "zero") {
    return "🌿 Team Net Zero";
  } else if (teamValue === "power") {
    return "⚡ Team Renewables";
  }
}

// Function to update team count on the page
function updateTeamCount(teamValue, count, displayElement) {
  displayElement.textContent = count;
}

// Function to display the greeting message
function displayGreeting(message) {
  greetingElement.textContent = message;
  greetingElement.className = "success-message";
  greetingElement.style.display = "block";

  // Hide the message after 3 seconds
  setTimeout(function () {
    greetingElement.style.display = "none";
  }, 3000);
}

// Function to display the celebration message when goal is reached
function displayCelebration() {
  // Determine the winning team by comparing counts
  let winningTeam = "Team Water Wise";
  let highestCount = waterCount;

  if (zeroCount > highestCount) {
    winningTeam = "Team Net Zero";
    highestCount = zeroCount;
  }

  if (powerCount > highestCount) {
    winningTeam = "Team Renewables";
    highestCount = powerCount;
  }

  // Create celebration message with the winning team's name
  const celebrationMessage = `🎉 Congratulations! We've reached 50 attendees! 🎉 ${winningTeam} is leading the way!`;

  // Display the celebration message
  greetingElement.textContent = celebrationMessage;
  greetingElement.className = "success-message";
  greetingElement.style.display = "block";
  greetingElement.style.fontSize = "20px";
  greetingElement.style.fontWeight = "bold";

  // Keep the celebration message visible longer
  setTimeout(function () {
    greetingElement.style.display = "none";
  }, 5000);
}

// Function to save counts to local storage
function saveCountsToLocalStorage() {
  localStorage.setItem("attendeeCount", attendeeCount);
  localStorage.setItem("waterCount", waterCount);
  localStorage.setItem("zeroCount", zeroCount);
  localStorage.setItem("powerCount", powerCount);
}

// Function to load counts from local storage
function loadCountsFromLocalStorage() {
  const savedAttendeeCount = localStorage.getItem("attendeeCount");
  const savedWaterCount = localStorage.getItem("waterCount");
  const savedZeroCount = localStorage.getItem("zeroCount");
  const savedPowerCount = localStorage.getItem("powerCount");

  if (savedAttendeeCount !== null) {
    attendeeCount = parseInt(savedAttendeeCount);
  }

  if (savedWaterCount !== null) {
    waterCount = parseInt(savedWaterCount);
  }

  if (savedZeroCount !== null) {
    zeroCount = parseInt(savedZeroCount);
  }

  if (savedPowerCount !== null) {
    powerCount = parseInt(savedPowerCount);
  }

  // Update the display with loaded counts
  attendeeCountDisplay.textContent = attendeeCount;
  waterCountDisplay.textContent = waterCount;
  zeroCountDisplay.textContent = zeroCount;
  powerCountDisplay.textContent = powerCount;

  // Update progress bar based on loaded count
  const progressPercentage = (attendeeCount / MAX_ATTENDEES) * 100;
  progressBar.style.width = progressPercentage + "%";
}

// Function to save attendees to local storage
function saveAttendeesToLocalStorage() {
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Function to load attendees from local storage
function loadAttendeesFromLocalStorage() {
  const savedAttendees = localStorage.getItem("attendees");

  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
}

// Function to display the attendee list
function displayAttendeeList() {
  if (attendees.length === 0) {
    attendeeListContainer.innerHTML =
      "<p class='no-attendees'>No attendees yet</p>";
    return;
  }

  let attendeeHTML = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const teamLabel = getTeamLabel(attendee.team);
    const teamClass = attendee.team;

    attendeeHTML =
      attendeeHTML +
      `<div class="attendee-item ${teamClass}">
      <div class="attendee-name">${attendee.name}</div>
      <div class="attendee-team">${teamLabel}</div>
    </div>`;
  }

  attendeeListContainer.innerHTML = attendeeHTML;
}
