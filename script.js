// ============================================
// AUTHENTICATION & SESSION MANAGEMENT
// PASTE THIS AT THE VERY TOP OF script.js
// ============================================

// Test users (Phase 1 - Hardcoded)
const testUsers = {
  user1: "1234",
  user2: "1234",
  user3: "1234",
};

let currentUser = null; // Currently logged-in user

// ---- Session Management ----

function checkAuthStatus() {
  // Check if user is logged in
  const loggedInUser = sessionStorage.getItem("currentUser");

  if (loggedInUser) {
    // User is logged in
    currentUser = loggedInUser;
    updateUserGreeting();
    showAppUI();
    loadData(); // Load this specific user's data
    init(); // Initialize app after DOM is ready and user is authenticated
  } else {
    // User is not logged in
    showLoginUI();
  }
}

function showLoginUI() {
  const loginContainer = document.getElementById("loginContainer");
  loginContainer.classList.remove("hidden");
  loginContainer.style.display = ""; // Ensure it's visible
  document.getElementById("appContainer").classList.add("hidden");
  document.getElementById("appContainer").style.display = "none"; // Hide app container
}

function showAppUI() {
  // #region agent log
  const loginContainer = document.getElementById("loginContainer");
  const appContainer = document.getElementById("appContainer");
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:41",
      message: "showAppUI() called",
      data: {
        loginContainerExists: !!loginContainer,
        appContainerExists: !!appContainer,
        loginContainerDisplay: loginContainer?.style.display,
        appContainerDisplay: appContainer?.style.display,
        appContainerClasses: appContainer?.className,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  if (loginContainer) {
    loginContainer.classList.add("hidden");
    loginContainer.style.display = "none"; // Ensure it's hidden
    updateUserGreeting(); // Add this line
  }
  if (appContainer) {
    appContainer.classList.remove("hidden");
    appContainer.style.display = ""; // Remove inline display:none
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:50",
        message: "showAppUI() after setting display",
        data: {
          appContainerDisplay: appContainer.style.display,
          appContainerVisible: appContainer.offsetParent !== null,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
  } else {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:54",
        message: "showAppUI() ERROR: appContainer not found",
        data: {},
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
  }
}

// ---- Login Handler ----

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("loginError");

  // Validate credentials
  if (testUsers[username] && testUsers[username] === password) {
    // Login successful
    sessionStorage.setItem("currentUser", username);
    currentUser = username;

    // Clear error
    errorDiv.style.display = "none";

    // Clear form
    document.getElementById("loginForm").reset();

    // Show app UI
    showAppUI();

    // Load user's data
    loadData();

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:70",
        message: "handleLogin calling init()",
        data: {
          progressChartExists: !!progressChart,
          mentalChartExists: !!mentalChart,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    // Reinitialize app
    init();
  } else {
    // Login failed
    errorDiv.textContent = "❌ Invalid username or password. Try user1/1234";
    errorDiv.style.display = "block";
  }
}
function updateUserGreeting() {
  const titleEl = document.getElementById("appTitle");
  if (currentUser && titleEl) {
    titleEl.innerHTML = `Habit Tracker Pro     <span style="color: var(--color-success); font-size: 0.85em; font-weight: 600;">👋 ${currentUser.toUpperCase()}</span>`;
  } else {
    titleEl.innerHTML = "Habit Tracker Pro";
  }
}

// ---- Logout Handler ----

function handleLogout() {
  const confirmed = confirm("Are you sure you want to logout?");

  if (confirmed) {
    // Clear session
    sessionStorage.removeItem("currentUser");
    currentUser = null;

    // Show login UI
    showLoginUI();

    // Clear form
    document.getElementById("loginForm").reset();
    document.getElementById("loginError").style.display = "none";
  }
}

// ============================================
// REST OF YOUR EXISTING SCRIPT CONTINUES BELOW
// ============================================

// Data Structure

let habitData = {
  habits: [
    { id: 1, name: "Wake up at 05:00", emoji: "⏰" },
    { id: 2, name: "Gym", emoji: "💪" },
    { id: 3, name: "Reading / Learning", emoji: "📚" },
    { id: 4, name: "Day Planning", emoji: "📝" },
    { id: 5, name: "Budget Tracking", emoji: "💰" },
    { id: 6, name: "Project Work", emoji: "🎯" },
    { id: 7, name: "No Alcohol", emoji: "🚫" },
    { id: 8, name: "Social Media Detox", emoji: "🌿" },
    { id: 9, name: "Goal Journaling", emoji: "📓" },
    { id: 10, name: "Cold Shower", emoji: "🚿" },
  ],
  completions: {},
  mentalState: {
    mood: {},
    motivation: {},
  },
  currentMonth: 10,
  currentYear: 2025,
  mentalStateView: "month",
  calendarView: "month", // NEW: 'month' or 'week'
  theme: "light", // NEW: 'light' or 'dark'
  currentWeekStart: null, // NEW: for week view
};

const emojis = [
  "⏰",
  "💪",
  "📚",
  "📝",
  "💰",
  "🎯",
  "🚫",
  "🌿",
  "📓" /*made by me                                 */,
  "🚿",
  "🏃",
  "🧘",
  "💧",
  "🥗",
  "😴",
  "🎨",
  "🎵",
  "🧠",
  "💻",
  "📱",
  "🚶",
  "🚴",
  "🏊",
  "⚽",
  "🎮",
  "📖",
  "✍️",
  "🗣️",
];

// Badge definitions
const badges = [
  {
    id: "first_day",
    name: "First Step",
    icon: "👣",
    requirement: 1,
    desc: "Complete 1 day",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    icon: "⚔️",
    requirement: 7,
    desc: "7 day streak",
  },
  {
    id: "month_master",
    name: "Month Master",
    icon: "👑",
    requirement: 30,
    desc: "30 day streak",
  },
  {
    id: "perfect_week",
    name: "Perfect Week",
    icon: "✨",
    requirement: 7,
    desc: "100% for 7 days",
  },
  {
    id: "century",
    name: "Centurion",
    icon: "💯",
    requirement: 100,
    desc: "100 completions",
  },
  {
    id: "dedication",
    name: "Dedicated",
    icon: "🔥",
    requirement: 50,
    desc: "50 day streak",
  },
];

let selectedEmoji = "⏰";
let progressChart, mentalChart;
let isInitializing = false; // Guard to prevent concurrent init() calls

// Initialize
function init() {
  // Prevent concurrent initialization
  if (isInitializing) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:214",
        message: "init() already in progress, skipping",
        data: {},
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    return;
  }
  isInitializing = true;
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:214",
      message: "init() called",
      data: {
        progressChartExists: !!progressChart,
        mentalChartExists: !!mentalChart,
        canvasExists: !!document.getElementById("progressChart"),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  try {
    loadData();
    applyTheme();
    generateEmojiGrid();
    generateCalendar();
    updateStats();
    generateStreaksAndBadges();
    createCharts();
    generateAnalysis();
    updateToggleButtons();
  } finally {
    isInitializing = false;
  }
}

// Local Storage
// function saveData() {
//   localStorage.setItem("habitTrackerData", JSON.stringify(habitData));
// }
function saveData() {
  const key = `user_${currentUser}_habitTrackerData`;
  localStorage.setItem(key, JSON.stringify(habitData));
}

// function loadData() {
//   const saved = localStorage.getItem("habitTrackerData");
//   if (saved) {
//     habitData = JSON.parse(saved);
//     if (!habitData.mentalStateView) habitData.mentalStateView = "month";
//     if (!habitData.calendarView) habitData.calendarView = "month";
//     if (!habitData.theme) habitData.theme = "light";
//   } else {
//     generateSampleData();
//   }
// }

function loadData() {
  const key = `user_${currentUser}_habitTrackerData`;
  const saved = localStorage.getItem(key);

  if (saved) {
    habitData = JSON.parse(saved);
    if (!habitData.mentalStateView) habitData.mentalStateView = "month";
    if (!habitData.calendarView) habitData.calendarView = "month";
    if (!habitData.theme) habitData.theme = "light";
  } else {
    generateSampleData();
  }
}

function generateSampleData() {
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();
  habitData.habits.forEach((habit) => {
    habitData.completions[habit.id] = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${habitData.currentYear}-${String(
        habitData.currentMonth + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (Math.random() > 0.3) {
        habitData.completions[habit.id][dateStr] = true;
      }
    }
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${habitData.currentYear}-${String(
      habitData.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    habitData.mentalState.mood[dateStr] = Math.floor(Math.random() * 4) + 6;
    habitData.mentalState.motivation[dateStr] =
      Math.floor(Math.random() * 4) + 5;
  }
  saveData();
}

// NEW: Theme Toggle
function toggleTheme() {
  habitData.theme = habitData.theme === "light" ? "dark" : "light";
  saveData();
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", habitData.theme);
  const themeIcon = document.querySelector(".theme-icon");
  if (themeIcon) {
    themeIcon.textContent = habitData.theme === "light" ? "🌙" : "☀️";
  }
}

// NEW: Calendar View Toggle (Month/Week)
function setCalendarView(view) {
  habitData.calendarView = view;
  if (view === "week" && !habitData.currentWeekStart) {
    // Set to current week
    const today = new Date();
    habitData.currentWeekStart = getWeekStart(today);
  }
  saveData();
  updateCalendarViewButtons();
  generateCalendar();
}

function updateCalendarViewButtons() {
  const monthBtn = document.getElementById("monthViewCalBtn");
  const weekBtn = document.getElementById("weekViewCalBtn");

  if (habitData.calendarView === "month") {
    monthBtn.classList.add("active");
    weekBtn.classList.remove("active");
  } else {
    monthBtn.classList.remove("active");
    weekBtn.classList.add("active");
  }
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

// Mental State View Toggle
function setMentalStateView(view) {
  habitData.mentalStateView = view;
  saveData();
  updateToggleButtons();
  generateMentalStateGrids();
}

function updateToggleButtons() {
  const monthBtn = document.getElementById("monthViewBtn");
  const dayBtn = document.getElementById("dayViewBtn");

  if (habitData.mentalStateView === "month") {
    monthBtn.classList.add("active");
    dayBtn.classList.remove("active");
  } else {
    monthBtn.classList.remove("active");
    dayBtn.classList.add("active");
  }

  updateCalendarViewButtons();
}

// NEW: Streak Calculation
function calculateStreak(habitId) {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    if (habitData.completions[habitId]?.[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateBestStreak(habitId) {
  const completionDates = Object.keys(habitData.completions[habitId] || {})
    .filter((date) => habitData.completions[habitId][date])
    .sort();

  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate = null;

  completionDates.forEach((dateStr) => {
    const currentDate = new Date(dateStr);

    if (prevDate) {
      const dayDiff = Math.floor(
        (currentDate - prevDate) / (1000 * 60 * 60 * 24)
      );
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    prevDate = currentDate;
  });

  return maxStreak;
}

// NEW: Generate Streaks & Badges
function generateStreaksAndBadges() {
  // Generate Streaks
  let streaksHtml = '<div class="section-title">🔥 Current Streaks</div>';
  let maxStreak = 0;

  habitData.habits.forEach((habit) => {
    const streak = calculateStreak(habit.id);
    if (streak > 0) {
      streaksHtml += `
                <div class="streak-item">
                    <span class="streak-name">${habit.emoji} ${
        habit.name
      }</span>
                    <span class="streak-count">${streak} ${
        streak === 1 ? "day" : "days"
      } <span class="streak-fire">🔥</span></span>
                </div>
            `;
      maxStreak = Math.max(maxStreak, calculateBestStreak(habit.id));
    }
  });

  if (habitData.habits.every((h) => calculateStreak(h.id) === 0)) {
    streaksHtml +=
      '<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">Start completing habits to build streaks!</div>';
  }

  document.getElementById("streaksContainer").innerHTML = streaksHtml;
  document.getElementById("bestStreak").textContent = maxStreak + " days";

  // Generate Badges
  const totalCompletions = getTotalCompletions();
  const earnedBadges = getEarnedBadges();

  let badgesHtml =
    '<div class="section-title">🏆 Achievements</div><div class="badges-grid">';

  badges.forEach((badge) => {
    const earned = earnedBadges.includes(badge.id);
    badgesHtml += `
            <div class="badge ${earned ? "earned" : ""}" title="${badge.desc}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `;
  });

  badgesHtml += "</div>";
  document.getElementById("badgesContainer").innerHTML = badgesHtml;
}

function getTotalCompletions() {
  let total = 0;
  habitData.habits.forEach((habit) => {
    Object.keys(habitData.completions[habit.id] || {}).forEach((date) => {
      if (habitData.completions[habit.id][date]) total++;
    });
  });
  return total;
}

function getEarnedBadges() {
  const earned = [];
  const totalCompletions = getTotalCompletions();

  habitData.habits.forEach((habit) => {
    const streak = calculateBestStreak(habit.id);

    if (totalCompletions >= 1 && !earned.includes("first_day"))
      earned.push("first_day");
    if (streak >= 7 && !earned.includes("week_warrior"))
      earned.push("week_warrior");
    if (streak >= 30 && !earned.includes("month_master"))
      earned.push("month_master");
    if (streak >= 50 && !earned.includes("dedication"))
      earned.push("dedication");
    if (totalCompletions >= 100 && !earned.includes("century"))
      earned.push("century");
  });

  // Check perfect week
  const today = new Date();
  let perfectWeek = true;
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = `${checkDate.getFullYear()}-${String(
      checkDate.getMonth() + 1
    ).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;

    const dayComplete = habitData.habits.every(
      (habit) => habitData.completions[habit.id]?.[dateStr]
    );

    if (!dayComplete) {
      perfectWeek = false;
      break;
    }
  }

  if (perfectWeek && habitData.habits.length > 0) earned.push("perfect_week");

  return earned;
}

// Generate Calendar (UPDATED for Week View)
function generateCalendar() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (habitData.calendarView === "week") {
    generateWeekView();
  } else {
    generateMonthView();
  }
}

function generateWeekView() {
  const weekStart = habitData.currentWeekStart || getWeekStart(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById("monthTitle").textContent = `Week of ${
    monthNames[weekStart.getMonth()]
  } ${weekStart.getDate()}, ${weekStart.getFullYear()}`;

  let html = "<thead><tr><th>My Habits</th>";
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(currentDay.getDate() + i);
    html += `<th>${dayNames[i]}<br>${currentDay.getDate()}</th>`;
  }
  html += "</tr></thead><tbody>";

  // Habit rows
  habitData.habits.forEach((habit) => {
    html += `<tr><td class="habit-name">${habit.name} ${habit.emoji}</td>`;

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(currentDay.getDate() + i);
      const dateStr = `${currentDay.getFullYear()}-${String(
        currentDay.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;
      const isChecked = habitData.completions[habit.id]?.[dateStr] || false;
      html += `<td><div class="checkbox ${
        isChecked ? "checked" : ""
      }" onclick="toggleHabit(${habit.id}, '${dateStr}')"></div></td>`;
    }

    html += "</tr>";
  });

  html += "</tbody>";
  document.getElementById("calendarTable").innerHTML = html;
  generateMentalStateGrids();
}

function generateMonthView() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById("monthTitle").textContent = `${
    monthNames[habitData.currentMonth]
  } ${habitData.currentYear}`;

  const firstDay = new Date(
    habitData.currentYear,
    habitData.currentMonth,
    1
  ).getDay();
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();

  let html = "<thead><tr><th>My Habits</th>";

  const weeks = Math.ceil((firstDay + daysInMonth) / 7);
  for (let week = 1; week <= weeks; week++) {
    html += `<th colspan="7">Week ${week}</th>`;
  }
  html += "</tr><tr><th></th>";

  // Day names row
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  for (let week = 0; week < weeks; week++) {
    dayNames.forEach((day) => {
      html += `<th>${day}</th>`;
    });
  }
  html += "</tr>";

  // Day numbers row
  html += '<tr class="day-numbers-row"><th>Day</th>';
  let dayCounter = 1;
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
        html += "<th></th>";
      } else {
        html += `<th class="day-number-cell">${dayCounter}</th>`;
        dayCounter++;
      }
    }
  }
  html += "</tr></thead><tbody>";

  // Habit rows
  habitData.habits.forEach((habit) => {
    html += `<tr><td class="habit-name">${habit.name} ${habit.emoji}</td>`;

    dayCounter = 1;
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
          html += "<td></td>";
        } else {
          const dateStr = `${habitData.currentYear}-${String(
            habitData.currentMonth + 1
          ).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
          const isChecked = habitData.completions[habit.id]?.[dateStr] || false;
          html += `<td><div class="checkbox ${
            isChecked ? "checked" : ""
          }" onclick="toggleHabit(${habit.id}, '${dateStr}')"></div></td>`;
          dayCounter++;
        }
      }
    }
    html += "</tr>";
  });

  // Summary rows
  html += '<tr class="summary-row"><td>Progress</td>';
  dayCounter = 1;
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
        html += "<td></td>";
      } else {
        const dateStr = `${habitData.currentYear}-${String(
          habitData.currentMonth + 1
        ).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
        const progress = calculateDayProgress(dateStr);
        html += `<td>${progress}%</td>`;
        dayCounter++;
      }
    }
  }
  html += "</tr>";

  html += '<tr class="summary-row"><td>Done</td>';
  dayCounter = 1;
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
        html += "<td></td>";
      } else {
        const dateStr = `${habitData.currentYear}-${String(
          habitData.currentMonth + 1
        ).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
        const done = calculateDayDone(dateStr);
        html += `<td>${done}</td>`;
        dayCounter++;
      }
    }
  }
  html += "</tr>";

  html += '<tr class="summary-row"><td>Not Done</td>';
  dayCounter = 1;
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
        html += "<td></td>";
      } else {
        const dateStr = `${habitData.currentYear}-${String(
          habitData.currentMonth + 1
        ).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
        const notDone = habitData.habits.length - calculateDayDone(dateStr);
        html += `<td>${notDone}</td>`;
        dayCounter++;
      }
    }
  }
  html += "</tr>";

  html += "</tbody>";
  document.getElementById("calendarTable").innerHTML = html;

  generateMentalStateGrids();
}

function generateMentalStateGrids() {
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();

  let dayNumberHtml = '<div class="mental-label">Day</div>';
  let moodHtml = '<div class="mental-label">Mood</div>';
  let motivationHtml = '<div class="mental-label">Motivation</div>';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${habitData.currentYear}-${String(
      habitData.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const mood = habitData.mentalState.mood[dateStr] || "-";
    const motivation = habitData.mentalState.motivation[dateStr] || "-";

    dayNumberHtml += `<div class="day-number">${day}</div>`;
    moodHtml += `<div class="mental-value" onclick="setMentalState('mood', '${dateStr}', ${day})">${mood}</div>`;
    motivationHtml += `<div class="mental-value" onclick="setMentalState('motivation', '${dateStr}', ${day})">${motivation}</div>`;
  }

  document.getElementById("dayNumberGrid").innerHTML = dayNumberHtml;
  document.getElementById("moodGrid").innerHTML = moodHtml;
  document.getElementById("motivationGrid").innerHTML = motivationHtml;
}

function setMentalState(type, dateStr, dayNum) {
  const value = prompt(`Enter ${type} rating for Day ${dayNum} (1-10):`);
  if (value === null || value === "") {
    return;
  }

  const numValue = parseInt(value);
  if (isNaN(numValue) || numValue < 1 || numValue > 10) {
    alert("❌ Please enter a number between 1 and 10");
    return;
  }

  habitData.mentalState[type][dateStr] = numValue;
  saveData();
  generateMentalStateGrids();
  updateMentalChart();
}

function calculateDayProgress(dateStr) {
  let completed = 0;
  habitData.habits.forEach((habit) => {
    if (habitData.completions[habit.id]?.[dateStr]) {
      completed++;
    }
  });
  return habitData.habits.length > 0
    ? Math.round((completed / habitData.habits.length) * 100)
    : 0;
}

function calculateDayDone(dateStr) {
  let completed = 0;
  habitData.habits.forEach((habit) => {
    if (habitData.completions[habit.id]?.[dateStr]) {
      completed++;
    }
  });
  return completed;
}

function toggleHabit(habitId, dateStr) {
  if (!habitData.completions[habitId]) {
    habitData.completions[habitId] = {};
  }
  habitData.completions[habitId][dateStr] =
    !habitData.completions[habitId][dateStr];
  saveData();
  generateCalendar();
  updateStats();
  generateStreaksAndBadges();
  updateProgressChart();
  generateAnalysis();
}

function updateStats() {
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();
  let totalCompletions = 0;
  let totalPossible = habitData.habits.length * daysInMonth;

  habitData.habits.forEach((habit) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${habitData.currentYear}-${String(
        habitData.currentMonth + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (habitData.completions[habit.id]?.[dateStr]) {
        totalCompletions++;
      }
    }
  });

  const progress =
    totalPossible > 0
      ? Math.round((totalCompletions / totalPossible) * 100)
      : 0;

  document.getElementById("totalHabits").textContent = habitData.habits.length;
  document.getElementById("completedHabits").textContent = totalCompletions;
  document.getElementById("progressPercent").textContent = progress + "%";
  document.getElementById("progressBar").style.width = progress + "%";
}

function generateAnalysis() {
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();
  let html = "";

  const habitProgress = habitData.habits.map((habit) => {
    let completed = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${habitData.currentYear}-${String(
        habitData.currentMonth + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (habitData.completions[habit.id]?.[dateStr]) {
        completed++;
      }
    }
    return { habit, completed, goal: daysInMonth };
  });

  habitProgress.sort((a, b) => b.completed - a.completed);

  habitProgress.forEach((item) => {
    const percent = Math.round((item.completed / item.goal) * 100);
    html += `
            <div class="analysis-item">
                <div class="analysis-label">Goal</div>
                <div class="analysis-value">${item.goal}</div>
                <div class="analysis-label" style="grid-column: 1">${item.completed}</div>
                <div class="analysis-bar" style="grid-column: 2 / 4">
                    <div class="analysis-bar-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
  });

  document.getElementById("analysisContainer").innerHTML = html;
}

function createCharts() {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:906",
      message: "createCharts() called",
      data: {
        progressChartExists: !!progressChart,
        mentalChartExists: !!mentalChart,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  createProgressChart();
  createMentalChart();
}

function createProgressChart() {
  // #region agent log
  const canvasEl = document.getElementById("progressChart");
  const canvasExists = !!canvasEl;
  const chartExists = !!progressChart;
  const chartId = progressChart?.id;
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:911",
      message: "createProgressChart() entry",
      data: {
        canvasExists,
        chartExists,
        chartId,
        stackTrace: new Error().stack?.split("\n").slice(0, 5).join("|"),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  if (!canvasEl) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:911",
        message: "Canvas not found",
        data: {},
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    return;
  }
  // Destroy existing chart if it exists (check both variable and Chart.js registry)
  // #region agent log
  const hasGetChart = typeof Chart.getChart === "function";
  let existingChartFromRegistry = null;
  try {
    existingChartFromRegistry = Chart.getChart
      ? Chart.getChart(canvasEl)
      : null;
  } catch (e) {
    existingChartFromRegistry = null;
  }
  // Also try accessing via canvas internal property (fallback for some Chart.js versions)
  let existingChartFromCanvas = null;
  if (!existingChartFromRegistry && canvasEl && canvasEl.chart) {
    existingChartFromCanvas = canvasEl.chart;
  }
  const finalExistingChart =
    existingChartFromRegistry || existingChartFromCanvas;
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:945",
      message: "Checking for existing charts",
      data: {
        progressChartExists: !!progressChart,
        hasGetChart,
        existingChartFromRegistry: !!existingChartFromRegistry,
        existingChartFromCanvas: !!existingChartFromCanvas,
        finalExistingChart: !!finalExistingChart,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "D",
    }),
  }).catch(() => {});
  // #endregion
  if (progressChart) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:952",
        message: "Destroying existing progressChart from variable",
        data: { chartId: progressChart.id },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    try {
      progressChart.destroy();
    } catch (e) {
      // Ignore destroy errors
    }
    progressChart = null;
  }
  // Check if Chart.js has a chart registered on this canvas (even if our variable is null)
  if (finalExistingChart) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:963",
        message: "Destroying existing chart from registry",
        data: { chartId: finalExistingChart.id },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "D",
      }),
    }).catch(() => {});
    // #endregion
    try {
      finalExistingChart.destroy();
    } catch (e) {
      // Ignore destroy errors
    }
  }
  const ctx = canvasEl.getContext("2d");
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();

  const labels = [];
  const data = [];

  for (let day = 1; day <= daysInMonth; day++) {
    labels.push(day);
    const dateStr = `${habitData.currentYear}-${String(
      habitData.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    data.push(calculateDayProgress(dateStr));
  }

  // Force destroy any existing chart one more time right before creation (defensive)
  try {
    if (Chart.getChart && Chart.getChart(canvasEl)) {
      Chart.getChart(canvasEl).destroy();
    }
  } catch (e) {}
  try {
    if (canvasEl && canvasEl.chart) {
      canvasEl.chart.destroy();
      canvasEl.chart = null;
    }
  } catch (e) {}

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:1008",
      message: "About to create Chart instance",
      data: { chartExists: !!progressChart },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  try {
    progressChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Progress",
            data: data,
            backgroundColor: "rgba(139, 195, 74, 0.3)",
            borderColor: "rgba(139, 195, 74, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
        },
      },
    });
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:1017",
        message: "Chart created successfully",
        data: { chartId: progressChart.id },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
  } catch (error) {
    // #region agent log
    const errorMsg = error?.message || String(error);
    const errorStr = errorMsg.toLowerCase();
    fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "script copy.js:1028",
        message: "Chart creation failed, attempting recovery",
        data: { errorMessage: errorMsg, errorName: error?.name, errorStr },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    // If error is about canvas already in use, try to destroy and recreate
    if (
      errorStr.includes("already in use") ||
      errorStr.includes("must be destroyed")
    ) {
      // Try multiple methods to get the existing chart and destroy it
      let existingChart = null;
      if (Chart.getChart) {
        existingChart = Chart.getChart(canvasEl);
      }
      if (!existingChart && canvasEl && canvasEl.chart) {
        existingChart = canvasEl.chart;
      }
      if (existingChart) {
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "script copy.js:1040",
              message: "Destroying chart from registry after error",
              data: { chartId: existingChart.id },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "post-fix",
              hypothesisId: "A",
            }),
          }
        ).catch(() => {});
        // #endregion
        try {
          existingChart.destroy();
        } catch (destroyError) {
          // Ignore destroy errors
        }
      } else {
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "script copy.js:1048",
              message: "Could not find existing chart to destroy",
              data: {},
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "post-fix",
              hypothesisId: "A",
            }),
          }
        ).catch(() => {});
        // #endregion
      }
      // Retry creating the chart
      progressChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Daily Progress",
              data: data,
              backgroundColor: "rgba(139, 195, 74, 0.3)",
              borderColor: "rgba(139, 195, 74, 1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          },
        },
      });
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "script copy.js:1055",
            message: "Chart created successfully after recovery",
            data: { chartId: progressChart.id },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "post-fix",
            hypothesisId: "A",
          }),
        }
      ).catch(() => {});
      // #endregion
    } else {
      // Re-throw if it's a different error
      throw error;
    }
  }
}

function createMentalChart() {
  const canvasEl = document.getElementById("mentalChart");
  if (!canvasEl) {
    return;
  }
  // Destroy existing chart if it exists (check both variable and Chart.js registry)
  if (mentalChart) {
    mentalChart.destroy();
    mentalChart = null;
  }
  // Check if Chart.js has a chart registered on this canvas (even if our variable is null)
  const existingChart = Chart.getChart(canvasEl);
  if (existingChart) {
    existingChart.destroy();
  }
  const ctx = canvasEl.getContext("2d");
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();

  const labels = [];
  const moodData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    labels.push(day);
    const dateStr = `${habitData.currentYear}-${String(
      habitData.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    moodData.push((habitData.mentalState.mood[dateStr] || 0) * 10);
  }

  mentalChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mood",
          data: moodData,
          backgroundColor: "rgba(225, 190, 231, 0.3)",
          borderColor: "rgba(225, 190, 231, 1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });
}

function updateProgressChart() {
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();
  const data = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${habitData.currentYear}-${String(
      habitData.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    data.push(calculateDayProgress(dateStr));
  }

  progressChart.data.datasets[0].data = data;
  progressChart.update();
}

function updateMentalChart() {
  const daysInMonth = new Date(
    habitData.currentYear,
    habitData.currentMonth + 1,
    0
  ).getDate();
  const moodData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${habitData.currentYear}-${String(
      habitData.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    moodData.push((habitData.mentalState.mood[dateStr] || 0) * 10);
  }

  mentalChart.data.datasets[0].data = moodData;
  mentalChart.update();
}

function changeMonth(direction) {
  if (habitData.calendarView === "week") {
    // Change week
    const newWeekStart = new Date(habitData.currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + direction * 7);
    habitData.currentWeekStart = newWeekStart;
  } else {
    // Change month
    habitData.currentMonth += direction;
    if (habitData.currentMonth > 11) {
      habitData.currentMonth = 0;
      habitData.currentYear++;
    } else if (habitData.currentMonth < 0) {
      habitData.currentMonth = 11;
      habitData.currentYear--;
    }
  }

  generateCalendar();
  updateStats();
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:1081",
      message: "About to destroy charts in changeMonth",
      data: {
        progressChartExists: !!progressChart,
        mentalChartExists: !!mentalChart,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  if (progressChart) progressChart.destroy();
  if (mentalChart) mentalChart.destroy();
  createCharts();
  generateAnalysis();
}

// Modal Functions
function generateEmojiGrid() {
  let html = "";
  emojis.forEach((emoji) => {
    html += `<div class="emoji-option ${
      emoji === selectedEmoji ? "selected" : ""
    }" onclick="selectEmoji('${emoji}')">${emoji}</div>`;
  });
  document.getElementById("emojiGrid").innerHTML = html;
}

function selectEmoji(emoji) {
  selectedEmoji = emoji;
  generateEmojiGrid();
}

function openHabitModal() {
  document.getElementById("habitModal").classList.add("active");
  document.getElementById("habitNameInput").value = "";
}

function closeHabitModal() {
  document.getElementById("habitModal").classList.remove("active");
}

function addHabit() {
  const name = document.getElementById("habitNameInput").value.trim();
  if (!name) {
    alert("Please enter a habit name");
    return;
  }

  const newId = Math.max(...habitData.habits.map((h) => h.id), 0) + 1;
  habitData.habits.push({
    id: newId,
    name: name,
    emoji: selectedEmoji,
  });

  habitData.completions[newId] = {};
  saveData();
  closeHabitModal();
  generateCalendar();
  updateStats();
  generateStreaksAndBadges();
  generateAnalysis();
}

// Remove Habit Functions
function openRemoveModal() {
  generateHabitList();
  document.getElementById("removeHabitModal").classList.add("active");
}

function closeRemoveModal() {
  document.getElementById("removeHabitModal").classList.remove("active");
}

function generateHabitList() {
  let html = "";
  if (habitData.habits.length === 0) {
    html =
      '<p style="text-align: center; color: #999; padding: 20px;">No habits to remove</p>';
  } else {
    habitData.habits.forEach((habit) => {
      html += `
                <div class="habit-item">
                    <div class="habit-item-name">${habit.emoji} ${habit.name}</div>
                    <button class="btn-remove" onclick="removeHabit(${habit.id})">Remove</button>
                </div>
            `;
    });
  }
  document.getElementById("habitListToRemove").innerHTML = html;
}

function removeHabit(habitId) {
  if (
    confirm(
      "Are you sure you want to remove this habit? All data will be permanently deleted."
    )
  ) {
    habitData.habits = habitData.habits.filter((h) => h.id !== habitId);
    delete habitData.completions[habitId];
    saveData();
    generateHabitList();
    generateCalendar();
    updateStats();
    generateStreaksAndBadges();
    updateProgressChart();
    generateAnalysis();
  }
}

// Initialize app - only after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/5516eadf-792a-4633-82a7-3b66c0d32be7", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "script copy.js:1247",
      message: "DOMContentLoaded fired",
      data: { canvasExists: !!document.getElementById("progressChart") },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "E",
    }),
  }).catch(() => {});
  // #endregion
  checkAuthStatus();
});
