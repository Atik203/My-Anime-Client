import MainLayout from "./components/layout/MainLayout";
import { ThemeProvider } from "./components/ui/theme-provider";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <MainLayout />
      </ThemeProvider>
    </>
  );
};

export default App;
