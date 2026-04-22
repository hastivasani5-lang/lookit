"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Star, UserCheck, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import type { PublicProfessional } from "@/lib/professional-display";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23e6f4ef'/%3E%3Ccircle cx='200' cy='170' r='78' fill='%2398b8ab'/%3E%3Crect x='90' y='270' width='220' height='170' rx='85' fill='%2398b8ab'/%3E%3C/svg%3E";

const Instructors = () => {
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const studentId = session?.user?.id ?? null;

  const [professionals, setProfessionals] = useState<PublicProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/professionals")
      .then((r) => r.json())
      .then((data: { professionals?: PublicProfessional[] }) => {
        const list = data.professionals ?? [];
        const sorted = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        setProfessionals(sorted);
      })
      .catch(() => setProfessionals([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!studentId) return;
    fetch(`/api/follows?studentId=${studentId}`)
      .then((r) => r.json())
      .then((data: Array<{ professionalId: string }>) => {
        if (Array.isArray(data)) setFollowedIds(new Set(data.map((f) => f.professionalId)));
      })
      .catch(() => undefined);
  }, [studentId]);

  const handleFollow = async (professionalId: string) => {
    if (!isStudent || !studentId) return;
    setFollowLoading(professionalId);
    const alreadyFollowing = followedIds.has(professionalId);
    try {
      if (alreadyFollowing) {
        await fetch("/api/follows", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, professionalId }),
        });
        setFollowedIds((prev) => { const s = new Set(prev); s.delete(professionalId); return s; });
      } else {
        await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, professionalId }),
        });
        setFollowedIds((prev) => new Set([...prev, professionalId]));
      }
    } catch { /* ignore */ }
    finally { setFollowLoading(null); }
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
                INSTRUCTORS
              </div>
              <div className="mt-3 w-full h-px bg-gray-300"></div>
            </div>
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
                Introducing the Educators and<br />Professional Instructor
              </h2>
            </div>
          </div>
        </div>

        {/* SLIDER */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#1ec28e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              loop={professionals.length > 1}
              autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ nextEl: ".instructors-swiper-next", prevEl: ".instructors-swiper-prev" }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {professionals.map((item, i) => (
                <SwiperSlide key={item.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    data-aos="zoom-in-up"
                    data-aos-delay={i * 100}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Image - same as Top Rated */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || PLACEHOLDER_SVG}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_SVG; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      {/* Rating badge on image */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-amber-600 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{item.rating.toFixed(1)}</span>
                        <span className="text-gray-500">·</span>
                        <span>{item.reviews} reviews</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="mt-0.5 text-sm font-medium text-emerald-600 line-clamp-1">{item.specialization}</p>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs text-gray-500">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-emerald-600">•</span>
                          </div>
                          <span className="text-xs text-gray-500">Language: {item.language}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex w-full gap-2">
                        <Link
                          href={`/professionals/${item.id}`}
                          className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-95"
                        >
                          View Profile
                        </Link>
                        {isStudent ? (
                          <button
                            type="button"
                            onClick={() => void handleFollow(item.id)}
                            disabled={followLoading === item.id}
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 ${
                              followedIds.has(item.id)
                                ? "border-[#1ec28e] bg-[#effaf6] text-[#1ec28e] hover:border-red-400 hover:bg-red-50 hover:text-red-500"
                                : "border-primary bg-white text-primary hover:bg-[#e6f7f0]"
                            }`}
                          >
                            {followLoading === item.id ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : followedIds.has(item.id) ? (
                              <UserCheck className="h-3.5 w-3.5" />
                            ) : (
                              <UserPlus className="h-3.5 w-3.5" />
                            )}
                            {followedIds.has(item.id) ? "Following" : "Follow"}
                          </button>
                        ) : (
                          <Link
                            href="/login"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:scale-[1.02] hover:bg-[#e6f7f0] active:scale-95"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Follow
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* LEFT ARROW */}
            <button
              type="button"
              className="instructors-swiper-prev absolute left-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#1ec28e]/25 bg-white text-[#1ec28e] shadow-lg transition hover:bg-[#1ec28e] hover:text-white md:flex md:-left-4 lg:-left-6"
            >
              <ArrowLeft size={23} />
            </button>

            {/* RIGHT ARROW */}
            <button
              type="button"
              className="instructors-swiper-next absolute right-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#1ec28e]/25 bg-white text-[#1ec28e] shadow-lg transition hover:bg-[#1ec28e] hover:text-white md:flex md:-right-4 lg:-right-6"
            >
              <ArrowRight size={23} />
            </button>
          </div>
        )}
      </div>

      {/* LEFT DECOR */}
      <div className="absolute left-6 top-24 hidden md:block">
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="w-1 h-6 bg-orange-400 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* RIGHT FLOATING ICON */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-0 right-6 hidden md:block"
      >
        <Image src="/start.png" alt="icon" width={180} height={180} className="h-auto w-auto" />
      </motion.div>
    </section>
  );
};

export default Instructors;
