import React, { useEffect, useState } from 'react';
import { Message } from './Message';
import io from 'socket.io-client';
import './App.css';

const socket = io();

function App(): JSX.Element {
  const [name, setName] = useState('');
  const [inputName, setInputName] = useState('');
  const [room, setRoom] = useState('');
  const [find, setFind] = useState([] as Message[]);
  const [inputFind, setInputFind] = useState('');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([] as Message[]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    setRoom('room1');
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (name === '') return;
    socket.on('clear', (message: Message) => {
      setChat([message]);
    });
    socket.on('messages', (messages: Message[]) => {
      console.log('messages');
      const mes = messages.reverse().map((message: Message) => {
        return {
          text: message.text,
          sender: message.sender,
          timestamp: message.timestamp,
        };
      });
      setChat(mes);
    });
    socket.on('message', (message: Message) => {
      setChat([message, ...chat]);
    });
    socket.on('find_messages', (messages: Message[]) => {
      setFind(messages);
    });
  }, [name, chat, setChat]);

  function renderChat() {
    return (
      <div className={'box'}>
        <div ref={scrollRef} />
        {getMessages(chat.reverse())}
      </div>
    );
  }

  function onFindChat() {
    socket.emit('find_messages', inputFind);
    return (
      <div className={'box'}>
        <div ref={scrollRef} />
        {getMessages(find)}
      </div>
    );
  }

  function getMessages(messages: Message[]): JSX.Element[] {
    const mes = [];
    messages.reverse();
    for (let i = 0; i < messages.length; i++) {
      const { text, sender, timestamp } = messages[i];
      mes.push(
        <div key={i} className={'chat'}>
          <h1 className="profile fa-solid fa-circle-user">&nbsp;</h1>
          <div className={'flex flex-direction-column'}>
            <div className={'flex flex-direction-row'}>
              <h4>{sender}</h4>{' '}
              <span className={'timestamp'}>&nbsp;{timestamp}</span>
            </div>
            <span>{text}</span>
          </div>
        </div>,
      );
    }
    return mes;
  }

  function onChatEnter(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      if (input === '') {
        setInput('');
        return;
      }
      if (input === '/cls') {
        setInput('');
        socket.emit('clear', name);
        return;
      }
      setInput('');
      setChat([
        { text: input, sender: name, timestamp: new Date().toTimeString() },
        ...chat,
      ]);
      socket.emit('message', {
        text: input,
        sender: name,
        timestamp: new Date().toTimeString(),
      });
    }
  }

  return (
    <div className={'container'}>
      {name === '' ? (
        <div className={'name_container'}>
          <input
            className={'room_input'}
            type="text"
            onChange={(e) => setRoom(e.currentTarget.value)}
            value={room}
            placeholder={'Enter room name that you want to join'}
          />
          <input
            className={'name_input'}
            type="text"
            onChange={(e) => setInputName(e.currentTarget.value)}
            value={inputName}
            placeholder={'Enter your name that you want to use'}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                if (room === '') return;
                socket.emit('join', inputName, room);
                setName(inputName);
                setInputName('');
              }
            }}
          />
          <button
            className={'name_input'}
            onClick={() => {
              if (room === '') return;
              socket.emit('join', inputName, room);
              setName(inputName);
              setInputName('');
            }}
          >
            Click to join the chat room
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            className={'width-50'}
            onChange={(e) => setInputFind(e.currentTarget.value)}
            value={inputFind}
            placeholder={'Find a Messages'}
          />
          {inputFind === '' ? renderChat() : onFindChat()}
          <input
            type="text"
            onChange={(e) => setInput(e.currentTarget.value)}
            value={input}
            placeholder={'Enter your message'}
            onKeyUp={onChatEnter}
          />
        </>
      )}
    </div>
  );
}

export default App;
