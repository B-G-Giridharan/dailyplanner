document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  const time = document.getElementById("time");
  const addBtn = document.getElementById("add-btn");
  const taskList = document.getElementById("task-list");
  const logoutBtn = document.getElementById("logoutBtn");

  const user = localStorage.getItem("loggedUser");
  if (!user) {
    location.href = "index.html";
    return;
  }

  if ("Notification" in window) {
    Notification.requestPermission();
  }

  // Load tasks from localStorage
  function loadTasks() {
    const data = JSON.parse(localStorage.getItem(`${user}-tasks`) || "[]");
    render(data);
  }

  // Add new task
  function addTask() {
    const t = title.value.trim();
    const tm = time.value.trim();
    if (!t || !tm) return alert("Enter task and time");

    const tasks = JSON.parse(localStorage.getItem(`${user}-tasks`) || "[]");
    tasks.push({ title: t, time: tm });
    localStorage.setItem(`${user}-tasks`, JSON.stringify(tasks));

    title.value = "";
    time.value = "";
    loadTasks();
  }

  // Render tasks
  function render(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.innerHTML = `
        <span>${task.time} - ${task.title}</span>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      taskList.appendChild(li);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = (e) => deleteTask(e.target.dataset.index);
    });
  }

  // Delete a task
  function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem(`${user}-tasks`) || "[]");
    tasks.splice(index, 1);
    localStorage.setItem(`${user}-tasks`, JSON.stringify(tasks));
    loadTasks();
  }

  // Notifications every 30 sec
  setInterval(() => {
    const tasks = JSON.parse(localStorage.getItem(`${user}-tasks`) || "[]");
    const now = new Date();
    const current = now.toTimeString().slice(0, 5);
    tasks.forEach((t) => {
      if (t.time === current) showNotification(t.title);
    });
  }, 30000);

  function showNotification(msg) {
    if (Notification.permission === "granted") {
      new Notification("Task Reminder", {
        body: msg,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
      });
    } else {
      alert("Task Reminder: " + msg);
    }
  }

  // Logout
  logoutBtn.onclick = () => {
    localStorage.removeItem("loggedUser");
    location.href = "index.html";
  };

  addBtn.onclick = addTask;
  loadTasks();
});
