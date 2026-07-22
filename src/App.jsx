import { useState } from 'react'
import './App.css'
import Navbar from './component/Navbar'
import Home from './component/Home'
import Categories from './component/Categories'
import FeaturedEquipment from './component/FeaturedEquipment'
import WhyChooseUs from './component/WhyChooseUs'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Home />
      <Categories />
      <FeaturedEquipment />
      <WhyChooseUs />

    </>
  )
}

export default App

// import {
//   Truck,
//   Building2,
//   HardHat,
//   Phone,
//   ChevronRight,
// } from "lucide-react";

// export default function App() {
//   const equipment = [
//     {
//       name: "Hydraulic Excavator",
//       image:
//         "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
//     },
//     {
//       name: "Tower Crane",
//       image:
//         "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
//     },
//     {
//       name: "Wheel Loader",
//       image:
//         "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
//     },
//   ];

//   const projects = [
//     {
//       year: "2023",
//       title: "National Highway Expansion",
//     },
//     {
//       year: "2024",
//       title: "Metro Rail Development",
//     },
//     {
//       year: "2025",
//       title: "Smart City Infrastructure",
//     },
//   ];

//   return (
//     <div className="bg-slate-950 text-white overflow-hidden">

//       {/* NAVBAR */}

//       <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-slate-950/70 border-b border-slate-800">
//         <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between">
//           <h1 className="text-2xl font-black text-amber-500">
//             BUILDMAX
//           </h1>

//           <div className="hidden md:flex gap-8">
//             <a href="#fleet">Fleet</a>
//             <a href="#projects">Projects</a>
//             <a href="#quote">Quote</a>
//             <a href="#contact">Contact</a>
//           </div>
//         </div>
//       </nav>

//       {/* HERO */}

//       <section className="relative min-h-screen flex items-center">

//         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent" />

//         <div className="absolute text-[18rem] font-black text-white/[0.03] top-20 left-0">
//           BUILD
//         </div>

//         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

//           <div>

//             <span className="uppercase tracking-[8px] text-amber-500">
//               Heavy Construction Solutions
//             </span>

//             <h1 className="text-6xl md:text-8xl font-black mt-5 leading-none">
//               Moving
//               <span className="text-amber-500"> Earth.</span>
//               <br />
//               Building
//               <br />
//               Tomorrow.
//             </h1>

//             <p className="text-slate-300 mt-8 text-lg max-w-xl">
//               Premium construction equipment for infrastructure,
//               industrial, mining and commercial projects.
//             </p>

//             <div className="flex gap-4 mt-10">
//               <button className="bg-amber-500 text-black px-8 py-4 rounded-full font-bold">
//                 Explore Fleet
//               </button>

//               <button className="border border-white/20 px-8 py-4 rounded-full">
//                 Get Quote
//               </button>
//             </div>
//           </div>

//           <div className="relative">
//             <img
//               src="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
//               className="rounded-3xl shadow-2xl hover:scale-105 transition duration-700"
//             />
//           </div>
//         </div>
//       </section>

//       {/* EQUIPMENT SHOWCASE */}

//       <section id="fleet" className="py-32">

//         <div className="text-center mb-20">
//           <h2 className="text-5xl font-black">
//             Equipment Fleet
//           </h2>

//           <p className="text-slate-400 mt-4">
//             Powerful machines for demanding projects
//           </p>
//         </div>

//         <div className="flex gap-8 overflow-x-auto px-8">

//           {equipment.map((item) => (
//             <div
//               key={item.name}
//               className="min-w-[380px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500 transition"
//             >
//               <img
//                 src={item.image}
//                 className="h-72 w-full object-cover"
//               />

//               <div className="p-8">
//                 <h3 className="text-2xl font-bold">
//                   {item.name}
//                 </h3>

//                 <button className="mt-5 flex items-center gap-2 text-amber-500">
//                   View Details
//                   <ChevronRight />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* STATS */}

//       <section className="py-24 bg-slate-900">

//         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center">

//           {[
//             ["500+", "Projects"],
//             ["150+", "Machines"],
//             ["15+", "Years"],
//             ["98%", "Client Satisfaction"],
//           ].map(([num, title]) => (
//             <div key={title}>
//               <h2 className="text-7xl font-black text-transparent stroke-text">
//                 {num}
//               </h2>

//               <p className="mt-3 text-slate-300">
//                 {title}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* BLUEPRINT SECTION */}

//       <section className="py-32 relative">

//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage:
//               "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg,#ffffff22 1px, transparent 1px)",
//             backgroundSize: "50px 50px",
//           }}
//         />

//         <div className="max-w-6xl mx-auto relative z-10">

//           <h2 className="text-5xl font-black text-center mb-16">
//             Why Choose Us
//           </h2>

//           <div className="grid md:grid-cols-4 gap-8">

//             <div className="border border-slate-700 p-8 rounded-2xl">
//               <HardHat size={40} />
//               <h3 className="mt-4 font-bold">
//                 Certified Fleet
//               </h3>
//             </div>

//             <div className="border border-slate-700 p-8 rounded-2xl">
//               <Truck size={40} />
//               <h3 className="mt-4 font-bold">
//                 Fast Deployment
//               </h3>
//             </div>

//             <div className="border border-slate-700 p-8 rounded-2xl">
//               <Building2 size={40} />
//               <h3 className="mt-4 font-bold">
//                 Mega Projects
//               </h3>
//             </div>

//             <div className="border border-slate-700 p-8 rounded-2xl">
//               <Phone size={40} />
//               <h3 className="mt-4 font-bold">
//                 24/7 Support
//               </h3>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* PROJECT TIMELINE */}

//       <section id="projects" className="py-32 bg-slate-900">

//         <div className="max-w-5xl mx-auto">

//           <h2 className="text-5xl font-black text-center mb-20">
//             Featured Projects
//           </h2>

//           {projects.map((project) => (
//             <div
//               key={project.year}
//               className="flex gap-10 mb-16"
//             >
//               <div className="text-amber-500 text-3xl font-black">
//                 {project.year}
//               </div>

//               <div>
//                 <h3 className="text-2xl font-bold">
//                   {project.title}
//                 </h3>

//                 <p className="text-slate-400 mt-2">
//                   Large-scale infrastructure development
//                   powered by our fleet.
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* QUOTE CALCULATOR */}

//       <section id="quote" className="py-32">

//         <div className="max-w-4xl mx-auto text-center">

//           <h2 className="text-5xl font-black">
//             Get Instant Recommendations
//           </h2>

//           <p className="text-slate-400 mt-4">
//             Select your project size
//           </p>

//           <div className="flex justify-center gap-5 mt-10 flex-wrap">

//             <button className="bg-slate-900 border border-slate-700 px-8 py-5 rounded-full">
//               Small Project
//             </button>

//             <button className="bg-amber-500 text-black px-8 py-5 rounded-full font-bold">
//               Medium Project
//             </button>

//             <button className="bg-slate-900 border border-slate-700 px-8 py-5 rounded-full">
//               Large Project
//             </button>

//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}

//       <section className="py-32 bg-slate-900">

//         <h2 className="text-5xl text-center font-black mb-16">
//           Client Testimonials
//         </h2>

//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">

//           {["Rajesh", "Amit", "Sandeep"].map((name) => (
//             <div
//               key={name}
//               className="bg-slate-950 p-8 rounded-3xl"
//             >
//               <div className="text-amber-500 text-4xl">
//                 ★★★★★
//               </div>

//               <p className="mt-4 text-slate-300">
//                 Excellent service and reliable equipment.
//               </p>

//               <h4 className="mt-6 font-bold">
//                 {name}
//               </h4>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CONTACT */}

//       <section id="contact" className="py-32">

//         <div className="max-w-4xl mx-auto text-center">

//           <h2 className="text-6xl font-black">
//             Ready To Build?
//           </h2>

//           <p className="text-slate-400 mt-6">
//             Talk with our equipment specialists today.
//           </p>

//           <div className="flex justify-center gap-5 mt-10 flex-wrap">

//             <button className="bg-green-500 text-black px-10 py-4 rounded-full font-bold">
//               WhatsApp Us
//             </button>

//             <button className="bg-amber-500 text-black px-10 py-4 rounded-full font-bold">
//               Request Quote
//             </button>

//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}

//       <footer className="bg-black border-t border-slate-800 py-16">

//         <div className="max-w-7xl mx-auto px-6">

//           <h2 className="text-4xl font-black text-amber-500">
//             BUILDMAX
//           </h2>

//           <p className="text-slate-400 mt-4">
//             Heavy Construction Equipment Solutions.
//           </p>

//           <div className="mt-10 border-t border-slate-800 pt-6 text-slate-500">
//             © 2026 BuildMax Equipment. All Rights Reserved.
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// }
