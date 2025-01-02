import { Outlet } from "react-router-dom";
import Footer from "../ui/custom/Footer";
import { Navbar } from "../ui/custom/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-w-7xl mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
