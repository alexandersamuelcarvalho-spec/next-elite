'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

const AppContext = createContext(null);

// Translation dictionary
const translations = {
  en: {
    english: 'ENGLISH',
    espanol: 'ESPAÑOL',
    newPlayer: 'NEW PLAYER',
    logIn: 'LOG IN',
    findMyTeam: 'FIND MY TEAM',
    back: 'BACK',
    account: 'ACCOUNT',
    welcome: 'WELCOME',
    captain: 'CAPTAIN',
    player: 'PLAYER',
    admin: 'ADMIN',
    allTeams: 'ALL TEAMS',
    allLeagues: 'ALL LEAGUES',
    schedules: 'SCHEDULES',
    locations: 'LOCATIONS',
    accounts: 'ACCOUNTS',
    payments: 'PAYMENTS',
    onGoing: 'ON GOING',
    past: 'PAST',
    createTeam: 'CREATE TEAM',
    addLeague: 'ADD LEAGUE',
    addTeam: 'ADD TEAM',
    addToLeague: 'ADD TO LEAGUE',
    table: 'TABLE',
    schedule: 'SCHEDULE',
    playoffBracket: 'PLAYOFF BRACKET',
    leagueTable: 'LEAGUE TABLE',
    teams: 'TEAMS',
    teamList: 'TEAM LIST',
    teamLeagues: 'TEAM LEAGUES',
    role: 'ROLE',
    connectFacebook: 'CONNECT WITH FACEBOOK',
    connectGoogle: 'CONNECT WITH GOOGLE',
    homePage: 'HOME PAGE',
    payment: 'PAYMENT',
    location: 'LOCATION',
    day: 'DAY',
    division: 'DIVISION',
    month: 'MONTH',
    status: 'STATUS',
    price: 'PRICE',
    captainNum: "CAPTAIN #",
    playerNum: "PLAYER #",
    select: '(SELECT)',
    addLocation: 'ADD LOCATION',
    save: 'SAVE',
    newTeam: '(NEW TEAM)',
    newLeague: '(NEW LEAGUE)',
    createLeague: 'CREATE LEAGUE',
  },
  es: {
    english: 'ENGLISH',
    espanol: 'ESPAÑOL',
    newPlayer: 'NUEVO JUGADOR',
    logIn: 'INICIAR SESIÓN',
    findMyTeam: 'BUSCAR MI EQUIPO',
    back: 'ATRÁS',
    account: 'CUENTA',
    welcome: 'BIENVENIDO',
    captain: 'CAPITÁN',
    player: 'JUGADOR',
    admin: 'ADMIN',
    allTeams: 'TODOS LOS EQUIPOS',
    allLeagues: 'TODAS LAS LIGAS',
    schedules: 'HORARIOS',
    locations: 'UBICACIONES',
    accounts: 'CUENTAS',
    payments: 'PAGOS',
    onGoing: 'EN CURSO',
    past: 'PASADO',
    createTeam: 'CREAR EQUIPO',
    addLeague: 'AGREGAR LIGA',
    addTeam: 'AGREGAR EQUIPO',
    addToLeague: 'AGREGAR A LIGA',
    table: 'TABLA',
    schedule: 'HORARIO',
    playoffBracket: 'LLAVE DE PLAYOFF',
    leagueTable: 'TABLA DE LIGA',
    teams: 'EQUIPOS',
    teamList: 'LISTA DE EQUIPOS',
    teamLeagues: 'LIGAS DEL EQUIPO',
    role: 'ROL',
    connectFacebook: 'CONECTAR CON FACEBOOK',
    connectGoogle: 'CONECTAR CON GOOGLE',
    homePage: 'PÁGINA PRINCIPAL',
    payment: 'PAGO',
    location: 'UBICACIÓN',
    day: 'DÍA',
    division: 'DIVISIÓN',
    month: 'MES',
    status: 'ESTADO',
    price: 'PRECIO',
    captainNum: "# CAPITÁN",
    playerNum: "# JUGADOR",
    select: '(SELECCIONAR)',
    addLocation: 'AGREGAR UBICACIÓN',
    save: 'GUARDAR',
    newTeam: '(NUEVO EQUIPO)',
    newLeague: '(NUEVA LIGA)',
    createLeague: 'CREAR LIGA',
  },
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [userRole, setUserRole] = useState(null); // null | 'admin' | 'captain' | 'player' | 'guest'
  const [userAccount, setUserAccount] = useState(null);
  const [historyStack, setHistoryStack] = useState([]);

  const t = (key) => translations[language][key] || translations['en'][key] || key;

  const switchLanguage = (lang) => setLanguage(lang);

  return (
    <SessionProvider>
      <AppContext.Provider value={{
        language,
        switchLanguage,
        t,
        userRole,
        setUserRole,
        userAccount,
        setUserAccount,
        historyStack,
        setHistoryStack,
      }}>
        {children}
      </AppContext.Provider>
    </SessionProvider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
