function WhyChooseUs() {
    return (
        <section className="bg-[#222222] text-white py-20">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">
                    Why Choose Us
                </h2>

                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        "Certified Equipment",
                        "Fast Delivery",
                        "Expert Support",
                        "Competitive Pricing",
                    ].map((item) => (
                        <div
                            key={item}
                            className="text-center"
                        >
                            <div className="text-yellow-400 text-4xl mb-4">
                                ✓
                            </div>
                            <h3>{item}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;