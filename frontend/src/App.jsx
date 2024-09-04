// import { Outlet } from "react-router-dom";
// import HeaderUser from "./components/HeaderUser";
// import HeaderAdmin from "./components/HeaderAdmin";
// import Footer from "./components/Footer";
// import "./index.css";
// import Cookies from "js-cookie"
// import { createContext, useState } from "react";

// export const KrjContext = createContext();

// export default function App() {
//   const [keranjang, setKeranjang] = useState([]);
//   const [userRole, setUserRole] = useState(Cookies.get("role") || ""); 
//   return (
//     <KrjContext.Provider value={{ keranjang, setKeranjang, userRole, setUserRole }}>
      
//       {userRole === "admin" ? <HeaderAdmin /> : <HeaderUser />}
//       <div>
//         <Outlet />
//       </div>
//       <Footer />
//     </KrjContext.Provider>
//   );
// }

import { Outlet } from "react-router-dom";
import HeaderUser from "./components/HeaderUser";
import HeaderAdmin from "./components/HeaderAdmin";
import Footer from "./components/Footer";
import "./index.css";
import Cookies from "js-cookie";
import { createContext, useState } from "react";

export const KrjContext = createContext();

export default function App() {
  const [keranjang, setKeranjang] = useState([]);
  const [userRole, setUserRole] = useState(Cookies.get("role") || "");
  const [historyCount, setHistoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const value = {
    keranjang,
    setKeranjang,
    historyCount,
    setHistoryCount,
    productCount,
    setProductCount,
    userRole,
    setUserRole,
  };

  return (
    <KrjContext.Provider value={value}>
      {userRole === "admin" ? <HeaderAdmin /> : <HeaderUser />}
      <div>
        <Outlet />
      </div>
      <Footer />
    </KrjContext.Provider>
  );
}
