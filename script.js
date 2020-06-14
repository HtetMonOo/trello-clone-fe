

const endPoint = "http://localhost:8081/api/v1"
var lists = [];
display();
  
function display() {
    fetch(endPoint+"/lists")
    .then(response => response.json())
    .then(data => {
        lists = data;
        const listStr = data.map(list => getList(list)).join("") + 
        `
        <div>
            <a href="#" id="add-list" onclick="addListClicked()">
                &ThickSpace; <i class="fas fa-plus"></i>
                &ThinSpace; Add another list
            </a> 
            <div id="list-input">
                <input type="text" id="newList" placeholder="Enter list title..." autofocus>
                <div>
                    <a href="#" onclick="addList()">Add List</a>
                    <a href="#" onclick="cancel(event)"><i style="font-size: 20px;" class="fas fa-times"></i></a>
                </div> 
            </div>    
        </div> `

       document.getElementById('container').innerHTML = listStr;

    })

    fetch(endPoint+"/accounts")
    .then(response => response.json())
    .then(data => {
        const accStr = data.map(acc => getMember(acc)).join("");
        document.getElementById('allMem').innerHTML = accStr;
    })
}

function getList(list) {
    const cardStr = list.cards.map(c => getCard(c, list)).join("");
    return `
    <div>
    <div style="height: 35px;">
        <label onclick="editListTitle(event)" style="padding: 5px 10px;">${list.title}</label>
        <input type="text" id="listTitle" listid="${list.id}" listpos="${list.position}" value="${list.title}" autofocus>
        <i class="fas fa-ellipsis-h"></i>
    </div>
    <span> ${cardStr} </span>
    <div id="add-card">
        <a href="#" onclick="addCardClicked(event)">
            &ThickSpace; <i class="fas fa-plus"></i>
            &ThinSpace; Add another card
        </a>
        <a href="#" title="Create from template...">
            <i class="fas fa-money-check"></i>
        </a> 
        <div id="card-input">
                <textarea id="newCard" placeholder="Enter a title for this card..." autofocus></textarea>
                <div>
                    <a href="#" onclick="addCard(event)" listid="${list.id}">Add Card</a>
                    <a href="#" onclick="cancel(event)"><i style="font-size: 20px;" class="fas fa-times"></i></a>
                </div> 
        </div>
    </div>

</div>`
}

function getCard(card, list) {
    const labelStr = card.labels.map(label => getLabel(label, "")).join("");
    const memberStr = card.members.map(mem => getMember(mem)).join("");
    
    return `<div id="card"  onclick="showCard(event)" listid="${list.id}" cardid="${card.id}">
        <i class="fas fa-edit"></i>
        ${labelStr}
        <div id="title">${card.title}</div>
        <div>
            <div>
                ${card.description ? `<i class="fas fa-align-left"></i>` : ``}
                ${card.checklist ? `<i class="fas fa-bars"></i>` : ``}
            </div>
            <div style="display: flex">${card.members ? memberStr : ``}</div>
        </div>
    </div>`
}

function getMember(mem) {
    const name = mem.name.split(" ");
    const pic = name[0].charAt(0).toUpperCase() + name[name.length-1].charAt(0).toUpperCase()
    return `<div id="member">
        <p style="font-weight: 600; font-size: small;">${pic}</p>
    </div>`
}

function getLabel(label, n) {
    return `<div id="label" style="background-color: ${label.color}">${n}</div>`
}

function getChecklist(chk) {

}

function addList() {
    const pos=document.getElementById("container").childElementCount;
    const tit=document.getElementById("newList").value;
    const data = {
        "title": tit,
        "position": pos,
        "status": 1
    }
    fetch(endPoint+"/lists", {
        method: 'post',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response=> response.json())
    .then(data => {
        console.log(data)
        display();
    })
}

function getListIdAndCardId(target) {
    if(target.getAttribute("listid") != null){
        return [target.getAttribute("listid"), target.getAttribute("cardid")]
    }else {
        return getListIdAndCardId(target.parentElement)
    }
}

function showCard(e) {
    const [listId, cardId] = getListIdAndCardId(e.target)
    const list = lists.find(l => l.id==listId)
    const card = list.cards.find(c => c.id==cardId)
    
    const memberPic = card.members.map(mem => getMember(mem)).join("");
    const label = card.labels.map(lab => getLabel(lab, lab.name)).join("")
    document.getElementById("card-info").innerHTML= `
                <div>
                    <i class="fas fa-money-check"></i>
                    <div>
                        <h1>${card.title}</h1>
                        <p>in list <a href="#" id="parent-list">${list.title}</a></p>
                        <div id="mem-label-wrapper">
                            ${card.members.length!=0 ? `<div id="card-members" style="margin-right: 15px;">
                                <h3>MEMBERS</h3>
                                <div style="display: flex;">
                                    ${memberPic}
                                    <div id="member">
                                        <i style="font-weight: 600;" class="fas fa-plus"></i>
                                    </div>
                                </div>
                                </div>` : ``}
                            ${card.labels.length!=0 ? `<div id="card-labels">
                                <h3>LABELS</h3>
                                <div style="display: flex;">
                                    ${label}
                                    <div>
                                        <i style="font-weight: 600;" class="fas fa-plus"></i>
                                    </div>
                                </div>
                                </div>` : ``}
                        </div>
                    </div>
                </div>
                <div>
                    <i class="fas fa-align-left"></i>
                    <div>
                        <div style="display: flex;"> 
                            <h2>Description</h2>
                            <a href="#">Edit</a>
                        </div>
                        <p>${card.description}</p>
                    </div>
                </div>
                <div>
                    <i class="fas fa-paperclip"></i>
                    <div>
                        <h2>Attachments</h2>
                        <p></p>
                        <a href="#">Add an attachment</a>
                    </div>
                </div>
                <div>
                    <i class="far fa-check-square"></i>
                    <div>
                        <div class="wrapper">
                            <h2>Checklist</h2>
                            <a href="#">Delete</a>
                        </div>
                        <p>${card.checklist}</p>
                    </div>
                    </div>
                    <div>
                        <i class="fas fa-list-ul"></i>
                        <div class="wrapper">
                            <h2>Activity</h2>
                            <a href="#">Show Details</a>
                        </div>
                    </div>
                    <div>
                        <span id="userp""><i class="fas fa-user"></i></span>
                        <input id="comment" type="text" placeholder="Write a comment...">
                    </div>
                </div>`
    document.getElementById("modal").style.visibility="visible";
}
function hideCard() {
    document.getElementById("modal").style.visibility="hidden";
    display();
}

function updateList(e){
    const id=e.target.getAttribute("listid");
    const pos=e.target.getAttribute("listpos");
    const tit=e.target.value;
    const data = {
            "id": id,
            "title": tit,
            "position": pos,
            "status": 1
    }
    fetch(endPoint+"/lists/"+id, {
        method: 'put',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response=> response.json())
    .then(data => {
        console.log(data)
        display();
    })
}
function addListClicked(){
    document.getElementById("list-input").style.visibility = 'visible';
}
function addCardClicked(e) {
    e.target.nextElementSibling.nextElementSibling.setAttribute("style", "visibility: visible;")
}
function cancel(e){
    e.target.parentElement.parentElement.parentElement.setAttribute("style", "visibility: hidden;");
}
function editListTitle(e){
    e.target.setAttribute("style","position: relative;")
    e.target.nextElementSibling.setAttribute("style", "visibility: visible;")
    e.target.nextElementSibling.addEventListener("keyup", function(event){
        event.preventDefault();
        if(event.keyCode==13){
            updateList(event);
        }
    })
}
function addCard(e){
    const CardPos=e.target.parentElement.parentElement.parentElement.parentElement.childElementCount-1;
    const CardTit=e.target.parentElement.previousElementSibling.value;
    const listId=e.target.getAttribute("listid");
    const data = {
        "title": CardTit,
        "description": null,
        "due_date": null,
        "position": CardPos,
        "status": 1,
        "list": {
            "id": listId
        }
}
    fetch(endPoint+"/cards", {
        method: 'post',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response=> response.json())
    .then(data => {
        console.log(data)
        display();
    })
}