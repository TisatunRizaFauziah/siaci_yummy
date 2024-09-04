import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { KrjContext } from "../App";
import { Search, Tag } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const { setKeranjang } = useContext(KrjContext);

  const token = Cookies.get("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [token]);

  const addToCart = (product) => {
    if (!token) {
      setMessage("Anda harus login untuk menambahkan produk ke keranjang.");
      return;
    }

    try {
      setKeranjang((prev) => {
        const existingProduct = prev.find((item) => item.id === product.id);
        if (existingProduct) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
      alert("Produk berhasil ditambahkan ke keranjang.");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setMessage("Terjadi kesalahan saat menambahkan produk ke keranjang.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const pindah = () => (location.href = "/login");
  if (!Cookies.get("token")) pindah();
  else
    return (
      <div className="bg-gray-50 min-h-screen">
        <main className="container mx-auto p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
              Mau Jajan Apa Hari Ini?
            </h2>
            <div className="flex items-center gap-3 bg-white shadow-md p-2 rounded-full">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Cari jajanan..."
                className="outline-none px-2 py-1 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={product.imageurl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <div className="flex flex-col items-center text-center">
                  {" "}
                  {/* Center content */}
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg text-green-700 font-medium mb-2">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <p className="text-gray-500 mb-4">Stock: {product.stok}</p>
                  <button
                    className={`mt-auto w-full ${
                      token
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white py-2 rounded-full transition-colors duration-300`}
                    disabled={!token}
                    onClick={() => addToCart(product)}
                  >
                    <Tag className="inline mr-2" /> Tambahkan Ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
}
