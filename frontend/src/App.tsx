import React, { useEffect, useReducer, useState } from "react";
import LoginPage from "./modules/login/LoginPage.tsx";
import Calculator from "./modules/calculator/CalculatorPage.tsx";
import { AppShell } from "@mantine/core";
import {
  GetAllAccounts,
  Login,
} from "../bindings/YATL/services/loginservice.ts";
import { SidebarItems } from "./components/navbar/NavbarTypes.ts";
import MultiToonPage from "./modules/multiToon/MultiToonPage.tsx";
import Navbar from "./components/navbar/NavbarLink.tsx";
import YATLReducer, { YATLActionType, YATLState } from "./state.ts";
import { MTProfile, MTSession } from "./modules/multiToon/logic/MultiToonTypes.ts";
import { LoadAllMTProfileNames, LoadMTProfile } from "../bindings/YATL/services/multiservice.ts";
import dreamlandTheme from "./themes/DreamlandTheme.ts";

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div>{title} Page (coming soon)</div>
);

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItems>(
    SidebarItems.Launch,
  );

  const initialYatlState: YATLState = {
    MTProfiles: [],
    MTSessions: [],
    accounts: [],
    processIDs: {},
  };

  const [yatlState, yatlDispatch] = useReducer(YATLReducer, initialYatlState)

  useEffect(() => {
    const fetchAccounts = async () => {
      const allAccounts = await GetAllAccounts();
      yatlDispatch({ type: YATLActionType.SET_ACCOUNTS, accounts: allAccounts });

      const initialPIDs: Record<string, number> = {};
      allAccounts.forEach((acc) => {
        initialPIDs[acc] = -1;
        yatlDispatch({ type: YATLActionType.ADD_PID, username: acc, pid: -1, })
      });
    };

    const fetchKeyBinds = async () => {
      const rawNames = await LoadAllMTProfileNames();
      const profileNames = Object.keys(rawNames);

      for (const name of profileNames) {
        const keys = await LoadMTProfile(name)
        yatlDispatch({ type: YATLActionType.ADD_MT_PROFILE, profile: {name: name, keyMap: keys}})
      }
    }
    fetchAccounts();
    fetchKeyBinds();
  }, []);


  // TODO: Add PID heartbeaT
  const handlePlay = async (username: string) => {
    const pid = await Login(username);
    yatlDispatch({ type: YATLActionType.ADD_PID, pid: pid, username: username })
  };

  const renderPage = (): JSX.Element => {
    switch (selectedPage) {
      case SidebarItems.Launch:
        return (
          <LoginPage
            handlePlay={handlePlay}
            processIDs={yatlState.processIDs}
            accounts={yatlState.accounts}
          />
        );
      case SidebarItems.Calculator:
        return <Calculator />;
      case SidebarItems.MultiToon:
        return <MultiToonPage
          MTSessions={yatlState.MTSessions}
          yatlProfiles={yatlState.MTProfiles}
          AddMTSession={(session: MTSession) => yatlDispatch({ type: YATLActionType.ADD_MT_SESSION, session: session })}
          AddMTProfile={(profile: MTProfile) => yatlDispatch({ type: YATLActionType.ADD_MT_PROFILE, profile: profile})}
          EditMTProfile={(profile: MTProfile) => yatlDispatch({ type: YATLActionType.EDIT_MT_PROFILE, profile: profile})}
        />;
      case SidebarItems.Suits:
        return <ComingSoonPage title="Cog Suits" />;
      case SidebarItems.Fishing:
        return <ComingSoonPage title="Fishing Page" />;
      case SidebarItems.ResourcePks:
        return <ComingSoonPage title="Resource Packs" />;
      case SidebarItems.Settings:
        return <ComingSoonPage title="Settings" />;
      default:
        return <div>Unknown Page</div>;
    }
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: { base: 80, md: 80, lg: 80 },
        breakpoint: "sm",
      }}
      style={{ background: dreamlandTheme.colors!.dark![8]}}
    >
      <Navbar selectedPage={selectedPage} setSelectedPage={setSelectedPage}/>
      <AppShell.Main>
        {renderPage()}
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
