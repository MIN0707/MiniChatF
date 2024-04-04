import { MessageType } from '../types/types';
import Message from './Message';

export default function MessagesRow({
  messages,
  filter,
}: {
  messages: MessageType[];
  filter: string;
}) {
  const filter_messages = messages.filter((msg) => msg.text.includes(filter));
  return (
    <div className='box'>
      {[...filter_messages].reverse().map((msg, index) => (
        <Message
          key={index}
          text={msg.text}
          sender={msg.sender}
          timestamp={msg.timestamp}
        />
      ))}
    </div>
  );
}
