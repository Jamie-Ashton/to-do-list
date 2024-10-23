// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZIB4uwKhrLOk0Oo-X0svFn6faRwJhSEA",
    authDomain: "to-do-list-4705c.firebaseapp.com",
    databaseURL: "https://to-do-list-4705c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "to-do-list-4705c",
    storageBucket: "to-do-list-4705c.appspot.com",
    messagingSenderId: "197224790303",
    appId: "1:197224790303:web:466761376d5d550a28582a"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const todoRef = database.ref('todos');

// Select DOM elements
const addTodoBtn = document.getElementById('add-todo-btn');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const prioritySelect = document.getElementById('priority-select');
const searchInput = document.getElementById('search-input');
const darkToggle = document.getElementById('dark-mode-toggle');

// Add event listener to add a todo item
addTodoBtn.addEventListener('click', () => {
    const todoText = todoInput.value.trim();
    const priority = prioritySelect.value;
    if (todoText.length > 0) {
        const newTodoRef = todoRef.push();
        const currentDate = new Date().toLocaleString();
        
        newTodoRef.set({
            text: todoText,
            completed: false,
            date: currentDate,
            priority: priority,
            category: "General"
        });
        todoInput.value = '';
    }
});

// Add keypress event to add todo with 'Enter' key
todoInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        addTodoBtn.click();
    }
});

// Event listener to toggle dark mode
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Fetch and render TODO from firebase
todoRef.on('value', (snapshot) => {
    todoList.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
        const todoItem = childSnapshot.val();
        const todoKey = childSnapshot.key;
        const li = document.createElement('li');

        const categoryLabel = document.createElement('div');
        categoryLabel.classList.add('category-label');
        categoryLabel.textContent = todoItem.category;
        li.appendChild(categoryLabel);
        
        const todoContent = document.createElement('div');
        todoContent.classList.add('todo-content');

        const statusIcon = document.createElement('div');
        statusIcon.classList.add('status-icon');

        if(todoItem.completed) {
            statusIcon.classList.add('completed');
            statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        } else if(todoItem.priority === 'high') {
            statusIcon.classList.add('priority');
            statusIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
        } else if(todoItem.priority === 'medium') {
            statusIcon.classList.add('in-progress');
            statusIcon.innerHTML = '<i class="fas fa-hourglass-half"></i>';
        } else if(todoItem.priority === 'low') {
            statusIcon.classList.add('waiting');
            statusIcon.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            statusIcon.classList.add('unfinished');
            statusIcon.innerHTML = '<i class="fas fa-times"></i>'; 
        }
        todoContent.appendChild(statusIcon);

        const todoTextSpan = document.createElement('span');
        todoTextSpan.textContent = `${todoItem.text} - ${todoItem.date}`;

        if(todoItem.completed) {
            todoTextSpan.classList.add('completed');
        }
        todoContent.appendChild(todoTextSpan);

        const editBtn = document.createElement('i');
        editBtn.classList.add('far', 'fa-edit', 'edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.classList.add('todo-input-edit');
            editInput.value = todoItem.text;
            todoContent.replaceChild(editInput, todoTextSpan);
            editInput.focus();

            editInput.addEventListener('blur', () => {
                const updatedText = editInput.value.trim();
                if(updatedText.length > 0) {
                    todoRef.child(todoKey).update({
                        text: updatedText,
                        date: new Date().toLocaleString(),
                    });
                } else {
                    todoContent.replaceChild(todoTextSpan, editInput);
                }
            });
        });

        const completeBtn = document.createElement('i');
        completeBtn.classList.add('far', 'fa-check', 'complete-btn');
        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            todoRef.child(todoKey).update({
                completed: !todoItem.completed,
            });
        });

        const undoBtn = document.createElement('i');
        undoBtn.classList.add('fas', 'fa-undo', 'undo-btn');
        undoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            todoRef.child(todoKey).update({
                completed: false,
            });
        });

        const deleteBtn = document.createElement('i');
        deleteBtn.classList.add('far', 'fa-trash-alt', 'delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            todoRef.child(todoKey).remove();
        });

        li.appendChild(todoContent);
        if(todoItem.completed) {
            li.appendChild(undoBtn);
        } else {
            li.appendChild(completeBtn);
        }
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
});

// Event listener for search functionality
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const todos = document.querySelectorAll('#todo-list li');
    todos.forEach(todo => {
        const text = todo.querySelector('span').textContent.toLowerCase();
        if(text.includes(filter)) {
            todo.style.display = '';
        } else {
            todo.style.display = 'none';
        }
    });
});
