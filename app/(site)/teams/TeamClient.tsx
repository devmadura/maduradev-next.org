"use client";
import React, { useState } from "react";
import { Linkedin, Instagram } from "lucide-react";
import { CoreTeam } from "@/lib/supabase/types";
import { getPlaceholderAvatarUrl } from "@/lib/placeholder";
interface TeamClientProps {
  members: CoreTeam[];
}
const ModernTeamPage = ({ members }: TeamClientProps) => {
  const [hoveredCard, setHoveredCard] = useState<null | string>(null);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 dark:bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm border border-gray-900/10 dark:border-white/10 rounded-full">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Team
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Core Team MaduraDev
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
              onMouseEnter={() => setHoveredCard(member.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
              ></div>

              {/* Card */}
              <div className="relative h-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 transition-all duration-500 group-hover:border-gray-300 dark:group-hover:border-white/20 group-hover:translate-y-[-8px] shadow-lg dark:shadow-none group-hover:shadow-2xl">
                {/* Gradient border animation */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    padding: "1px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                ></div>

                {/* Avatar with animated ring */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full`}
                    style={{
                      animation:
                        hoveredCard === member.id
                          ? "spin 3s linear infinite"
                          : "none",
                      padding: "3px",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  ></div>
                  <div className="relative w-full h-full bg-gray-100 dark:bg-slate-800 rounded-full p-1 border-2 border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30 transition-all duration-500">
                    <img
                      src={
                        member.avatar_url ||
                        getPlaceholderAvatarUrl(member.name)
                      }
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                    {member.name}
                  </h3>

                  <div
                    className={`inline-block px-4 py-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full text-sm font-medium text-white`}
                  >
                    {member.position}
                  </div>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {member.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 pt-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="group/social relative w-10 h-10 bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500/10 dark:hover:bg-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all duration-300"
                      >
                        <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400 transition-colors" />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur opacity-0 group-hover/social:opacity-100 transition-opacity"></div>
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        className="group/social relative w-10 h-10 bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500/10 dark:hover:bg-pink-500/20 hover:border-pink-500 dark:hover:border-pink-500/50 transition-all duration-300"
                      >
                        <Instagram className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/social:text-pink-600 dark:group-hover/social:text-pink-400 transition-colors" />
                        <div className="absolute inset-0 bg-pink-500/20 rounded-lg blur opacity-0 group-hover/social:opacity-100 transition-opacity"></div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ModernTeamPage;
