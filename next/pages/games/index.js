import io from 'socket.io-client'
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    const socket = io('http://127.0.0.1:3000');
    socket.on('message', function (event) {
      console.log(event)
    });
  }, []);

  return (
    <>
      <div>
        Hello
      </div>
    </>
  )
}
