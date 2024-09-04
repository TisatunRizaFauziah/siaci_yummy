import { useState, useEffect } from "react";
import { Trash, SquarePen, PlusCircle, Search } from "lucide-react";
import Cookies from "js-cookie";

export default function ListProducts() {
  const [products, setProducts] = useState([]);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const token = Cookies.get("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch products, status: " + response.status
          );
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching products:", error.message);
        alert("An error occurred while fetching products. Please try again.");
      });
  }, [token]);

  function handleDelete(product) {
    if (confirm("Are you sure you want to delete this product?")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.text())
        .then((message) => {
          setProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== product.id)
          );
          alert(message);
        })
        .catch((error) => {
          console.error("Error deleting product:", error.message);
          alert(
            "An error occurred while deleting the product. Please try again."
          );
        });
    }
  }

  function saveUpdate() {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/products/${updateProduct.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateProduct),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === updateProduct.id ? updateProduct : p
          )
        );
        setUpdateProduct(null);
      })
      .catch((error) => {
        console.error("Error updating product:", error.message);
        alert(
          "An error occurred while updating the product. Please try again."
        );
      });
  }

  function handleAddNewProduct() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then(() => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setNewProduct(null);
      })
      .catch((error) => {
        console.error("Error adding new product:", error.message);
        alert("An error occurred while adding the product. Please try again.");
      });
  }

  const filterData = products
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1;
      }
    })
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const navigateToLogin = () => (location.href = "/login");
  if (!Cookies.get("token")) navigateToLogin();
  else
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="flex flex-col md:flex-row items-center mb-6 p-3 gap-2 bg-white border-b border-gray-200 shadow-md rounded-lg">
          <button
            onClick={() =>
              setNewProduct({ name: "", price: "", stok: "", imageurl: "" })
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="text-white" /> Add Product
          </button>
          <div className="flex items-center gap-2 w-full md:w-1/3 mt-4 md:mt-0">
            <Search className="text-gray-600" />
            <input
              type="text"
              className="bg-white border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <label className="text-gray-700">Sort By</label>
            <select
              className="rounded-lg border border-gray-300 p-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">Normal</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <label className="text-gray-700">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full bg-white border border-purple-500 rounded-lg shadow-md">
            <thead className="bg-purple-500">
              <tr>
                <th className="p-3 border-b text-left">Image</th>
                <th className="p-3 border-b text-left">Name</th>
                <th className="p-3 border-b text-left">Price</th>
                <th className="p-3 border-b text-left">Stock</th>
                <th className="p-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterData.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-purple-50 transition-transform transform hover:scale-100"
                >
                  <td className="p-3 border-b">
                    <div className="w-16 h-16 relative">
                      <img
                        src={product.imageurl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="p-3 border-b">{product.name}</td>
                  <td className="p-3 border-b">
                    Rp {product.price.toLocaleString()}
                  </td>
                  <td className="p-3 border-b">{product.stok}</td>
                  <td className="p-3 border-b flex space-x-2">
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash />
                    </button>
                    <button
                      onClick={() => setUpdateProduct(product)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <SquarePen />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {updateProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-1/3 shadow-lg relative">
              <button
                onClick={() => setUpdateProduct(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Trash />
              </button>
              <h2 className="text-xl font-semibold mb-4">Update Product</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveUpdate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={updateProduct.name}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    value={updateProduct.price}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={updateProduct.stok}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        stok: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={updateProduct.imageurl}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        imageurl: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}

        {newProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-1/3 shadow-lg relative">
              <button
                onClick={() => setNewProduct(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Trash />
              </button>
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddNewProduct();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stok}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stok: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={newProduct.imageurl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageurl: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}
