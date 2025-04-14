import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <Outlet />  {/* This is where the child components will be rendered */}
    </div>
  );
};

export default MainLayout;
