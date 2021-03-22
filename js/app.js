var totalChatsOpened = 0;

function openChat(user_id){

    if(totalChatsOpened >= 4){
        alert('Close an active chat window in order top open a new one');
        return;
    }

    var id = 'chat_' + user_id;

    var alreadyOpened = document.getElementById(id);

    if(alreadyOpened){
        var textInput = alreadyOpened.querySelector(".message-input");
        textInput.focus();

        return;
    }

    var chatTemplate = document.getElementById('chatWindowTemplate');

    var newChatWindow = chatTemplate.cloneNode(true);
    newChatWindow.id = id;
    newChatWindow.style.right = totalChatsOpened*350 + 'px';
    totalChatsOpened++;

    var body = document.getElementsByTagName('body')[0];

    body.appendChild(newChatWindow);

}


function closeChat(btn){
    var parent1 = btn.parentElement;
    var parent2 = parent1.parentElement;
    var parent3 = parent2.parentElement;
    parent3.remove();

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
