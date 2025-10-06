import React, { useState } from "react";
import LoginPage from "./pages/login/Login";
import ToonHQPage from "./pages/toonhq/Toonhq";
import Calculator from "./pages/calculator/CalculatorPage.tsx";


const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div>{title} Page (coming soon)</div>
);
const SettingsPage: React.FC = () => <div>Settings Page (coming soon)</div>;

// Sidebar items enum
enum SidebarItems {
  Launch = 0,
  Calcs,
  ToonHQ,
  Suits,
  Doodle,
  Settings,
}

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItems>(
    SidebarItems.Launch,
  );

  const renderPage = (): JSX.Element => {
    switch (selectedPage) {
      case SidebarItems.Launch:
        return <LoginPage />;
      case SidebarItems.Calcs:
        return <Calculator />;
      case SidebarItems.ToonHQ:
        return <ToonHQPage/>;
      case SidebarItems.Suits:
        return <ComingSoonPage title="Cog Suits" />;
      case SidebarItems.Doodle:
        return <ComingSoonPage title="Doodle" />;
      case SidebarItems.Settings:
        return <SettingsPage />;
      default:
        return <div>Unknown Page</div>;
    }
  };

  return (
    <div
      className="app"
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "150px",
          backgroundColor: "#222",
          color: "white",
          padding: "10px",
        }}
      >
        {Object.keys(SidebarItems)
          .filter((key) => isNaN(Number(key)))
          .map((key) => (
            <div
              key={key}
              onClick={() =>
                setSelectedPage(
                  SidebarItems[
                  key as keyof typeof SidebarItems
                  ],
                )}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selectedPage ===
                  SidebarItems[
                  key as keyof typeof SidebarItems
                  ]
                  ? "#444"
                  : "transparent",
                marginBottom: "4px",
                borderRadius: "4px",
              }}
            >
              {key}
            </div>
          ))}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#1e1e1e",
          color: "white",
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
