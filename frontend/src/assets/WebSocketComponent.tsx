import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Available = styled.div`
  width: 50%;
`;

const Message = styled.div`
  background-color: #d9534f;
`;

interface WebSocketContent {
  from: string;
  to: string;
  status: string;
  role: string;
  content: string;
}

interface MessageConvo {
  from: string;
  content: string;
}

interface MessageRecord {
  from: string;
  content: MessageConvo[];
}

interface WebSocketInterface {
  from: string;
  to: string;
  status: "content" | "assigned" | "seen" | undefined;
  role: string;
  messages: MessageRecord[];
  available: string[];
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<
    React.SetStateAction<"content" | "assigned" | "seen">
  >;
  setAvailable: React.Dispatch<React.SetStateAction<string[]>>;
  setMessages: React.Dispatch<React.SetStateAction<MessageRecord[]>>;
}

const Chat = ({
  from,
  to,
  role,
  messages,
  allMessages,
  setMessages,
  webSocket,
}: {
  from: string;
  to: string;
  role: string;
  messages: MessageConvo[];
  allMessages: MessageRecord[];
  setMessages: React.Dispatch<React.SetStateAction<MessageRecord[]>>;
  webSocket: WebSocket | null;
}) => {
  const [inputMessage, setInputMessage] = useState("");

  const inputRef = useRef(null);
  const previousValue = useRef('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMessageSend = () => {
    if (webSocket && inputMessage.trim() !== "") {
      const data = {
        from: from,
        to: to,
        status: "content",
        role: role,
        content: inputMessage
      }
      webSocket.send(JSON.stringify(data));
      const currentMessages = allMessages.find((item) => item.from === to);
      if (currentMessages) {
        currentMessages.content.push({ from: from, content: inputMessage });
        setMessages([...allMessages]);
      }
      setInputMessage("");
    }
  };

  const handleTypying = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (webSocket) {
      const data = {
        from: from,
        to: to,
        status: "typing",
        role: role,
        content: from
      }
      webSocket.send(JSON.stringify(data));
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      previousValue.current = inputMessage;
      if (webSocket) {
        const data = {
          from: from,
          to: to,
          status: "untyping",
          role: role,
          content: from
        }
        webSocket.send(JSON.stringify(data));
      }
    }, 1000);
  };

  const handleBlur = () => {
    if (inputMessage.trim() === previousValue.current.trim()) {
      if (webSocket) {
        const data = {
          from: from,
          to: to,
          status: "untyping",
          role: role,
          content: from
        }
        webSocket.send(JSON.stringify(data));
      }
    }
  };

  return (
    <div>
      <Message>
        {messages.map((message, index) => (
          <table key={index}>
            <tbody>
              <tr>
                <td>{message.from}:</td>
                <td>{message.content}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </Message>
      <div>
        <input
          type="text"
          ref={inputRef}
          value={inputMessage}
          onChange={handleTypying}
          onBlur={handleBlur}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

const WebSocketComponent = (props: WebSocketInterface) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8083/websocket-endpoint?from=${props.from}&to=${props.to}&status=${props.status}&role=${props.role}`
    );

    socket.onopen = () => {
      console.log(
        `WebSocket connected with userId = ${props.from}, to = ${props.to}, status = ${props.status} and role = ${props.role}`
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as WebSocketContent;
      console.log(message);
      let from = message.from;
      const content = message.content;
      console.log("Received message:", message);

      if (
        message.status === "assigned"
      ) {
        props.setMessages((prevMessages) => [
          ...prevMessages,
          { from: from, content: [] },
        ]);
        props.setAvailable((prevAvailable) => [...prevAvailable, from]);
      }

      if (message.status === "content") {
        const data = {
          from: props.from,
          to: message.from,
          status: "seen",
          role: props.role,
          content: ""
        }
        socket ? socket.send(JSON.stringify(data)) : null;
        props.setMessages((prevMessages) =>
          prevMessages.map((item) =>
            item.from === message.from
              ? {
                  ...item,
                  content: [...item.content.filter((msg) => msg.from !== "typing"), { from: from, content: content }],
                }
              : item
          )
        );
      }

      if (message.status === "seen") {
        props.setMessages((prevMessages) =>
          prevMessages.map((item) =>
            item.from === message.from
              ? {
                  ...item,
                  content: [
                    ...item.content.filter((msg) => msg.from !== "seen"),
                    { from: "seen", content: from },
                  ],
                }
              : item
          )
        );
      }
      if (message.status === "typing") {
        props.setMessages((prevMessages) =>
          prevMessages.map((item) =>
            item.from === message.from
              ? {
                  ...item,
                  content: [
                    ...item.content.filter((msg) => msg.from !== "typing"),
                    { from: "typing", content: from },
                  ],
                }
              : item
          )
        );
      }
      if (message.status === "untyping") {
        props.setMessages((prevMessages) =>
          prevMessages.map((item) =>
            item.from === message.from
              ? {
                  ...item,
                  content: [
                    ...item.content.filter((msg) => msg.from !== "typing")
                  ],
                }
              : item
          )
        );
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWebSocket(socket);
  }, []);

  return (
    <div>
      <Available>
        <table>
          <tbody>
            {Array.from(new Set(props.available)).map((item) => (
              <tr key={item}>
                <td>
                  <button onClick={() => props.setTo(item)}>{item}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Available>
      {props.to !== "" && (
        <Chat
          from={props.from}
          to={props.to}
          role={props.role}
          messages={props.messages.find((item) => item.from === props.to)?.content || []}
          allMessages={props.messages}
          setMessages={props.setMessages}
          webSocket={webSocket}
        />
      )}
    </div>
  );
};

export default WebSocketComponent;
