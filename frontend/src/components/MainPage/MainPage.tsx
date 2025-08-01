import React from 'react';
import Header from '../Header';
import SessionSidebar from '../SessionSidebar';
import Player from '../Player/Player.tsx';
import styles from './MainPage.module.css'
import axios from 'axios'
import type { Session } from '../../Types/index.ts'
import SessionInfoBox from '../SessionInfoBox/SessionInfoBox.tsx';

function MainPage() {
  const [allSessions, setAllSessions] = React.useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<Session | string>('');
  const [selectedSessionEvents, setSelectedSessionEvents] = React.useState<any[]>([])

  const handleSessionSelect = async function(session: Session) {
    setSelectedSession(session)
    const events = await fetchSessionEvents(session);
    setSelectedSessionEvents(events)
  }

  const fetchSessionEvents = async function(session: Session) {
    try {
      const response = await axios.get(`http://localhost:5001/api/events/${session.events_file_name}`);
      setSelectedSession(JSON.parse(response.data));
    } catch (error) {
      console.log('error fetching single session', error)
    }
  }

  React.useEffect(() => {
    const fetchSessions = async function() {
      try {
        const sessions = await axios.get('http://localhost:5001/api/projects/1');
        setAllSessions(sessions.data);
      } catch (error) {
        console.error('Error fecthing sessions', error);
        throw error
      }
    }

    fetchSessions();
  }, [])

  return (
    <div className={styles.mainPageWrapper}>
      <div className={styles.headerContainer}>
        <Header project='Providence'/>
      </div>
      <div className={styles.sidebar}>
        <SessionSidebar onSessionSelect={handleSessionSelect} sessions={allSessions}/>
      </div>
      <div className={styles.player}>
        <Player session={selectedSession}/>
        <SessionInfoBox session={{session_id: 'Example Session Name'}}/>
      </div>
    </div>
  );
}

export default MainPage;
