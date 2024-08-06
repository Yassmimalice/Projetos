const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const taskDateInput = document.getElementById('task-date');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function addTask(task, date) {
    tasks.push({ text: task, date: date, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

function editTask(index, task) {
    tasks[index].text = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

function markTaskCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}


function renderTaskList(filter = 'all') {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (filter === 'all' ||
            (filter === 'completed' && task.completed) ||
            (filter === 'pending' && !task.completed) ||
            (filter === 'future' && new Date(task.date) > new Date())
        ) {
            const li = document.createElement('li');
            li.textContent = `${task.text} - ${task.date || ''}`;
            if (task.completed) {
                li.classList.add('completed');
            }
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => {
                const newTask = prompt('Enter new task', task.text);
                if (newTask) {
                    editTask(index, newTask);
                }
            };
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                deleteTask(index);
            };
            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            completeBtn.textContent = task.completed ? 'Uncomplete' : 'Complete';
            completeBtn.onclick = () => {
                markTaskCompleted(index);
            };
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            li.appendChild(completeBtn);
            taskList.appendChild(li);
        }
    });
}


addTaskBtn.addEventListener('click', () => {
    const task = taskInput.value.trim();
    const date = taskDateInput.value.trim();
    if (task) {
        addTask(task, date);
        taskInput.value = '';
        taskDateInput.value = '';
    }
});


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderTaskList(btn.id.split('-')[0]);
    });
});



renderTaskList();
