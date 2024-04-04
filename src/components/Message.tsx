import { MessageType } from '../types/types';

export default function Message({ text, sender, timestamp }: MessageType) {
  return (
    <div className='chat'>
      <h1 className='profile fa-solid fa-circle-user'>&nbsp;</h1>
      <div className={'flex flex-direction-column'}>
        <div className={'flex flex-direction-row'}>
          <h4>{sender}</h4>{' '}
          <span className={'timestamp'}>&nbsp;{timestamp}</span>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
}
