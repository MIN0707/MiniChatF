import { MessageType, StateType } from './types/types';
import Background from './components/Background';
import { useReducer, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import MessagesRow from './components/MessagesRow';

const socket = io('http://localhost:3001');

const initialState: StateType = {
  nickname: '',
  filter: '',
  input: '',
  messages: [],
};

function reducer(state: StateType, action: StateType) {
  return { ...state, ...action };
}

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form, setForm] = useState('');

  socket.on('receive', (data: MessageType) => {
    console.log(data);
    dispatch({ messages: [...state.messages!, data] });
  });

  function onChatSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;
    if (!state.input) return;
    socket.emit('send', { text: state.input, sender: state.nickname });
    dispatch({ input: '' });
  }

  // 정보 입력 FORM
  if (state.nickname === '') {
    return (
      <Background>
        <div className='name_container'>
          <input
            className={'name_input'}
            type='text'
            onChange={(e) => setForm(e.currentTarget.value)}
            value={form}
            placeholder={'Enter your name that you want to use'}
          />
          <button
            className={'name_input'}
            onClick={() => {
              if (!form) return;
              dispatch({
                nickname: form,
              });
              setForm('');
              // socket.emit('join', inputName, room);
            }}
          >
            Click to join the chat room
          </button>
        </div>
      </Background>
    );
  }

  // 방
  return (
    <Background>
      <input
        type='text'
        className={'width-50'}
        onChange={(e) => dispatch({ filter: e.currentTarget.value })}
        value={state.filter}
        placeholder={'Find a Messages'}
      />
      <MessagesRow messages={state.messages!} filter={state.filter!} />
      <input
        type='text'
        onChange={(e) => dispatch({ input: e.currentTarget.value })}
        value={state.input}
        placeholder={'Enter your message'}
        onKeyUp={onChatSubmit}
      />
    </Background>
  );
}

export default App;
