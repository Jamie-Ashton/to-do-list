// firebase configuration


  
// init firebase
const app = initializeApp(firebaseConfig);
const database = firebase.database();
const todoRef = firebase.database().ref('todos')

//select DOM elements
const addTodoButtom = document.getElementById('add-todo-button')
const todoInput = document.getElementById('todo-input')
const todoList = document.getElementById('todo-list')
const prioritySelect = document.getElementById('priority-select')
const searchInpu = document.getElementById('search-input')
const darkToggle = document.getElementById('dark-mode-toggle')


//addEventListeners to add a todo item 

addTodoButton.addEventListener('click', () => {
  const todoText = todoInput.value
  const priority = prioritySelect.value
  if (todoText > 0) {
    // create new reference in the database for new todo
    const newTodoRef = todoRef.push()
    const currentData = new Date().toLocalDateString()
    
    //set the new todo item's properties
    newTodoRef.set({
        text: todoText,
        completed: false,
        date: currentData,
        priority: priority,
        category: "General" //default category

    })
    //CLear the input field after adding a todo
    todoInput = '';
}
})


//Add keypress event to add todo with 'Enter' key
todoInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        addTodoButton.click();
    }
});

//Eventlistener to toggle dark mode
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark')
})

//Fetch and render TODO from firebase
todoRef.on('value', (snapshot) => {
    // Clear the current list to prepare for any content 
    todoList.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
        const todoItem = childSnapshot.val() // retrieve the todo data
        const todoKey = childSnapshot.key // retrieve the todo key
        const li = document.createElement('li') // create a new list item from the database

        // create a label to display the category of the todo
        const categoryLabel = document.createElement('div');
        categoryLabel.classList.add('category-label');
        categoryLabel.textContent = todoItem.category;
        li.appendChild(categoryLabel);
        
        const totoContent = document.createElement('div')
        todoContnet.classList.add('todo-content')

        // create s status icon based on the task state
        const statusIcon = document.createElement('div')
        statusIcon.classList.add('status-icon');

        if(todoItem.completed) {
            statusIcon.classList.add('completed');
            statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        } else if(todoItem.priority === 'high') {
            statusIcon.classList.add('priroity');
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

        //display the todo list text
        const todoTextSpan = document.createElement('span');
        todoTextSpan.textContent = `${todoItem.text} - ${todoItem.date}`;

        if(todoItem.completed) {
            todoTextSpan.classList.add('completed'); //style the text if completed 
        }
        todoContent.appendChild(todoTextSpan)
    })
})