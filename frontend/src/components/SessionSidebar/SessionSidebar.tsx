import React from 'react';
import SortDropdown from '../SortDropdown';
import styles from './SessionSidebar.module.css'
import down from '../../assets/down.png'
import SessionCard from '../SessionCard';
import FilterPopover from '../FilterPopover';
import { Session } from '../../Types';


interface SessionSidebarProps {
 sessions: Session[]
 onSessionSelect: (session: Session) => void
}

function SessionSidebar( { sessions, onSessionSelect } : SessionSidebarProps) {
 const [showSortDropdown, setShowSortDropdown] = React.useState(false)
 const [showFilterPopover, setShowFilterPopover] = React.useState(false)

 const toggleDropdown = function(e: React.MouseEvent) {
  e.stopPropagation()
  setShowFilterPopover(false)
  setShowSortDropdown((prev) => !prev)
 }

 const togglePopover= function(e: React.MouseEvent) {
  e.stopPropagation()
  setShowSortDropdown(false)
  setShowFilterPopover((prev) => !prev)
 }

 const handleClosingClick = function(e: React.MouseEvent) {
  if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
   setShowSortDropdown(false)
  }
  if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
   setShowFilterPopover(false)
  }
 }

 const dropdownRef = React.useRef<HTMLDivElement | null>(null);
 const popoverRef = React.useRef<HTMLDivElement | null>(null);

 return (
 <div className={styles.sidebarMain}>
 <div className={styles.sidebarHeader}>
 <button onClick={toggleDropdown} className={styles.sidebarButton}>
 Sort
 <svg width={30} height={30} xmlns="http://www.w3.org/2000/svg">
 <image href={down} x='2' y='6'height='20'width='20' />
 </svg>
 </button>
 {showSortDropdown && <SortDropdown onClosingClick={handleClosingClick} ref={dropdownRef}/>}
 <button onClick={togglePopover} className={styles.sidebarButton}>
 Filter
 <svg width={30} height={30} xmlns="http://www.w3.org/2000/svg">
 <image href={down} x='2' y='6' height='20' width='20' />
 </svg>
 </button>
 {showFilterPopover && <FilterPopover onClosingClick={handleClosingClick} ref={popoverRef}/>}
 </div>
 {sessions.map(session => {
 return <SessionCard onSessionSelect={onSessionSelect} session={session} />
 })}
 </div>

 );
}

export default SessionSidebar;
