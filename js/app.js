var totalChatsOpened = 0;

var myId = 1;

var chatItemData = [];

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
        .then(chatItem => {

            chatItemData = chatItem;

            newChatWindow.querySelector(".name-placeholder").innerHTML = chatItem.name;

            var messageInput = newChatWindow.getElementsByTagName('input')[0];

            messageInput.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    newChatWindow.getElementsByClassName('send-message-button')[0].click();
                }
            });

            if(!chatItem.messages.length){
                newChatWindow.querySelector('.empty-chat-message').style.display = 'initial';
            }

            newChatWindow.querySelector('.messages').innerHTML = "";

            chatItem.messages.forEach(function (message) {
                addChatMessage(message, chat_id);
            });

        });

}

function addChatMessage(message, chat_id){

    var newMessage = document.createElement('div');
    newMessage.className = 'row';

    var isMine = message.user1 == myId;

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

    var messageData = {
        user1: myId,
        user2: chat_user_id,
        text: messageElement.value
    }

    fetch('http://localhost:3000/chats/newMessage', {
        method: "POST",
        body: JSON.stringify(messageData),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {
            messageData.thumb = data.thumb;
            messageData.created_at = new Date();
            chatItemData.messages.push(messageData);
            addChatMessage(messageData, chat_id);
        });

    messageElement.value = "";
    messageElement.focus();

}

function removeMessage(id){
    document.getElementById(id).remove();

    fetch('http://localhost:3000/chats/' + id, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
           console.log(data);
        });

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
