import Cookies from "js-cookie";

export default function About() {
  const pindah = () => (location.href = "/login");
  if (!Cookies.get("token")) {
    pindah();
  } else {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          <img
            src="https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/108/2023/10/25/shutterstock-553216271.jpg"
            alt="Aci dish"
            className="w-full h-40 object-cover"
            // Removed opacity-80 to make the image clearer
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            {/* Added a semi-transparent background to make text more readable */}
            <h1 className="text-4xl font-bold text-white drop-shadow-md">
              About SiAci Yummy
            </h1>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Text and Image Content */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Story
              </h2>
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                {/* Text */}
                <p className="text-lg text-gray-700 md:pr-6">
                  SiAci Yummy adalah merek terkemuka dalam industri restoran
                  yang mengusung konsep olahan aci (tepung kanji) dengan cita
                  rasa yang sangat lezat dan memuaskan. Nama "SiAci Yummy"
                  merupakan gabungan dari dua kata yang memiliki makna mendalam:
                  "SiAci" yang berasal dari kata "aci," merujuk pada bahan dasar
                  utama kami yang berbasis tepung kanji, dan "Yummy" yang
                  berarti enak atau lezat. Kombinasi ini mencerminkan komitmen
                  kami untuk menghadirkan makanan aci yang tidak hanya enak
                  tetapi juga menggugah selera.
                </p>
                {/* Image */}
                <img
                  src="https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/108/2023/10/25/shutterstock-553216271.jpg"
                  alt="SiAci Yummy Dishes"
                  className="rounded-lg shadow-lg mt-4 md:mt-0 md:w-1/2 transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                {/* Image */}
                <img
                  src="https://s.kaskus.id/images/2022/07/30/10600510_202207300915310536.jpg"
                  alt="Cilok"
                  className="rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6 md:w-1/2 transform hover:scale-105 transition-transform duration-300"
                />
                {/* Text */}
                <p className="text-lg text-gray-700">
                  Berdiri sejak awal tahun 2016, SiAci Yummy dengan cepat
                  dikenal sebagai pelopor dalam penyajian hidangan olahan aci di
                  Indonesia. Kami telah berhasil membangun reputasi yang solid
                  sebagai pemimpin pasar, khususnya di provinsi Jawa Barat, Jawa
                  Tengah, Jawa Timur, serta Kepulauan Bali. Dengan konsep
                  bersantap modern yang menawarkan harga terjangkau, SiAci Yummy
                  terus mendapatkan apresiasi dari pelanggan kami di setiap
                  lokasi kami hadir.
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Text */}
                <p className="text-lg text-gray-700 md:pr-6">
                  Komitmen kami terhadap inovasi dan kualitas adalah kunci
                  kesuksesan kami. Kami terus berusaha untuk menyajikan produk
                  dengan rasa yang autentik dan pengalaman bersantap yang
                  menyenangkan, menjadikan SiAci Yummy pilihan utama bagi para
                  pecinta makanan aci. Dengan tujuan untuk menjadi merek
                  terkemuka di tingkat nasional, kami selalu berfokus pada
                  pengembangan produk dan layanan kami agar tetap relevan dan
                  sesuai dengan harapan pelanggan kami yang setia.
                </p>
                {/* Image */}
                <img
                  src="https://awsimages.detik.net.id/community/media/visual/2020/07/03/cilok-atau-cimol.jpeg?w=1200"
                  alt="Cimol"
                  className="rounded-lg shadow-lg mt-4 md:mt-0 md:w-1/2 transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
