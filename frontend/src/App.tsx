import React, { useState } from "react";
import LoginPage from "./pages/login/Login";
import ToonHQPage from "./pages/toonhq/Toonhq";
import Calculator from "./pages/calculator/CalculatorPage.tsx";
import { AppShell } from "@mantine/core";

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div>{title} Page (coming soon)</div>
);
const SettingsPage: React.FC = () => <div>Settings Page (coming soon)</div>;

// Sidebar items enum
enum SidebarItems {
  Launch = "Launch",
  Calculator = "Calculator",
  ToonHQ = "ToonHQ",
  Suits = "Suits",
  ResourcePacks = "ResourcePacks",
  Settings = "Settings",
}

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItems>(
    SidebarItems.Launch,
  );

  const renderPage = (): JSX.Element => {
    switch (selectedPage) {
      case SidebarItems.Launch:
        return <LoginPage />;
      case SidebarItems.Calculator:
        return <Calculator />;
      case SidebarItems.ToonHQ:
        return <ToonHQPage />;
      case SidebarItems.Suits:
        return <ComingSoonPage title="Cog Suits" />;
      case SidebarItems.ResourcePacks:
        return <ComingSoonPage title="Resource Packs" />;
      case SidebarItems.Settings:
        return <SettingsPage />;
      default:
        return <div>Unknown Page</div>;
    }
  };

  return (
    <>
      <AppShell
        padding="md"
        navbar={{
          width: { base: 150, lg: 150 },
          breakpoint: "sm",
        }}
      >
        <AppShell.Navbar p="md">
          {Object.keys(SidebarItems).map((item) => (
            <div
              key={item}
              onClick={() =>
                setSelectedPage(item as SidebarItems)
              }
            >
              {item}
            </div>
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
