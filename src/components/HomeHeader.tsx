import React from 'react';

interface Props {
  userName?: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Xayrli tong';
  if (h < 17) return 'Xayrli kun';
  return 'Xayrli kech';
}

export const HomeHeader: React.FC<Props> = ({ userName = 'Foydalanuvchi' }) => {
  const today = new Date();
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  return (
    <div style={styles.header}>
      <div>
        <p style={styles.greeting}>{getGreeting()} 👋</p>
        <p style={styles.name}>{userName}</p>
        <p style={styles.date}>{dateStr}</p>
      </div>
      <div style={styles.avatar}>
        <span style={{ fontSize: 24 }}>👤</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px 8px',
  },
  greeting: {
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(45,39,69,0.6)',
    margin: 0,
  },
  name: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D2745',
    margin: '2px 0 0',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 12,
    color: 'rgba(45,39,69,0.5)',
    margin: '2px 0 0',
    fontWeight: 500,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    background: 'linear-gradient(135deg, rgba(107,143,246,0.25), rgba(107,143,246,0.12))',
    border: '1px solid rgba(107,143,246,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
};
