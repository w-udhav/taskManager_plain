class Task {
  constructor(name, cat, date, completed = false) {
    this.name = name;
    this.cat = cat;
    this.date = date;
    this.completed = completed;
  }

  addTask() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(this);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  displayTask() {
    const view = document.querySelector(".view");
    const task = document.createElement("div");

    task.innerHTML = `
      <div class="viewBox">
        <div class="viewBox_check">
          <button class="isCompleted"></button>
        </div>
        <div class="viewBox_header_left">
          <h3>${this.name}</h3>
          <div class="viewBox_category">
            <p>${this.cat}</p>
            <p class="viewBox_date">${this.date}</p>
          </div>
        </div>
        <div class="viewBox_header_right">
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </div>
      </div>
    `;

    const isCompleted = task.querySelector(".isCompleted");
    if (this.completed) {
      isCompleted.classList.add("completed");
    }
    view.appendChild(task);

    const completedBtn = task.querySelector(".isCompleted");
    completedBtn.addEventListener("click", () => {
      this.completed = !this.completed;
      isCompleted.classList.toggle("completed");
      this.updateLocalStorage();
    });

    const deleteBtn = task.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      task.remove();
      this.deleteTask();
    });
  }

  deleteTask() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const index = tasks.findIndex((task) => task.name === this.name);
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  updateLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const index = tasks.findIndex((task) => task.name === this.name);
    tasks[index] = this;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  clearInput() {
    document.querySelector("#name").value = "";
    document.querySelector("#cat").value = "";
    document.querySelector("#date").value = "";
  }
}

const addTaskBtn = document.querySelector("#addTask");

addTaskBtn.addEventListener("click", () => {
  const component = document.querySelector("#addTask_component");
  component.classList.toggle("hidden");
  if (component.classList.contains("hidden")) {
    addTaskBtn.innerHTML = "Add Task";
  } else {
    addTaskBtn.innerHTML = "Cancel";
  }
});

// Done button
const doneBtn = document.querySelector("#doneBtn");
doneBtn.addEventListener("click", () => {
  const name = document.querySelector("#name").value;
  const cat = document.querySelector("#cat").value;
  const date = document.querySelector("#date").value;

  if (name.trim() === "" || date.trim() === "" || cat.trim() === "") {
    alert("Please fill out all fields.");
    return;
  }

  const task = new Task(name, cat, date);
  task.addTask();
  task.displayTask();
  task.clearInput();
});

// Filter function
const filterBtn = document.querySelector(".filter");
filterBtn.addEventListener("click", filterTasks);

function filterTasks() {
  const filter = document.querySelector("#filter").value;
  const tasks = document.querySelectorAll(".viewBox");

  tasks.forEach((task) => {
    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "completed":
        if (
          task.querySelector(".isCompleted").classList.contains("completed")
        ) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
      case "uncompleted":
        if (
          !task.querySelector(".isCompleted").classList.contains("completed")
        ) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
    }
  });
}
// Search function
function searchTasks() {
  const searchInput = document.querySelector("#search");
  const searchQuery = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".viewBox");

  tasks.forEach((task) => {
    const taskName = task.querySelector("h3").innerText.toLowerCase();
    if (taskName.includes(searchQuery)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

const searchInput = document.querySelector("#search");
searchInput.addEventListener("keyup", searchTasks);

window.addEventListener("load", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const loadedTask = new Task(
      task.name,
      task.cat,
      task.date,
      task.completed
    );

    loadedTask.displayTask();
  });
});
