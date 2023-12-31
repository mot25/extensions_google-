/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { gsap } from 'gsap';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import IconSetting from '@/shared/assets/icon/Icon_setting.svg';
import IconPaste from '@/shared/assets/icon/IconPaste.svg';
import { PageNavigatorType } from '@/widgets/NavigationContentScreen/type';

import { PasteClass } from '../page/PasteClass';
import { Setting } from '../page/Setting';
import './popup.scss';

const App = () => {
  const [selectPage, setSelectPage] = useState<number>(1);

  function move(id: string, position: string, color: string) {
    setSelectPage(+id);
    const tl = gsap.timeline();

    tl.to('#bgBubble', { duration: 0.15, bottom: '-30px', ease: 'ease-out' }, 0)
      .to(
        '#bubble1',
        { duration: 0.1, y: '120%', boxShadow: 'none', ease: 'ease-out' },
        0
      )
      .to(
        '#bubble2',
        { duration: 0.1, y: '120%', boxShadow: 'none', ease: 'ease-out' },
        0
      )
      .to(
        '#bubble3',
        { duration: 0.1, y: '120%', boxShadow: 'none', ease: 'ease-out' },
        0
      )
      .to(
        '#bubble4',
        { duration: 0.1, y: '120%', boxShadow: 'none', ease: 'ease-out' },
        0
      )
      .to('.icon', { duration: 0.05, opacity: 0, ease: 'ease-out' }, 0)
      .to(
        '#bgBubble',
        { duration: 0.2, left: position, ease: 'ease-in-out' },
        0.1
      )
      .to(
        '#bgBubble',
        { duration: 0.15, bottom: '-50px', ease: 'ease-out' },
        '-=0.2'
      )
      .to(
        `#bubble${id}`,
        {
          duration: 0.15,
          y: '0%',
          opacity: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          ease: 'ease-out'
        },
        '-=0.1'
      )
      .to(
        `#bubble${id}> span`,
        { duration: 0.15, y: '0%', opacity: 0.7, ease: 'ease-out' },
        '-=0.1'
      )
      .to(
        '#navbarContainer',
        { duration: 0.3, backgroundColor: color, ease: 'ease-in-out' },
        0
      )
      .to(
        '#bg',
        { duration: 0.3, backgroundColor: color, ease: 'ease-in-out' },
        0
      )
      .to(
        '#bgBubble',
        { duration: 0.3, backgroundColor: color, ease: 'ease-in-out' },
        0
      );
  }

  // const divideByGroups = async () => {
  //   const tabs = await chrome.tabs.query({});
  //   const tabsGroupIds: Record<string, number[]> = {
  //     swagger: [],
  //     'pdm-kueg.io.neolant.su': [],
  //     'lukoil-test.io.neolant.su': [],
  //     confluence: [],
  //     tfs: [],
  //     'mail.neolant': []
  //   };
  //   const entriesTabGroup = Object.entries(tabsGroupIds);
  //   tabs.forEach(({url, id}) => {
  //     const key = entriesTabGroup.map(_ => _[0]).find(k => url.includes(k));
  //     if (!key) return;
  //     tabsGroupIds[key].push(id);
  //   });
  //   Object.entries(tabsGroupIds).forEach(async tabContent => {
  //     const group = await chrome.tabs.group({tabIds: tabContent[1]});
  //     await chrome.tabGroups.update(group, {title: tabContent[0]});
  //   });
  // };

  const objPage: PageNavigatorType = {
    1: <PasteClass />,
    2: <PasteClass />,
    3: <PasteClass />,
    4: <Setting />
  };

  return (
    <div className="wrapper">
      <div id="navbarContainer">
        <div id="navbar">
          <div className="bodyContent">
            {objPage[selectPage] || <PasteClass />}
          </div>
          <div id="bubbleWrapper">
            <div
              id="bubble1"
              className="bubble"
            >
              <span className="icon">
                <IconPaste />
              </span>
            </div>
            <div
              id="bubble2"
              className="bubble"
            >
              <span className="icon">2</span>
            </div>
            <div
              id="bubble3"
              className="bubble"
            >
              <span className="icon">3</span>
            </div>
            <div
              id="bubble4"
              className="bubble"
            >
              <span className="icon">
                <IconSetting />
              </span>
            </div>
          </div>
          <div id="menuWrapper">
            <div
              onClick={() => move('1', '50px', '#ffcc80')}
              className="menuElement"
            >
              {selectPage !== 1 && <IconPaste />}
            </div>
            <div
              onClick={() => move('2', '150px', '#81d4fa')}
              className="menuElement"
            >
              22
            </div>
            <div
              onClick={() => move('3', '250px', '#c5e1a5')}
              className="menuElement "
            >
              33
            </div>
            <div
              onClick={() => move('4', '350px', '#ce93d8')}
              className="menuElement"
            >
              {selectPage !== 4 && <IconSetting />}
            </div>
          </div>
        </div>
        <div id="bgWrapper">
          <div id="bg" />
          <div id="bgBubble" />
        </div>
      </div>
      <svg
        width="0"
        height="0"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="20"
              result="blur"
              id="blurFilter"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15"
              result="goo"
            />
            <feComposite
              in="SourceGraphic"
              in2="goo"
              operator="atop"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
