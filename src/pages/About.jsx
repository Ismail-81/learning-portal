import React from "react";
import CodeLearnLogo from "../components/CodeLearnLogo";

function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            About <span className="text-indigo-600">CodeLearn</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering the next generation of developers through accessible,
            comprehensive, and theory-first programming education.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                At CodeLearn, we believe that understanding the "why" is just as
                important as knowing the "how." Our theory-first approach
                bridges the gap between abstract computer science concepts and
                practical application.
              </p>
              <p>
                We strive to create an inclusive environment where anyone,
                regardless of their background, can master complex programming
                languages and frameworks through carefully structured tutorials,
                clear explanations, and real-world examples.
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Objectives
            </h2>
            <ul className="space-y-4">
              {[
                "Provide high-quality, structured learning materials.",
                "Make complex programming concepts easy to digest.",
                "Offer curated resources including downloadable PDFs and reference videos.",
                "Maintain a clean, distraction-free environment for optimal focus.",
                "Help students prepare for both academics and real-world careers.",
              ].map((objective, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 mr-3">
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">
              Built With Modern Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { name: "React", desc: "UI Library" },
                { name: "Vite", desc: "Build Tool" },
                { name: "Tailwind CSS", desc: "Styling" },
                { name: "Firebase", desc: "Backend & Auth" },
              ].map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <p className="font-bold text-xl mb-1">{tech.name}</p>
                  <p className="text-indigo-200 text-sm">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
