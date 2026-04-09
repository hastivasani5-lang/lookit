"use client";

import Image from "next/image";

const About = () => {
	return (
		<section className="w-full pt-20 pb-0 px-4 md:px-8 bg-[#eef5f3] relative overflow-hidden">
			{/* LEFT DECORATION */}
			<div className="absolute top-16 left-10 hidden animate-float md:block">
				<img src="/leaf.png" alt="leaf" className="w-12.5 h-12.5" />
			</div>

			{/* RIGHT DECORATION */}
			<div className="absolute top-16 right-10 hidden animate-float-slow md:block">
				<Image src="/wave.png" alt="wave" width={100} height={100} className="h-auto w-auto" />
			</div>

			{/* MAIN CONTAINER */}
			<div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 text-center lg:grid-cols-2 lg:gap-16 lg:text-left">
				{/* LEFT SIDE */}
				<div className="relative flex items-center justify-center self-end pt-8 md:pt-12 lg:pt-16" data-aos="fade-right">
					<div className="relative w-72 sm:w-88 md:w-[24rem] lg:w-[28rem] xl:w-[30rem]">
						{/* IMAGE */}
						<Image
							src="/about1.png"
							alt="about"
							width={500}
							height={500}
							className="w-full h-auto object-contain relative z-10 scale-110 md:scale-115 lg:scale-120 origin-center"
						/>

						{/* ROTATING CIRCLE */}
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-[110%] h-[110%] border-2 border-dashed border-[#1ec28e]/40 rounded-full animate-spin-slow"></div>
						</div>
					</div>
				</div>

				{/* RIGHT SIDE */}
				<div data-aos="fade-left" className="mx-auto w-full max-w-115 self-start lg:mx-0 lg:pt-2">
					{/* SMALL TITLE */}
					<p className="mb-3 flex items-center justify-center gap-2 text-[11px] tracking-widest text-gray-500 lg:justify-start">
						<span className="w-1.5 h-1.5 bg-[#1ec28e] rounded-full"></span>
						ABOUT US
					</p>

					{/* HEADING */}
					<h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-[1.3] mb-4 tracking-tight">
						Who We Are Introduction to{" "}
						<br className="hidden md:block" />
						Educate Online Platform
					</h2>

					{/* DESCRIPTION */}
					<p className="text-gray-500 text-sm leading-[1.7] mb-5">
						Educate the ultimate destination for knowledge seekers and educators alike.
						We are committed to transforming special education impact global channels
						without standards compliant systems
					</p>

					{/* FEATURES */}
					<div className="mb-5 flex flex-wrap justify-center gap-x-8 gap-y-3 lg:justify-start">
						<div className="flex items-center gap-2">
							<span className="w-4 h-4 flex items-center justify-center rounded-full border border-[#1ec28e] text-[#1ec28e] text-[10px]">
								✔
							</span>
							<p className="text-gray-800 text-sm font-medium">Innovative Learning System</p>
						</div>

						<div className="flex items-center gap-2">
							<span className="w-4 h-4 flex items-center justify-center rounded-full border border-[#1ec28e] text-[#1ec28e] text-[10px]">
								✔
							</span>
							<p className="text-gray-800 text-sm font-medium">Worldwide Intelligent Learner</p>
						</div>
					</div>

					{/* LINE */}
					<div className="border-t border-gray-200 my-5"></div>

					{/* STATS */}
					<div className="mb-5 flex flex-col items-center justify-between gap-6 sm:flex-row lg:items-start">
						<div className="flex items-start gap-3">
							<h3 className="text-3xl font-bold text-[#1ec28e]">30+</h3>
							<p className="text-gray-500 text-xs leading-5">
								Expert and Professional <br />
								all Instructor
							</p>
						</div>

						<div className="flex items-start gap-3">
							<h3 className="text-3xl font-bold text-[#1ec28e]">6k+</h3>
							<p className="text-gray-500 text-xs leading-5">
								Enrolled Students all <br />
								Over the World
							</p>
						</div>
					</div>

					{/* LINE */}
					<div className="border-t border-gray-200 mb-5"></div>
				</div>
			</div>

			{/* BOOK IMAGE */}
			<Image
				src="/books.png"
				alt="books"
				width={130}
				height={130}
				className="absolute bottom-10 right-6 hidden h-auto w-auto md:block lg:right-10 animate-float"
			/>
		</section>
	);
};

export default About;