import React, { useState } from "react";
import LoginPage from "./pages/login/Login";
import ToonHQPage from "./pages/toonhq/Toonhq";
import Calculator from "./pages/calculator/CalculatorPage.tsx";
import { AppShell, NavLink } from "@mantine/core";

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div>{title} Page (coming soon)</div>
);

// Sidebar items enum
enum SidebarItems {
  Launch = "Launch",
  Calculator = "Calculator",
  MultiToon = "MultiToon",
  ToonHQ = "ToonHQ",
  Suits = "Suits",
  Fishing = "Fishing",
  ResourcePks = "ResourcePacks",
  Settings = "Settings",
}

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItems>(
    SidebarItems.Launch,
  );
  const [active, setActive] = useState(0);

  const renderPage = (): JSX.Element => {
    switch (selectedPage) {
      case SidebarItems.Launch:
        return <LoginPage />;
      case SidebarItems.Calculator:
        return <Calculator />;
      case SidebarItems.MultiToon:
        return <ComingSoonPage title="MultiToon Page" />;
      case SidebarItems.ToonHQ:
        return <ToonHQPage />;
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
    <>
      <AppShell
        padding="md"
        navbar={{
          width: { base: 150, md: 150, lg: 150 },
          breakpoint: "sm",
        }}
      >
        <AppShell.Navbar p="md">
          {Object.keys(SidebarItems).map((item, index) => (
            <NavLink
              key={item}
              label={item}
              active={index === active}
              onClick={() => {
                setSelectedPage(item as SidebarItems)
                setActive(index)
              }}
            >
            </NavLink>
          ))}
        </AppShell.Navbar>
        <AppShell.Main>
          {renderPage()}
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default App;
