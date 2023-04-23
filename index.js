//query selectors
let board = document.querySelector("#board");

//data
let boardList = []

function renderBoard(boardList){
    boardList.forEach( list => board.append(renderTaskList(list)));

    //add List Button
    const addListButton = document.createElement('button');
    addListButton.textContent = 'Add List';
    addListButton.classList.add('addList')
    addListButton.addEventListener('click', addList)
    board.append(addListButton)
}

function renderTaskList(list){
    const { listName, tasks} = list

    let listColumn = document.createElement('div');

    //list name
    let heading = document.createElement('div')
    heading.textContent = listName

    let ul = document.createElement('ul');
    ul.classList.add(listName)

    tasks.forEach(task => {
        let listItem = renderTaskInReadMode(task, listName)
        ul.append(listItem)
    })

    //add task button
    let addTaskButton = document.createElement('button')
    addTaskButton.textContent = 'Add task'
    addTaskButton.addEventListener('click', ()=> addTask(listName));

    //append all element
    listColumn.appendChild(heading);
    listColumn.appendChild(ul);
    listColumn.appendChild(addTaskButton);

    return listColumn
}

//render <li id="given-id">Desc</li>
function renderTaskInReadMode(task, listName){
    const { id, desc } = task
    let listItem = document.createElement('li');
    listItem.textContent = desc;
    listItem.id = id

    listItem.addEventListener('dblclick', ()=> {
        //find id of that task
        //find parent node of that task like column
        let listColumn = document.querySelector(`.${listName}`)
        console.log('double Click', listColumn, `.${listName}`, document.querySelector(`#${id}`))
        //replace the li item with renderTaskInEditMode
        listColumn.replaceChild(renderTaskInEditMode(task, listName), document.querySelector(`#${id}`))       
    })

    return listItem
}

//render <li><input type="text"/><button class="button-class">Update</button></li>
function renderTaskInEditMode(task, listName){
    const { id, desc } = task
    let listItem = document.createElement('li');
    listItem.id = id

    let input = document.createElement('input');
    input.type = 'text';
    input.value = desc;

    listItem.append(input)

    let saveButton = document.createElement('button');
    saveButton.textContent = 'Save'
    saveButton.addEventListener('click', ()=>{
        updateTask(listName, id, input.value)  
    })

    listItem.append(saveButton)
    

    return listItem
}

//funcitons
function addTask(listName){
    //Add task into boardList object
    let uid = new Date().getTime();
    let listColumn = document.querySelector(`.${listName}`)

    listColumn.append(renderTaskInEditMode({id: 'id' + uid, desc: ""}, listName));
}

function updateTask(listName, id, desc){
    console.log('saving')
    //Update Task to board List Object
    boardList.forEach((list)=>{
        if(list.listName === listName){
            console.log('found list', listName)
            list.tasks.forEach(task => {
                if(task.id === id){
                    console.log('found task also', task, id, desc)
                    task.desc = desc
                }
            })
        }
    })
    console.log(boardList)
    let listColumn = document.querySelector(`.${listName}`)
    listColumn.replaceChild(renderTaskInReadMode({id, desc}, listName), document.querySelector(`#${id}`));
}

function addList(){
    console.log('addList')
    console.log(board.childNodes.length)

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type List Name'

    let button = document.createElement('button');
    button.textContent = 'save list name'


    let listColumn = document.createElement('div');
    listColumn.appendChild(input);
    listColumn.appendChild(button);
    
    board.insertBefore(listColumn, board.childNodes[(board.childNodes.length - 1)]);

    document.querySelector(".addList").disabled = true

    button.addEventListener('click',()=>{
        boardList.push({
            listName: input.value,
            tasks : []
        })
        board.removeChild(board.children[(board.childNodes.length - 2)]);
        board.insertBefore(renderTaskList({
            listName: input.value,
            tasks : []
        }), board.childNodes[(board.childNodes.length - 1)]);
        document.querySelector(".addList").disabled = false
    })
}

//init function
renderBoard(boardList)
