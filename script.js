document.addEventListener("DOMContentLoaded", () => {
    
  // --- Navigation Elements ---
  const homePage = document.querySelector("section.allElems");
  const allCards = document.querySelectorAll(".elem");
  const allFullPages = document.querySelectorAll(".fullElem");
  const allBackButtons = document.querySelectorAll(".fullElem .back");

  // --- Navigation Functions ---

  // Function to hide the home page and show a specific full page
  const showFullPage = (pageIndex) => {
    if (homePage) {
      homePage.style.display = "none";
    }
    if (allFullPages[pageIndex]) {
      allFullPages[pageIndex].style.display = "block";
      localStorage.setItem("activeSectionId", pageIndex);
    }
  };

  // Function to hide all full pages and show the home page
  const showHomePage = () => {
    allFullPages.forEach((page) => {
      page.style.display = "none";
    });
    if (homePage) {
      homePage.style.display = "block";
    }
    localStorage.removeItem("activeSectionId");
  };

  // --- Event Listeners for Navigation ---

  // Add click event listeners to all cards to open a full page
  allCards.forEach((card) => {
    card.addEventListener("click", function () {
      showFullPage(this.id);
    });
  });

  // Add click event listeners to all back buttons to return to the home page
  allBackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showHomePage();
    });
  });

  // --- Check Local Storage on Page Load ---
  // Restore the last opened section or show the home page
  const activeId = localStorage.getItem("activeSectionId");
  if (activeId && allFullPages[activeId]) {
    showFullPage(activeId);
  } else {
    showHomePage(); // Default to showing the home page
  }

  //-----------------------------------------------------------------
  //task management system
  //-----------------------------------------------------------------
  let currentTask = [];
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    localStorage.setItem("currentTask", JSON.stringify(currentTask));
  }

  function renderTasks() {
    let alltaskContainer = document.querySelector(".alltask");
    if (!alltaskContainer) return;
    let sum = "";
    currentTask.forEach((task, index) => {
      sum += `
                <div class="task">
                    <h5 class="${task.completed ? "strike" : ""}">${
        task.title
      }</h5>
                    <div class="task-actions">
                        <button class="tick-btn ${
                          task.completed ? "completed" : ""
                        }" data-index="${index}">
                            <i class="ri-check-line"></i>
                        </button>
                        <button class="delete-btn" data-index="${index}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </div>`;
    });
    alltaskContainer.innerHTML = sum;
    attachTickEvents();
    attachDeleteEvents();
  }

  let form = document.querySelector(".addtask form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let input = document.querySelector("#taskInput");
      let inputdetails = document.querySelector("#taskDescription");
      if (input.value.trim() === "") {
        return;
      }
      currentTask.push({
        title: input.value.trim(),
        details: inputdetails.value.trim(),
        completed: false,
      });
      input.value = "";
      inputdetails.value = "";
      localStorage.setItem("currentTask", JSON.stringify(currentTask));
      renderTasks();
    });
  }

  function attachTickEvents() {
    document.querySelectorAll(".tick-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        currentTask[index].completed = !currentTask[index].completed;
        localStorage.setItem("currentTask", JSON.stringify(currentTask));
        renderTasks();
      });
    });
  }

  function attachDeleteEvents() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        deleteTask(index);
      });
    });
  }

  const clearDataButton = document.querySelector(".clearDataBtn");
  if (clearDataButton) {
    clearDataButton.addEventListener("click", function () {
      showConfirm("Are you sure you want to clear all tasks?", (confirmed) => {
        if (confirmed) {
          localStorage.removeItem("currentTask");
          currentTask = [];
          renderTasks();
        }
      });
    });
  }

  function deleteTask(index) {
    showConfirm("Are you sure you want to delete this task?", (confirmed) => {
      if (confirmed) {
        currentTask.splice(index, 1);
        localStorage.setItem("currentTask", JSON.stringify(currentTask));
        renderTasks();
      }
    });
  }

  function showConfirm(message, callback) {
    const modal = document.querySelector(".confirm-modal");
    const msg = document.querySelector(".confirm-message");
    const okBtn = document.querySelector(".confirm-ok");
    const cancelBtn = document.querySelector(".confirm-cancel");

    msg.innerText = message;
    modal.classList.remove("hidden");

    const okClickHandler = () => {
      modal.classList.add("hidden");
      okBtn.removeEventListener("click", okClickHandler);
      cancelBtn.removeEventListener("click", cancelClickHandler);
      callback(true);
    };

    const cancelClickHandler = () => {
      modal.classList.add("hidden");
      okBtn.removeEventListener("click", okClickHandler);
      cancelBtn.removeEventListener("click", cancelClickHandler);
      callback(false);
    };

    okBtn.addEventListener("click", okClickHandler);
    cancelBtn.addEventListener("click", cancelClickHandler);
  }

  renderTasks();

  // -----------------------------------------------------------------------
  //DAILY PLANNER
  // -----------------------------------------------------------------------
  let hours = Array.from(
    {
      length: 18,
    },
    (elem, index) => {
      return `${6 + index}:00 <br>${7 + index}:00`;
    }
  );
  let localStoDayplan = {};
  if (localStorage.getItem("dayPlanner")) {
    localStoDayplan = JSON.parse(localStorage.getItem("dayPlanner"));
  } else {
    localStorage.setItem("dayPlanner", JSON.stringify(localStoDayplan));
  }
  let wholeDaySum = "";
  hours.forEach((hour, index) => {
    wholeDaySum += `<div class="day-planner-time">
                            <p>${hour}</p>
                            <div class="sep"></div>
                            <input type="text" name="" id="plan-${index}" placeholder="..." value="${
      localStoDayplan[index] || ""
    }">
                            <button class="deletekrdo" data-index="${index}">
                                <i class="ri-close-line"></i>
                            </button>
                        </div>`;
  });
  const scrollWrapper = document.querySelector(".day-planner .scroll-wrapper");
  if (scrollWrapper) {
    scrollWrapper.innerHTML = wholeDaySum;
  }

  document.querySelectorAll(".deletekrdo").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;
      if (localStoDayplan[index]) {
        showConfirm(
          "Are you sure you want to delete this plan?",
          (confirmed) => {
            if (confirmed) {
              delete localStoDayplan[index];
              localStorage.setItem(
                "dayPlanner",
                JSON.stringify(localStoDayplan)
              );
              document.querySelector(`#plan-${index}`).value = "";
            }
          }
        );
      }
    });
  });

  document.querySelectorAll(".day-planner input").forEach((input, index) => {
    input.addEventListener("input", function () {
      localStoDayplan[index] = input.value.trim();
      localStorage.setItem("dayPlanner", JSON.stringify(localStoDayplan));
    });
  });

  // ------------------------------------------------------------------------
  // MOTIVATION QUOTES
  // ------------------------------------------------------------------------
  async function fetchQuote() {
    const motivationQuoteContent = document.querySelector(".motivation-2 h1");
    const motivationAuthor = document.querySelector(".motivation-3 h2");

    if (!motivationQuoteContent || !motivationAuthor) return;

    try {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      motivationQuoteContent.innerHTML = data.content;
      motivationAuthor.innerHTML = data.author;
    } catch (err) {
      motivationQuoteContent.innerHTML = "“Stay strong. This too shall pass.”";
      motivationAuthor.innerHTML = "Anonymous";
      console.error("Quote fetch error:", err);
    }
  }
  fetchQuote();

  //-------------------------------------------------------------------------
  // POMODORO TIMER
  //-------------------------------------------------------------------------
  function pomodoroTimer() {
    let timerDisplay = document.querySelector(".pomo-timer h1");
    let startBtn = document.querySelector(".pomo-timer .start-timer");
    let pauseBtn = document.querySelector(".pomo-timer .pause-timer");
    let resetBtn = document.querySelector(".pomo-timer .reset-timer");
    let sessionDisplay = document.querySelector(".pomodoro-fullpage .session");

    if (!timerDisplay) return; // Exit if elements are not on the page

    let isWorkSession = true;
    let totalSeconds = 25 * 60;
    let timerInterval = null;

    function updateTimer() {
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      timerDisplay.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }

    function startTimer() {
      clearInterval(timerInterval); // Clear any existing interval
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          clearInterval(timerInterval);
          isWorkSession = !isWorkSession;
          if (isWorkSession) {
            sessionDisplay.innerHTML = "Work Session";
            sessionDisplay.style.backgroundColor = "var(--green)";
            totalSeconds = 25 * 60;
          } else {
            sessionDisplay.innerHTML = "Take a Break";
            sessionDisplay.style.backgroundColor = "var(--blue)";
            totalSeconds = 5 * 60;
          }
          updateTimer();
        }
      }, 1000);
    }

    function pauseTimer() {
      clearInterval(timerInterval);
    }

    function resetTimer() {
      clearInterval(timerInterval);
      isWorkSession = true;
      sessionDisplay.innerHTML = "Work Session";
      sessionDisplay.style.backgroundColor = "var(--green)";
      totalSeconds = 25 * 60;
      updateTimer();
    }

    updateTimer(); // Initial display
    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer);
  }
  pomodoroTimer();

  //-------------------------------------------------------------------------
  // WEATHER & TIME
  //-------------------------------------------------------------------------
  function weatherFunctionality() {
    const city = "Allahabad"; // default city
    const header1Time = document.querySelector(".header1 h1");
    const header1Date = document.querySelector(".header1 h2");
    const header2Temp = document.querySelector(".header2 h2");
    const header2Condition = document.querySelector(".header2 h4");

    if (!header1Time) return; // Exit if elements are not on the page

    function updateTime() {
      const date = new Date();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
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

      const dayOfWeek = days[date.getDay()];
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHour = String(hours % 12 || 12);
      header1Date.innerHTML = `${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
      header1Time.innerHTML = `${dayOfWeek}, ${formattedHour}:${minutes} ${ampm}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
  }
  weatherFunctionality();

  //-------------------------------------------------------------------------
  // THEME CHANGER
  //-------------------------------------------------------------------------
  // Inside your DOMContentLoaded listener

  function changeTheme() {
    var theme = document.querySelector(".theme");
    var rootElement = document.documentElement;

    var flag = 0;
    theme.addEventListener("click", function () {
      if (flag == 0) {
        rootElement.style.setProperty("--pri", "#F8F4E1");
        rootElement.style.setProperty("--sec", "#222831");
        rootElement.style.setProperty("--tri1", "#948979");
        rootElement.style.setProperty("--tri2", "#393E46");
        flag = 1;
      } else if (flag == 1) {
        rootElement.style.setProperty("--pri", "#F1EFEC");
        rootElement.style.setProperty("--sec", "#030303");
        rootElement.style.setProperty("--tri1", "#D4C9BE");
        rootElement.style.setProperty("--tri2", "#123458");
        flag = 2;
      } else if (flag == 2) {
        rootElement.style.setProperty("--pri", "#F8F4E1");
        rootElement.style.setProperty("--sec", "#381c0a");
        rootElement.style.setProperty("--tri1", "#FEBA17");
        rootElement.style.setProperty("--tri2", "#74512D");
        flag = 0;
      }
    });
  }
  changeTheme();

  // --- Final step: make the body visible to prevent FOUC ---
  document.body.setAttribute("data-loaded", "true");
});
