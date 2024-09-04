import Cookies from "js-cookie";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  if (!Cookies.get("token")) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      {/* Full-Width Image Section */}
      <div className="relative mb-12">
        <img
          src="https://lh3.googleusercontent.com/VuHFjfcAh-AAddAY1FHdO0Bed3nKhpkIetf_u8nNJtgI2dBvGWGRw-0raT8VAhRDYe32NA7PAXHRkpGXdNRz97Aczkip1GvbrKPEiVFl-7le3ns7G8Nvz4S4aY6Q1qiSPuRR5Hl0TXTrgt5lNQ"
          alt="SiAci Yummy"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black bg-opacity-50 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Selamat Datang di SiAci Yummy!
          </h1>
          <p className="text-lg mb-6 text-white">
            Nikmati berbagai macam produk gurih, enak, dan lezat hanya di SiAci
            Yummy. Kami berkomitmen untuk memberikan kualitas terbaik untuk
            setiap produk yang kami tawarkan.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white mt-12 py-8 px-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Menu Andalan Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              imgSrc:
                "https://id-test-11.slatic.net/p/359911095ee2af487d498a5dcc7169a0.jpg",
              title: "Cilok Bumbu Kacang",
              description:
                "Nikmati cilok (bola-bola tepung kanji) yang kenyal, disajikan dengan bumbu kacang yang kaya rasa. Setiap gigitan memberikan sensasi tekstur yang memuaskan, berpadu dengan saus kacang yang gurih dan sedikit pedas.",
            },
            {
              imgSrc:
                "https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/31/2023/09/09/ewhgwhJPG-306239480.jpg",
              title: "Cireng Isi",
              description:
                "Cireng (aci goreng) yang renyah di luar dan lembut di dalam, dengan berbagai isian pilihan yang menggugah selera. Cobalah berbagai variasi rasa yang kami tawarkan untuk pengalaman kuliner yang berbeda setiap kali.",
            },
            {
              imgSrc:
                "https://www.kba.one/files/images/20231104-screenshot-20231104-123946-instagram.jpg",
              title: "Batagor",
              description:
                "Sajian batagor kami terbuat dari ikan tenggiri dan tepung kanji, digoreng hingga crispy dan disajikan dengan bumbu kacang yang lezat serta sambal yang pedas. Perfectly paired for a satisfying snack or meal.",
            },
            {
              imgSrc:
                "https://cdn.idntimes.com/content-images/community/2022/09/fromandroid-2a7c02339b70c67935fd567bc12ddc4a.jpg",
              title: "Bakso Aci",
              description:
                "Bakso aci kami merupakan kombinasi sempurna antara daging bakso yang lembut dan bola-bola aci yang kenyal. Disajikan dengan kuah yang gurih dan bumbu khas yang membuat setiap suapan terasa nikmat.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-purple-100"
            >
              <img
                src={item.imgSrc}
                alt={item.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="bg-cover bg-center bg-opacity-50 bg-black text-white mt-12 py-8 shadow-lg rounded-lg"
        style={{
          backgroundImage: 'url("https://example.com/your-image.jpg")',
        }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-4">
            "Yuk, Cicipi Berbagai Hidangan Lezat Kami! Temukan Cita Rasa Baru di
            Sini!"
          </h1>
          <Link
            to="/products"
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 inline-flex items-center"
          >
            Product
          </Link>
        </div>
      </div>

      {/* Feedback Form */}
      <div className=" bg-blue-400 mt-12">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Kritik dan Saran
        </h2>
        <form
          action="YOUR_FORM_ACTION_URL" // Add the form action URL here
          method="POST"
          className="bg-white p-6 shadow-lg rounded-lg"
        >
          <input
            type="email"
            placeholder="Email Anda"
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            required
          />
          <textarea
            rows="4"
            placeholder="Masukkan kritik dan saran Anda di sini..."
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Kirim
          </button>
        </form>
      </div>

      {/* Contact and Info Section */}
      <div className="bg-gray-200 mt-12 py-8 px-6 shadow-lg rounded-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <a href="#" className="text-2xl font-bold text-gray-800">
                SiAci Yummy<span className="text-red-500">.</span>
              </a>
              <p className="text-lg mt-4 mb-4 text-gray-600">
                Alamat Kami:
                <br />
                Jl. Dakota No.8A, Kota Bandung,
                <br /> Jawa Barat, 12345
              </p>
            </div>

            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="font-semibold mb-2 text-gray-800">Contact Info</p>
              <p className="mb-1">+62 (341) 123-45678</p>
              <p className="mb-1">helpdesk@siaciyummy.co.id</p>
              <p className="mb-1">cs@siaciyummy.co.id</p>
              <a
                href="http://wbs.siacyummy.co.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                wbs.siacyummy.co.id
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="font-semibold mb-2 text-gray-800">Opening Hours</p>
              <p className="mb-1">Senin-Minggu: 08:00-22:00</p>
              <p>Beberapa Outlets 24 Jam</p>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center mt-6 space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
              aria-label="Facebook"
            >
              <Facebook size={32} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
              aria-label="Twitter"
            >
              <Twitter size={32} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
              aria-label="Instagram"
            >
              <Instagram size={32} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
