import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../Footer";
function Layout() {

  return (
    <>
      <Navbar />
      <div className="main py-5">
        {/* Outlet è una componente di react router che funge da
         placeholder per estendere il layout stile laravel */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Layout;