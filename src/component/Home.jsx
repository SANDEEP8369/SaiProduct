import crane from "../assets/crane.png"

function Home() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f59e0b33,transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#f59e0b22,transparent_35%)]" />

            {/* Huge Background Text */}
            <h1
                className="
                    absolute
                    top-28
                    left-10
                    text-[12rem]
                    md:text-[18rem]
                    font-black
                    text-white/[0.04]
                    select-none
                "
            >
                BUILD
            </h1>

            <div className="relative z-10 max-w-7xl mx-auto px-8 min-h-screen flex items-center">

                {/* Left Content */}
                <div className="flex-1">
                    <span className="text-amber-400 uppercase tracking-[6px] text-sm">
                        Heavy Machinery Experts
                    </span>

                    <h2 className="mt-6 text-6xl md:text-7xl font-extrabold leading-tight text-white">
                        Moving Earth.
                        <br />
                        Building
                        <span className="text-amber-400"> Tomorrow.</span>
                    </h2>

                    <p className="mt-8 text-slate-300 text-xl max-w-xl leading-relaxed">
                        Premium construction equipment and machinery solutions
                        for infrastructure, mining, industrial, and commercial
                        projects across India.
                    </p>

                    <div className="flex gap-5 mt-10">
                        <button
                            className="
                                px-8 py-4
                                bg-amber-500
                                rounded-full
                                font-semibold
                                text-black
                                hover:bg-amber-400
                                hover:scale-105
                                transition
                            "
                        >
                            Explore Fleet
                        </button>

                        <button
                            className="
                                px-8 py-4
                                border border-white/20
                                rounded-full
                                text-white
                                hover:bg-white/10
                                transition
                            "
                        >
                            View Projects
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-12 mt-16">
                        <div>
                            <h3 className="text-4xl font-bold text-amber-400">
                                500+
                            </h3>
                            <p className="text-slate-400">
                                Equipment Units
                            </p>
                        </div>

                        <div>
                            <h3 className="text-4xl font-bold text-amber-400">
                                150+
                            </h3>
                            <p className="text-slate-400">
                                Projects Completed
                            </p>
                        </div>

                        <div>
                            <h3 className="text-4xl font-bold text-amber-400">
                                10+
                            </h3>
                            <p className="text-slate-400">
                                Years Experience
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 flex justify-center">
                    <div className="relative">

                        {/* Glow behind image */}
                        <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />

                        <img
                            src={crane}
                            alt="crane"
                            className="
                                relative
                                w-[700px]
                                object-contain
                                drop-shadow-[0_20px_50px_rgba(245,158,11,0.3)]
                                hover:scale-105
                                transition-all
                                duration-700
                            "
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;