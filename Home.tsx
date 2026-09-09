import Slidebar from './Slidebar';
import { useTheme, Box, Typography, TextField, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import ExploreIcon from '@mui/icons-material/Explore';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SchoolIcon from '@mui/icons-material/School';


interface Message {
  sender: "user" | "ai";
  text: string;
}

const Home = () => {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

 const sendMessage = async () => {
  if (!message.trim()) return;

  const userMsg: Message = { sender: "user", text: message };
  setChat((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5256/api/Chat/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("API returned an error");

    const data = await res.json();
    console.log("API RESPONSE:", data);

    // your backend returns { response: "your text" }
    const aiMsg: Message = { sender: "ai", text: data.response };
    setChat((prev) => [...prev, aiMsg]);

  } catch (error) {
    console.error(error);
    setChat((prev) => [
      ...prev,
      { sender: "ai", text: "Error connecting to API." }
    ]);
  }

  setMessage("");
  setLoading(false);
};


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get<Message[]>(
          "http://localhost:5256/api/UserQuestion"
        );
        // Assuming the API returns messages with sender 'user' or 'ai'
        setChat(response.data);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <><Slidebar/>
    <Box sx={{ ...styles.container(theme), marginLeft: '70px' }}>
      <Box sx={styles.heroSection}>
        <Typography variant="h2" component="h1" sx={styles.h1(theme)}>Welcome to AI Smart</Typography>
        <Typography sx={styles.p(theme)}>
          Your intelligent assistant for seamless search and conversation.
          Explore features, ask questions, and get insights instantly.
        </Typography>
        <Typography sx={styles.placeholder(theme)}>
          Let's Explore...
        </Typography>
      </Box>
      <Box sx={styles.chatBox}>
        <Box sx={styles.messageList} ref={messageListRef}>
          {chat.map((msg, index) => (
            <Box key={index} sx={{...styles.message, ...(msg.sender === 'user' ? styles.userMessage(theme) : styles.botMessage(theme))}}>
              {msg.text}
            </Box>
          ))}
          {loading && <Box sx={styles.botMessage(theme)}>...</Box>}
        </Box>
        <Box sx={styles.chatInputContainer(theme)}>
          <TextField
            variant="standard"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: styles.chatInput(theme)
            }}
          />
          <Button onClick={sendMessage} sx={styles.sendButton}><SendIcon sx={{ fontSize: 24 }} /></Button>
        </Box>
      </Box>
      <Box sx={styles.footer}>
        <Box 
          sx={{ ...styles.card(theme), ...(hoveredCard === 0 ? styles.cardHover : {}) }}
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <ExploreIcon sx={styles.cardIcon(theme)} />
          <Typography variant="h6" sx={styles.cardTitle(theme)}>Explore Features</Typography>
          <Typography sx={styles.cardText(theme)}>Ask about what this AI can do. Try "What are your capabilities?"</Typography>
        </Box>
        <Box 
          sx={{ ...styles.card(theme), ...(hoveredCard === 1 ? styles.cardHover : {}) }}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <LightbulbOutlinedIcon sx={styles.cardIcon(theme)} />
          <Typography variant="h6" sx={styles.cardTitle(theme)}>Get Creative</Typography>
          <Typography sx={styles.cardText(theme)}>Request a story, a poem, or a code snippet. Be imaginative!</Typography>
        </Box>
        <Box 
          sx={{ ...styles.card(theme), ...(hoveredCard === 2 ? styles.cardHover : {}) }}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <SchoolIcon sx={styles.cardIcon(theme)} />
          <Typography variant="h6" sx={styles.cardTitle(theme)}>Learn Something New</Typography>
          <Typography sx={styles.cardText(theme)}>Ask a question about a topic you're interested in. For example, "Explain quantum computing."</Typography>
        </Box>
      </Box>
    </Box>
    </>
  );
};

const styles = {
  container: (theme: any) => ({
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    height: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
  heroSection: {
    textAlign: 'center',
    padding: '20px 0',
  },
  h1: (theme: any) => ({
    fontSize: '3rem',
    fontWeight: 600,
    margin: 0,
    color: theme.palette.text.primary,
  }),
  p: (theme: any) => ({
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginTop: '12px',
  }),
  placeholder: (theme: any) => ({
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginTop: '20px',
  }),
  chatBox: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxHeight: 'calc(100% - 150px)',
  },
  messageList: {
    flexGrow: 1,
    padding: '0 10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  message: {
    padding: '14px 20px',
    maxWidth: '80%',
    wordWrap: 'break-word',
    lineHeight: '1.5',
    fontSize: '1rem',
  },
  userMessage: (theme: any) => ({
    background: 'linear-gradient(135deg, #007BFF, #0056b3)',
    color: 'white',
    alignSelf: 'flex-end',
    borderRadius: '18px 18px 4px 18px',
    boxShadow: '0 2px 5px rgba(0, 123, 255, 0.3)',
  }),
  botMessage: (theme: any) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    alignSelf: 'flex-start',
    borderRadius: '18px 18px 18px 4px',
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
  }),
  chatInputContainer: (theme: any) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: '30px',
    padding: '6px',
    borderRadius: '40px',
    backgroundColor: theme.palette.mode === 'light' ? '#f0f4f9' : theme.palette.background.paper,
    boxShadow: theme.shadows[2],
  }),
  chatInput: (theme: any) => ({
    flex: 1,
    padding: '14px 20px',
    backgroundColor: 'transparent',
    marginRight: '10px',
    fontSize: '1rem',
    color: theme.palette.text.primary,
  }),
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#12b5fbff',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px 0',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: (theme: any) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#f0f4f9' : theme.palette.background.paper,
    borderRadius: '12px',
    padding: '40px',
    flex: 1,
    textAlign: 'center',
    boxShadow: theme.shadows[1],
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  }),
  cardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  cardIcon: (theme: any) => ({
    fontSize: 40,
    color: theme.palette.primary.main,
    marginBottom: '16px',
  }),
  cardTitle: (theme: any) => ({
    margin: '0 0 8px 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  }),
  cardText: (theme: any) => ({
    margin: 0,
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  }),
};

export default Home;