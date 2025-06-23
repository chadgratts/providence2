import styles from './Header.module.css'
import providenceImg from '../../assets/providence-.png'

interface HeaderProps {
  onLogin?: (e:any) => void
  project?: string
}

function Header({ onLogin, project }: HeaderProps) {
  return (
    <header className={styles.header}>
      <svg width="280" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f45c5c" />
            <stop offset="25%" stopColor="#ff8551" />
            <stop offset="50%" stopColor="#ffaf50" />
            <stop offset="75%" stopColor="#ffd85f" />
            <stop offset="100%" stopColor="#f5ff80" />
          </linearGradient>
        </defs>
        <image href={providenceImg} x="-10" y="-17" height="100px" width="100px"/>
        <text fill="url(#gradient)" x="90" y="40" fontSize="30">Providence</text>
      </svg>

      {project && <div className={`${styles.projectName} ${styles.gradientText}`}>
        Logged in as project: {project}
      </div>}

      {!project && <button onClick={onLogin} className={styles.login}>
        Login
      </button>}
    </header>
  );
}

export default Header;
