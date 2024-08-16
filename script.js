const form = document.querySelector('form');
const listElement = document.getElementById('task-list');
const dateInput = document.getElementById('date-input');
const descriptionInput = document.getElementById('description-input');

document.addEventListener('DOMContentLoaded', initializeDateInput);

function initializeDateInput() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
}

let allTasks = loadTasks();
renderTaskList();

function submit(event) {
    event.preventDefault();
    processTask();
}

function processTask() {
    const taskText = document.getElementById("task-input").value.trim();
    const taskDate = dateInput.value || null;
    const taskDescription = descriptionInput.value.trim();

    const today = new Date().toISOString().split('T')[0];

    if (taskText && (!taskDate || taskDate >= today)) {
        const newTask = {
            text: taskText,
            date: taskDate,
            description: taskDescription
        };

        allTasks.push(newTask);
        saveTasks();
        renderTaskList();
        clearForm();
    } else if (taskDate < today) {
        alert("The task date cannot be before today.");
    }
}

function renderTaskList() {
    listElement.innerHTML = '';

    const groupedTasks = groupTasksByDate(allTasks);
    const sortedDates = sortDates(Object.keys(groupedTasks));

    sortedDates.forEach(date => {
        appendDateHeader(date);
        groupedTasks[date].forEach((task, index) => {
            const taskElement = createTaskElement(task, index);
            listElement.appendChild(taskElement);
        });
    });
}

function groupTasksByDate(tasks) {
    return tasks.reduce((group, task) => {
        const dateKey = task.date || 'No Date';
        group[dateKey] = group[dateKey] || [];
        group[dateKey].push(task);
        return group;
    }, {});
}

function sortDates(dates) {
    return dates.sort((a, b) => {
        if (a === 'No Date') return 1;
        if (b === 'No Date') return -1;
        return new Date(a) - new Date(b);
    });
}

function appendDateHeader(date) {
    const dateHeader = document.createElement('h3');
    dateHeader.innerText = date;
    listElement.appendChild(dateHeader);
}

function createTaskElement(task, index) {
    const taskItem = document.createElement("li");
    taskItem.className = "task";

    const taskId = `task-${index}`;

    taskItem.innerHTML = `
        <input type="checkbox" id="${taskId}">
        <label class="custom-checkbox" for="${taskId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${taskId}" class="task-text">${task.text}</label>
        <p class="task-description">${task.description}</p>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `;

    taskItem.querySelector(".delete-button").addEventListener("click", () => removeTask(index));
    const checkbox = taskItem.querySelector("input");
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompletion(index, checkbox.checked));

    return taskItem;
}

function removeTask(index) {
    allTasks.splice(index, 1);
    saveTasks();
    renderTaskList();
}

function toggleTaskCompletion(index, isCompleted) {
    allTasks[index].completed = isCompleted;
    saveTasks();
}

function clearForm() {
    document.getElementById("task-input").value = "";
    descriptionInput.value = "";
    initializeDateInput();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
}

form.addEventListener('submit', submit);

