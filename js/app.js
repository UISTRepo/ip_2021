var totalChatsOpened = 0;

function openChat(user_id){

    if(totalChatsOpened >= 4){
        alert('Close an active chat window in order top open a new one');
        return;
    }

    var id = 'chat_' + user_id;

    var newChatWindow = document.getElementById(id);

    if(!newChatWindow){
        var chatTemplate = document.getElementById('chatWindowTemplate');

        newChatWindow = chatTemplate.cloneNode(true);
        newChatWindow.id = id;
        newChatWindow.style.right = totalChatsOpened++*350 + 'px';

        var body = document.getElementsByTagName('body')[0];

        body.appendChild(newChatWindow);
    }

    newChatWindow.querySelector(".message-input").focus();
    newChatWindow.querySelector(".name-placeholder").innerHTML = "The Name";

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
