'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function StorefrontPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMockup, setActiveMockup] = useState(3); // Default yang tengah (3) yang di depan

  return (
    <div className="min-h-screen bg-[#FBFBF9] font-sans text-[#3A4B40] overflow-x-hidden relative">

      {/* ================= BACKGROUND GELOMBANG (SVG) ================= */}
      <div className="absolute top-0 left-0 w-full h-[600px] z-0 pointer-events-none">
        <svg viewBox="0 0 1440 400" className="absolute top-0 left-0 w-full h-auto opacity-40" preserveAspectRatio="none">
          <path fill="#D1E0D7" d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,154.7C672,128,768,96,864,101.3C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
        <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-auto opacity-30" preserveAspectRatio="none">
          <path fill="#8BA896" d="M0,64L60,85.3C120,107,240,149,360,165.3C480,181,600,171,720,144C840,117,960,75,1080,69.3C1200,64,1320,96,1380,112L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>

      {/* ================= HEADER / TOP BAR ================= */}
      <header className="absolute top-6 left-6 right-6 md:top-8 md:left-10 md:right-10 z-30 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/icon.svg" alt="TemuHati Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          <span className="font-bold text-xl md:text-2xl text-[#3A4B40] tracking-tight">
            TemuHati
          </span>
        </Link>

        {/* MENU KANAN (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#katalog" className="text-sm font-bold text-[#3A4B40]/70 hover:text-[#3A4B40] hover:scale-105 transition-all">
            Katalog
          </Link>
          <Link href="#fitur" className="text-sm font-bold text-[#3A4B40]/70 hover:text-[#3A4B40] hover:scale-105 transition-all">
            Fitur
          </Link>
          <a
            href="https://wa.me/6285221011424"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 backdrop-blur-sm border border-[#D1E0D7] text-[#3A4B40] hover:bg-[#F0F5F2] hover:border-[#8BA896] px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm flex items-center gap-2"
          >
            Konsultasi
          </a>
          <Link href="/login" className="bg-[#3A4B40] text-[#FBFBF9] hover:bg-[#2C3931] px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm">
            Masuk / Daftar
          </Link>
        </div>

        {/* HAMBURGER MENU (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#3A4B40] p-2 hover:bg-[#F0F5F2] rounded-full transition-colors relative z-40 bg-white/50 backdrop-blur-sm"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* DROPDOWN MENU (Mobile) */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-6 right-6 bg-white border border-[#D1E0D7] rounded-2xl shadow-xl p-5 flex flex-col gap-4 z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <Link href="#katalog" className="text-sm font-bold text-[#3A4B40] border-b border-[#D1E0D7] pb-3 hover:text-[#8BA896] transition-colors">Katalog</Link>
          <Link href="#fitur" className="text-sm font-bold text-[#3A4B40] border-b border-[#D1E0D7] pb-3 hover:text-[#8BA896] transition-colors">Fitur</Link>
          <Link href="/login" className="text-sm font-bold text-[#3A4B40] border-b border-[#D1E0D7] pb-3 hover:text-[#8BA896] transition-colors">Masuk / Daftar</Link>
          <a href="https://wa.me/6285221011424" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3A4B40] hover:text-[#8BA896] transition-colors">
            Konsultasi WhatsApp
          </a>
        </div>
      )}
      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-32 md:pt-40 pb-20 w-full px-6 md:px-10 relative z-10 flex justify-center">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Kiri: Teks & CTA */}
          <div className="text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight text-[#3A4B40] leading-tight">
              Titik Temu Hatimu, Berawal dari Sini.
            </h1>
            <p className="text-[#3A4B40]/80 text-base md:text-lg mb-10 font-medium max-w-xl leading-relaxed">
              Buat dan edit sendiri undangan digitalmu kapan saja. Praktis, tanpa ribet, dan siap disebarkan dalam hitungan menit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <button className="bg-[#3A4B40] text-[#FBFBF9] px-8 py-4 rounded-full font-bold hover:bg-[#2C3931] transition-all duration-300 shadow-[0_8px_20px_rgba(58,75,64,0.2)] hover:shadow-[0_8px_25px_rgba(58,75,64,0.3)] hover:-translate-y-0.5">
                  Buat Undangan Gratis
                </button>
              </Link>
              <Link href="#katalog">
                <button className="bg-white/80 backdrop-blur-sm border border-[#D1E0D7] text-[#3A4B40] px-8 py-4 rounded-full font-bold hover:bg-[#F0F5F2] hover:border-[#8BA896] transition-all duration-300 shadow-sm">
                  Lihat Katalog
                </button>
              </Link>
            </div>
          </div>

          {/* Kanan: Visual 3 Mockup (Interactive Touch & Hover) */}
          <div className="relative w-full h-[320px] md:h-[550px] flex items-center justify-center order-1 lg:order-2">
            {/* Efek Blur Glow di Belakang */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 bg-[#8BA896]/20 rounded-full blur-3xl -z-10"></div>

            {/* Mockup 1 (Kiri Belakang) */}
            <Link
              href="#katalog"
              onClick={(e) => {
                if (activeMockup !== 1) {
                  e.preventDefault();
                  setActiveMockup(1);
                }
              }}
              className={`absolute w-[120px] md:w-[220px] h-[250px] md:h-[460px] bg-white border-[4px] md:border-[6px] border-[#D1E0D7] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform transition-all duration-300 block cursor-pointer -translate-x-12 md:-translate-x-28 md:hover:z-30 md:hover:scale-100 md:hover:-rotate-6 md:hover:opacity-100 ${activeMockup === 1 ? 'z-30 scale-100 -rotate-6 opacity-100 shadow-2xl' : 'z-10 scale-90 -rotate-12 opacity-90 shadow-xl'
                }`}
            >
              <div className="absolute top-0 inset-x-0 h-3 md:h-5 bg-[#D1E0D7] rounded-b-lg md:rounded-b-xl w-16 md:w-24 mx-auto z-30"></div>
              <img src="/mockup-3.jpg" alt="Preview 1" className="w-full h-full object-cover object-top pointer-events-none" />
            </Link>

            {/* Mockup 2 (Kanan Belakang) */}
            <Link
              href="#katalog"
              onClick={(e) => {
                if (activeMockup !== 2) {
                  e.preventDefault();
                  setActiveMockup(2);
                }
              }}
              className={`absolute w-[120px] md:w-[220px] h-[250px] md:h-[460px] bg-white border-[4px] md:border-[6px] border-[#D1E0D7] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform transition-all duration-300 block cursor-pointer translate-x-12 md:translate-x-28 md:hover:z-30 md:hover:scale-100 md:hover:rotate-6 md:hover:opacity-100 ${activeMockup === 2 ? 'z-30 scale-100 rotate-6 opacity-100 shadow-2xl' : 'z-10 scale-90 rotate-12 opacity-90 shadow-xl'
                }`}
            >
              <div className="absolute top-0 inset-x-0 h-3 md:h-5 bg-[#D1E0D7] rounded-b-lg md:rounded-b-xl w-16 md:w-24 mx-auto z-30"></div>
              <img src="/mockup-2.jpg" alt="Preview 2" className="w-full h-full object-cover object-top pointer-events-none" />
            </Link>

            {/* Mockup 3 (Tengah Depan) */}
            <Link
              href="#katalog"
              onClick={(e) => {
                if (activeMockup !== 3) {
                  e.preventDefault();
                  setActiveMockup(3);
                }
              }}
              className={`absolute w-[140px] md:w-[240px] h-[290px] md:h-[500px] bg-white border-[4px] md:border-[6px] border-[#D1E0D7] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform transition-all duration-300 block cursor-pointer md:hover:z-30 md:hover:scale-100 md:hover:-translate-y-2 md:hover:opacity-100 ${activeMockup === 3 ? 'z-30 scale-100 -translate-y-2 opacity-100 shadow-2xl' : 'z-10 scale-90 translate-y-0 opacity-90 shadow-xl'
                }`}
            >
              <div className="absolute top-0 inset-x-0 h-3 md:h-5 bg-[#D1E0D7] rounded-b-lg md:rounded-b-xl w-20 md:w-28 mx-auto z-30"></div>
              <img src="/mockup-1.jpg" alt="Preview 3" className="w-full h-full object-cover object-top pointer-events-none" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= 2. FITUR SECTION ================= */}
      <section id="fitur" className="relative w-full py-24 z-20 flex items-center overflow-hidden">

        {/* Background Foto (Full Lebar) */}
        <img
          src="/pengantin.jpg"
          alt="Background Pengantin"
          className="absolute inset-0 w-full h-full object-cover object-center lg:object-left z-0"
        />

        {/* Gradient Overlay: Desktop (kanan gelap, kiri transparan), Mobile (bawah gelap, atas transparan) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#3A4B40] via-[#3A4B40]/95 to-[#3A4B40]/40 lg:bg-gradient-to-l lg:from-[#3A4B40] lg:via-[#3A4B40]/95 lg:to-transparent"></div>

        {/* Kontainer Lebar (Sejajar dengan Logo: px-6 md:px-10) */}
        <div className="w-full px-6 md:px-10 relative z-10 flex flex-col lg:flex-row justify-end">

          {/* KANAN: List Fitur Terpilih (Compact) */}
          <div className="lg:w-1/2 xl:w-[45%]">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-[#FBFBF9] tracking-tight text-center lg:text-left drop-shadow-md">
              Fitur Lengkap TemuHati
            </h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                "Bebas Ganti Ke Semua Tema",
                "Fitur Auto Scroll",
                "Ubah Font & Warna Tulisan",
                "Ubah Susunan Komponen",
                "RSVP & QRCode Buku Tamu",
                "Sebar Ke Unlimited Penerima",
                "Terintegrasi Google Maps",
                "Countdown & Kalender",
                "Rekening & Kado Fisik",
                "Galeri Foto & Video",
                "Ratusan Musik Custom",
                "Request Tema Baru"
              ].map((fitur, i) => (
                <div key={i} className="flex items-start md:items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#8BA896] shrink-0 drop-shadow-md mt-0.5 md:mt-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#FBFBF9]/95 font-medium text-[11px] md:text-sm drop-shadow-md leading-tight">{fitur}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. KATALOG SECTION ================= */}
      <section id="katalog" className="py-20 px-6 bg-white/60 backdrop-blur-sm border-t border-[#D1E0D7] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Katalog Tema</h2>
            <p className="text-[#3A4B40]/70 font-medium">Pilih desain yang paling mencerminkan konsep pernikahan lu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card: Elegan 01 */}
            <div className="bg-[#FBFBF9] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#D1E0D7] hover:border-[#8BA896] group">
              <div className="h-64 bg-[#F0F5F2] relative flex items-center justify-center text-[#3A4B40]/40 font-bold overflow-hidden">
                Preview Elegan-01
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Tema Elegan 01</h3>
                <p className="text-sm text-[#3A4B40]/70 mb-6 font-medium line-clamp-2">
                  Desain elegan dan mewah dengan sentuhan tipografi modern minimalis.
                </p>
                <div className="flex gap-3">
                  <Link href="/preview/elegan-01" target="_blank" className="flex-1">
                    <button className="w-full bg-white border border-[#D1E0D7] text-[#3A4B40] py-3 rounded-xl text-sm font-bold hover:bg-[#F0F5F2] hover:border-[#8BA896] transition-all duration-300 shadow-sm">
                      Preview
                    </button>
                  </Link>
                  <Link href="/login?template=elegan-01" className="flex-1">
                    <button className="w-full bg-[#3A4B40] text-[#FBFBF9] py-3 rounded-xl text-sm font-bold hover:bg-[#2C3931] transition-all duration-300 shadow-md hover:-translate-y-0.5">
                      Buat
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card: Rustic 01 */}
            <div className="bg-[#FBFBF9] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#D1E0D7] hover:border-[#8BA896] group">
              <div className="h-64 bg-[#F0F5F2] relative flex items-center justify-center text-[#3A4B40]/40 font-bold overflow-hidden">
                Preview Rustic-01
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Tema Rustic 01</h3>
                <p className="text-sm text-[#3A4B40]/70 mb-6 font-medium line-clamp-2">
                  Desain minimalis dengan sentuhan botani alam dan palet warna hangat.
                </p>
                <div className="flex gap-3">
                  <Link href="/preview/rustic-01" target="_blank" className="flex-1">
                    <button className="w-full bg-white border border-[#D1E0D7] text-[#3A4B40] py-3 rounded-xl text-sm font-bold hover:bg-[#F0F5F2] hover:border-[#8BA896] transition-all duration-300 shadow-sm">
                      Preview
                    </button>
                  </Link>
                  <Link href="/login?template=rustic-01" className="flex-1">
                    <button className="w-full bg-[#3A4B40] text-[#FBFBF9] py-3 rounded-xl text-sm font-bold hover:bg-[#2C3931] transition-all duration-300 shadow-md hover:-translate-y-0.5">
                      Buat
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. FOOTER ================= */}
      <footer className="bg-[#3A4B40] text-[#FBFBF9] py-12 px-6 text-center border-t border-[#2C3931] relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-80">
            <img src="/icon.svg" alt="TemuHati Logo" className="w-6 h-6 invert brightness-0" />
            <span className="font-bold text-lg tracking-tight">TemuHati</span>
          </div>
          <p className="mb-8 text-sm font-medium text-[#FBFBF9]/60">
            © {new Date().getFullYear()} TemuHati. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-[#FBFBF9]/70">
            <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <a href="https://wa.me/6285221011424" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hubungi Kami</a>
          </div>
        </div>
      </footer>

    </div>
  )
}