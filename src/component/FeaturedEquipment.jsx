const machines = [
  {
    name: "CAT 320 Excavator",
    capacity: "20 Ton",
  },
  {
    name: "JCB 3DX",
    capacity: "Backhoe Loader",
  },
  {
    name: "Komatsu D65",
    capacity: "Bulldozer",
  },
];

function FeaturedEquipment() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Equipment
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {machines.map((machine) => (
            <div
              key={machine.name}
              className="shadow-lg rounded-xl overflow-hidden"
            >
              <div className="h-56 bg-gray-300"></div>

              <div className="p-6">
                <h3 className="text-xl font-bold">
                  {machine.name}
                </h3>

                <p>{machine.capacity}</p>

                <button className="mt-4 bg-yellow-400 px-5 py-2 rounded">
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedEquipment;