import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Chat from './chat'; // Import Chat component

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // Store the selected chat ID
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'data'));
        const usersData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch users: ${err.message}`);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (otherUserEmail) => {
    const chatId = [storedUser.email, otherUserEmail].sort().join('_');

    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        // If chat doesn't exist, create a new one
        await setDoc(chatRef, {
          participants: {
            [storedUser.email]: true,
            [otherUserEmail]: true,
          },
          messages: [], // Initialize with an empty messages array
        });
      }

      setSelectedChat(chatId); // Set the selected chat
    } catch (err) {
      setError(`Failed to handle chat: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar for user list */}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>Users List</h2>
        {loading && <p>Loading users...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {users.length === 0 ? (
          <p>No users available</p>
        ) : (
          users
            .filter((u) => u.email !== storedUser.email)
            .map((u, index) => (
              <button
                key={index}
                onClick={() => handleUserClick(u.email)}
                style={{
                  ...styles.userButton,
                  backgroundColor:
                    selectedChat ===
                    [storedUser.email, u.email].sort().join('_')
                      ? '#c8f7dc'
                      : '#e9f7ef',
                }}
              >
                <strong>{u.name}</strong>
              </button>
            ))
        )}
      </div>

      {/* Main content for chat */}
      <div style={styles.chatArea}>
        {selectedChat ? (
          <Chat chatId={selectedChat} /> // Render the Chat component with the selected chatId
        ) : (
          <p style={styles.selectMessage}>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#dff7e5',
  },
  sidebar: {
    width: '30%',
    borderRight: '2px solid #bde0c2',
    padding: '1rem',
    overflowY: 'auto',
    backgroundColor: '#e6f9eb',
  },
  heading: {
    color: '#2e8b57',
    textAlign: 'center',
    fontSize: '20px',
    marginBottom: '1rem',
  },
  error: {
    color: 'red',
  },
  userButton: {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    marginBottom: '10px',
    border: '1px solid #bde0c2',
    borderRadius: '10px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  chatArea: {
    width: '70%',
    padding: '1rem',
    backgroundColor: '#f6fdf9',
  },
  selectMessage: {
    textAlign: 'center',
    color: '#2e8b57',
    fontSize: '18px',
  },
};

export default ChatList;
