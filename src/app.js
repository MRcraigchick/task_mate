import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DarkModeSwitch from './components/dark_mode_switch/dark_mode_switch';
import Dashboard from './pages/dashboard/dashboard';
import NewTask from './pages/new_task/new_task';
import styles from './main.module.css';
import colorScales from './theme/color_scales/color_scales_collection.module.css';
import theme from './theme/theme.module.css';
import typography from './typography/typography.module.css';

export default function App ({ }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={ `${styles.mainContainer} ${darkMode ? theme.dark : theme.light} ${colorScales.colorScales} ${typography.typography
        }` }>
      <nav className={ styles.toolbar }>
        <header className={ styles.headerContainer }>
          <Link to={ '/' }>
            <h1 className={ styles.logo }>Task Mate</h1>
          </Link>
        </header>
        <DarkModeSwitch darkMode={ darkMode } setDarkMode={ setDarkMode } />
      </nav>
      <section className={ styles.content }>
        <Routes>
          <Route path='/' element={ <Dashboard darkMode={ darkMode } /> } />
          <Route path='/newtask' element={ <NewTask darkMode={ darkMode } /> } />
        </Routes>
      </section>
      <footer></footer>
    </div>
  );
}
