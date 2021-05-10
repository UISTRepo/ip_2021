var totalChatsOpened = 0;

var myId = 1;

var chatData = [];

function getChats(){
    fetch('http://localhost:3000/chats')
        .then(response => response.json())
        .then(data => console.log(data));
}

getChats();

function openChat(user_id){

    if(totalChatsOpened >= 4){
        alert('Close an active chat window in order top open a new one');
        return;
    }

    var chat_id = 'chat_' + user_id;

    var newChatWindow = document.getElementById(chat_id);

    if(!newChatWindow){
        var chatTemplate = document.getElementById('chatWindowTemplate');

        newChatWindow = chatTemplate.cloneNode(true);
        newChatWindow.id = chat_id;
        newChatWindow.style.right = totalChatsOpened++*350 + 'px';

        var body = document.getElementsByTagName('body')[0];

        body.appendChild(newChatWindow);
    }

    newChatWindow.querySelector(".message-input").focus();

    fetch('http://localhost:3000/chats/' + user_id)
        .then(response => response.json())
        .then(chatMessages => {

            newChatWindow.querySelector(".name-placeholder").innerHTML = chatMessages.name;

            var messageInput = newChatWindow.getElementsByTagName('input')[0];

            messageInput.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    newChatWindow.getElementsByClassName('send-message-button')[0].click();
                }
            });

            if(!chatMessages.messages.length){
                newChatWindow.querySelector('.empty-chat-message').style.display = 'initial';
            }

            newChatWindow.querySelector('.messages').innerHTML = "";

            chatMessages.messages.forEach(function (message) {
                addChatMessage(message, chat_id);
            });

        });

}

function addChatMessage(message, chat_id){

    var newMessage = document.createElement('div');
    newMessage.className = 'row';

    var isMine = message.user_id == myId;

    if(isMine){
        newMessage.id = message.id;
        newMessage.innerHTML = `
        <div class="col-1">
            <i class="fas fa-times text-danger" onclick="removeMessage(`+message.id+`)"></i>  
        </div>
        <div class="col-8 text-end">
            <div class="message">
                <div>` + message.text + `</div>
                <div class="timestamp">` + message.created_at + `</div>
            </div>
        </div>
        <div class="col-3 text-center">
            <div class="thumb">
                <img src="` + message.thumb + `">
            </div>
        </div>
        `;
    }
    else{
        newMessage.innerHTML = `
        <div class="col-3 text-center">
            <div class="thumb">
                <img src="` + message.thumb + `">
            </div>
        </div>
        <div class="col-9">
            <div class="message">
                <div>` + message.text + `</div>
                <div class="timestamp">` + message.created_at + `</div>
            </div>
        </div>
        `;
    }

    var chatWindow = document.getElementById(chat_id);

    var defaultMsg = chatWindow.querySelector('.empty-chat-message');
    if(defaultMsg){
        defaultMsg.style.display = 'none';
    }

    var messagesHolder = chatWindow.querySelector('.messages');

    messagesHolder.appendChild(newMessage);

    messagesHolder.scrollIntoView(false);

}

function sendMessage(btn){
    var chatWindow = btn.closest('.chat-window');
    var chat_id = chatWindow.id;

    var chat_user_id = chat_id.split('_')[1];

    var messageElement = chatWindow.getElementsByClassName('message-input')[0];

    if(!messageElement.value || !messageElement.value.length){
        messageElement.focus();
        return;
    }

    var lastId = 0;

    chatData.forEach(function (chat){
        chat.messages.forEach(function (message){
            lastId = message.id
        })
    })

    var messageData = {
        id: ++lastId,
        user_id: myId,
        text: messageElement.value,
        thumb: 'https://via.placeholder.com/100',
        created_at: new Date()
    }

    messageElement.value = "";
    messageElement.focus();

    var chatMessages = chatData.filter(function (chat){
        return chat.user_id == chat_user_id;
    })[0];

    chatMessages.messages.push(messageData);
    addChatMessage(messageData, chat_id);
}

function removeMessage(id){
    document.getElementById(id).remove();

    // TODO for students: remove the message id = id from the messages array in the chatData array;
}

function closeChat(btn){
    btn.closest('.chat-window').remove();
    repositionOpenedChats();
}

function repositionOpenedChats(){
    totalChatsOpened = 0;
    var openedChats = document.getElementsByClassName('chat-window');

    for(var i = 0; i < openedChats.length; i++){
        if(openedChats[i].id != 'chatWindowTemplate'){
            openedChats[i].style.right = totalChatsOpened++*350 + 'px';
        }
    }

}

function getData(){
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json => {
            console.log(json)
        })
}
