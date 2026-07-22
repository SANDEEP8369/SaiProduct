const items = [
    "Excavators",
    "Bulldozers",
    "Cranes",
    "Loaders",
    "Road Rollers",
    "Backhoe Loaders",
];

function Categories() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-5xl font-bold text-center text-gray-900 mb-4">
                    Equipment Categories
                </h2>

                <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
                    Explore our wide range of premium equipment designed for performance,
                    reliability, and efficiency.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div
                            key={item}
                            className=" group h-30 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-md flex items-center justify-center
               cursor-pointer transition-all duration-500 ease-out hover:scale-105  hover:-translate-y-3  hover:shadow-2xl  hover:border-amber-400
                                hover:bg-gradient-to-br  hover:from-amber-400 hover:to-orange-500"
                        >
                            <h3
                                className="text-2xl font-bold  text-gray-800 text-center  transition-all duration-300  group-hover:text-white  group-hover:tracking-wide "
                            >
                                {item}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}

export default Categories;