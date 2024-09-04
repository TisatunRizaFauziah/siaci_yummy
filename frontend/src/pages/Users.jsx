import { createContext, useState } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";



export const KrjContext = createContext();

export default function Users() {
  const [keranjang, setKeranjang] = useState([]);
  const [userRole] = useState("user")
  return (
    <>
     <KrjContext.Provider value={{ keranjang, setKeranjang,userRole }}>
    
     <HeaderAdmin />
    <div>  
      <Outlet />    
    </div>
     <Footer />
    </KrjContext.Provider>
    
     </>
   
  );
}


