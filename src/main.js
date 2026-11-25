import '@fontsource/bricolage-grotesque/400.css';
import '@fontsource/bricolage-grotesque/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/stage.css';
import './styles/work.css';
import './styles/lab.css';
import './styles/about.css';
import './styles/detail.css';

import { createScroll } from './animations/scroll.js';
import { initCursor, initMagnets } from './animations/cursor.js';
import { runIntro } from './sections/intro.js';
import { initNav } from './sections/nav.js';
import { initHero } from './sections/hero.js';
import { initStage } from './sections/phone.js';
import { initWork } from './sections/work.js';
import { initLab } from './sections/lab.js';
import { initAbout } from './sections/about.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 760px)').matches;
document.documentElement.classList.toggle('reduced', reduced);

const scroll = createScroll({ reduced });
initCursor();
const nav = initNav({ scroll });
const hero = initHero({ scroll, reduced, mobile });
initStage({ scroll, reduced, mobile, nav });
initWork({ scroll, reduced });
initLab({ reduced, mobile });
initAbout({ scroll, reduced });
initMagnets(reduced);

runIntro({ reduced }).then(() => hero.play());
