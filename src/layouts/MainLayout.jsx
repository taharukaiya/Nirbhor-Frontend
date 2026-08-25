import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden overflow-y-auto bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
