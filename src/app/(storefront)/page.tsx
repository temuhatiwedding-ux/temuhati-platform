import Link from 'next/link'

export default function StorefrontPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Katalog Undangan Temuhati</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Template: Rustic 01 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="h-64 bg-gray-300 relative">
              {/* Gambar thumbnail template lu nanti masuk sini */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Preview Rustic-01
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Tema Rustic 01</h3>
              <p className="text-sm text-gray-600 mb-6">Desain minimalis dengan sentuhan alam dan warna hangat.</p>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm">
                  Preview
                </button>
                <Link href="/login?template=rustic-01" className="flex-1">
                  <button className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 text-sm">
                    Buat Undangan
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}