function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                <h1 className="text-3xl font-extrabold">
                    <span className="text-white">Sai</span>
                    <span className="text-amber-400"> Product India</span>
                </h1>

                <ul className="flex gap-10 text-white font-medium">
                    {["Home", "About", "Equipment", "Projects", "Contact"].map(
                        (item) => (
                            <li
                                key={item}
                                className="
                                    relative cursor-pointer
                                    hover:text-amber-400
                                    transition-all duration-300

                                    after:absolute
                                    after:left-0
                                    after:-bottom-2
                                    after:h-[2px]
                                    after:w-0
                                    after:bg-amber-400
                                    after:transition-all
                                    hover:after:w-full
                                "
                            >
                                {item}
                            </li>
                        )
                    )}
                </ul>

                <button className="bg-amber-500 px-6 py-3 rounded-full font-semibold hover:bg-amber-400 transition">
                    Get Quote
                </button>
            </div>
        </nav>
    );
}

export default Navbar;