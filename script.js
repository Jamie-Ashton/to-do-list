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