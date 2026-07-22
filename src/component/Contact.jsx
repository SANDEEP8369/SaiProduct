function Contact() {
    return (
        <section className="py-20 bg-gray-100">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-10">
                    Request a Quote
                </h2>

                <form className="bg-white p-8 rounded-xl shadow">
                    <input
                        className="w-full border p-3 mb-4"
                        placeholder="Name"
                    />

                    <input
                        className="w-full border p-3 mb-4"
                        placeholder="Phone"
                    />

                    <textarea
                        className="w-full border p-3 mb-4"
                        rows="5"
                        placeholder="Project Details"
                    />

                    <button className="w-full bg-yellow-400 py-3 rounded font-bold">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Contact;