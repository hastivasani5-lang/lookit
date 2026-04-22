
"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";

const blogs = [
  {
    id: 1,
    image: "/blog-thumb1.png",
    date: "18 January, 2025",
    author: "John D. Alexon",
    title: "10 Proven Strategies to excel Online Learning",
    subtitle: "Globally engage cross-media leadership skills before cross-media innovation forward morph flexible whereas process-centric models predom efficiently.",
    content: `Dramatically harness cross-platform best practices whereas business services. Conveniently standards in innovation with wireless vertical intellectual capital before global architectures.\n\nDramatically harness global business based results with wireless standards. Conveniently formulate standards in innovation with wireless vertical intellectual capital before global architectures.\n\nGlobally engage leadership skills before cross-media innovation forward morph flexible whereas process-centric models predom efficiently that's transformation customer-directed alignments for front-end minds.`,
    tags: ["Technology", "Education", "Learning"],
  },
  {
    id: 2,
    image: "/blog-thumb2.png",
    date: "29 January, 2025",
    author: "Anjelina Watson",
    title: "Trends that are shaping the Learning experience",
    subtitle: "Discover the latest trends transforming how students and professionals learn in the digital age.",
    content: `The landscape of education is rapidly evolving. New technologies and methodologies are reshaping how we learn and teach.\n\nFrom AI-powered personalized learning to immersive virtual classrooms, the future of education is here. Institutions and learners alike must adapt to stay ahead.\n\nEmbracing these trends not only improves outcomes but also makes learning more engaging and accessible for everyone around the world.`,
    tags: ["Trends", "EdTech", "Innovation"],
  },
  {
    id: 3,
    image: "/blog-thumb3.png",
    date: "30 January, 2025",
    author: "David X. Barmer",
    title: "Learning is the Key soft skills and Professional",
    subtitle: "Soft skills are increasingly valued in the professional world. Learn how to develop them effectively.",
    content: `In today's competitive job market, technical skills alone are not enough. Employers are looking for candidates who can communicate, collaborate, and lead.\n\nSoft skills such as emotional intelligence, adaptability, and critical thinking are now considered essential. Investing in these skills can dramatically improve your career prospects.\n\nOnline learning platforms offer a wide range of courses to help you build these competencies at your own pace and schedule.`,
    tags: ["Soft Skills", "Career", "Professional"],
  },
];

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const blog = blogs.find((b) => b.id === id);
  if (!blog) return notFound();

  return (
    <section className="bg-[#eaf7f2] min-h-[100vh] py-12 px-2 md:px-8 lg:px-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 mt-6 text-[#1a2c47]">Blog Details</h1>
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-[#1ec28e] hover:text-[#169e6d] transition-all group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#1ec28e] group-hover:bg-[#1ec28e] group-hover:text-white transition-all">
              ←
            </span>
            Back
          </button>
        </div>
        {/* Breadcrumbs */}
        <nav className="flex justify-center mb-8 text-sm text-[#1ec28e] gap-2">
          <span>HOME</span>
          <span className="text-gray-400">→</span>
          <span>LATEST BLOG</span>
          <span className="text-gray-400">→</span>
          <span className="truncate max-w-[180px] uppercase">{blog.title.slice(0, 30)}...</span>
        </nav>

        <div className="bg-white rounded-2xl shadow p-6 md:p-10">
          {/* Blog Image */}
          <div className="relative mb-6 rounded-xl overflow-hidden">
            <Image src={blog.image} alt={blog.title} width={900} height={400} className="w-full h-[340px] object-cover" />
            {/* Category badge */}
            {blog.tags && blog.tags[0] && (
              <span className="absolute top-4 left-4 bg-[#1ec28e] text-white px-4 py-1 rounded-full text-xs font-semibold shadow">{blog.tags[0]}</span>
            )}
          </div>

          {/* Author, Date, Comments */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mb-6">
            <div className="flex items-center gap-2">
              <Image src="/pro1.jpeg" width={32} height={32} alt="author" className="rounded-full" />
              <span className="text-sm text-gray-700 font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg width="18" height="18" fill="none" stroke="#1ec28e" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg width="18" height="18" fill="none" stroke="#1ec28e" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>01 Comments</span>
            </div>
          </div>

          {/* Blog Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a2c47] mb-4">{blog.title}</h2>
          {blog.subtitle && <div className="text-lg text-gray-700 mb-6">{blog.subtitle}</div>}

          {/* Blog Content */}
          <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
            {blog.content}
          </div>

          {/* Highlighted Quote */}
          <div className="bg-[#eaf7f2] border-l-4 border-[#1ec28e] px-6 py-4 rounded-xl mb-8 text-[#1a2c47] text-lg font-medium">
            “Globally engage cross-media leadership skills before cross-media great opportunities whereas process-centric models efficiently.”
          </div>

          {/* Learn Benefits Section */}
          <h3 className="text-xl font-bold text-[#1a2c47] mb-3">Learn Benefits</h3>
          <div className="text-gray-700 mb-4">{blog.subtitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm mb-6">
            <div className="flex items-center gap-2"><span className="text-[#1ec28e] font-bold">✔</span> Professional Team</div>
            <div className="flex items-center gap-2"><span className="text-[#1ec28e] font-bold">✔</span> Problem Solving</div>
            <div className="flex items-center gap-2"><span className="text-[#1ec28e] font-bold">✔</span> 24/7 Supports Available</div>
            <div className="flex items-center gap-2"><span className="text-[#1ec28e] font-bold">✔</span> Free Tools Provides for Clients</div>
            <div className="flex items-center gap-2"><span className="text-[#1ec28e] font-bold">✔</span> Solutions the Clients Problems</div>
            <div className="flex items-center gap-2"><span className="text-[#1ec28e] font-bold">✔</span> Extra Facilities Sales Increase</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {blog.tags?.map((tag) => (
              <span key={tag} className="bg-[#eaf7f2] text-[#1ec28e] px-3 py-1 rounded-full text-xs font-semibold">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}