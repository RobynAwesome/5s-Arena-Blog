import { useState } from "react";
import { IKImage } from "imagekitio-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const imageKitEndpoint =
    import.meta.env.VITE_IK_URL_ENDPOINT ||
    "https://ik.imagekit.io/default_fallback";

  const links = ["Home", "Trending", "Most Popular", "About"];

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between px-4">
    {/* LOGO */}
    <div className="flex items-center gap-4 text-2xl font-bold">
      <IKImage
        urlEndpoint="https://ik.imagekit.io/mholkp6zok/"
        path="/logo.png"
        className="w-8 h-8"
        alt="5s Arena Blog Logo"
      />
      <span>5s Arena Blog</span>
    </div>

    {/* MOBILE MENU */}
    <div className="md:hidden">
        <div
         className="cursor-pointer text-4xl select-none"
         onClick={() => setOpen((prev) => !prev)}
         aria-label="Toggle menu"
        >
         {open ? "X" : "☰"}
    </div>

    {/* MOBILE LINK LIST */}
        <div
         className={`fixed top-16 w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg bg-green-700 transition-transform duration-300 ease-in-out z-50 ${
         open ? "translate-x-0" : "translate-x-full"
         }`}
        >
            <a href="/">Home</a>
            <a href="/">Trending</a>
            <a href="/">Most Popular</a>
            <a href="/">About</a>
            <a href="/">
                  <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md">
                    Login ✋🏿
                  </button>
                </a>
            </div>
        </div>
        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
                <a href="/">Home</a>
            <a href="/">Trending</a>
            <a href="/">Most Popular</a>
            <a href="/">About</a>
            <a href="/">
                  <button className="py-2 px-4 rounded-3xl bg-green-800 text-white shadow-md">
                    Login ✋🏿
                  </button>
                </a>
            </div>
        </div>
    );
 };

export default Navbar;