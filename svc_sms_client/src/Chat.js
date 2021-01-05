import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';

function Chat(props) {
// const Chat = (props) => {
    const [ chat, setChat ] = useState([]);
    const latestChat = useRef(null);
    const setUnLogin = props.setUnLogin;

    latestChat.current = chat;

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/chat')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(result => {
                console.log('Connected!');

                connection.on('ReceiveMessage', message => {
                    const updatedChat = [...latestChat.current];
                    updatedChat.push(message);

                    setChat(updatedChat);
                });
            })
            .catch(e => console.log('Connection failed: ', e));
    }, []);

    const sendMessage = async (message) => {
        let store = JSON.parse(localStorage.getItem('Login'))
        const chatMessage = {
            user: store.username,
            message: message
        };

        try {
            let token = 'Bearer ' + store.token
            await  fetch('http://localhost:5000/chat/messages', {
                method: 'POST',
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
                .then(response => {
                if (response.status === 401) {
                    setUnLogin()
                }
            });
        }
        catch(e) {
            setUnLogin()
            console.log('Sending message failed.', e);
        }
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr />
            <ChatWindow chat={chat}/>
        </div>
    );
};

export default Chat;