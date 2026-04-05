import Badge from "@/components/ui/badge";
import {
  AlarmClock,
  Calendar,
  ChartNoAxesCombined,
  ClipboardClock,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  { image: "/brand-1.png", name: "Phoenix" },
  { image: "/brand-2.png", name: "Arnova" },
  { image: "/brand-3.png", name: "Lecturn" },
  { image: "/brand-4.png", name: "Agilix" },
  { image: "/brand-5.png", name: "Aquinova" },
];

const problem_statements = [
  {
    icon: ClipboardClock,
    statement: "Overlapping appointments and scheduling conflicts",
  },
  { icon: Users, statement: "Inefficient use of staff and resources" },
  {
    icon: Calendar,
    statement: "No clear visibility into daily operations",
  },
  { icon: AlarmClock, statement: "Time wasted on manual coordination" },
  {
    icon: ChartNoAxesCombined,
    statement: "Difficulty tracking performance and no-show rates",
  },
];

const features = [
  {
    title: "Automated Resource Allocation",
    description:
      "Generate accurate, curriculum-aligned study materials instantly — no waiting for lectures or slides.",
  },
  {
    title: "Real-Time Calendar Visualization",
    description:
      "Generate accurate, curriculum-aligned study materials instantly — no waiting for lectures or slides.",
  },
  {
    title: "Conflict Detection & Buffer Management",
    description:
      "Avoid overlaps and maintain operational flow with configurable buffer times and automatic conflict detection.",
  },
];

const page = () => {
  return (
    <>
      {/* Dashboard preview */}
      <div
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "contain",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full flex items-center justify-center"
      >
        <div className="w-6xl max-w-full flex flex-col items-center justify-center gap-5 px-5 pt-52">
          <Badge title="Built for clinics, universities and professional service providers." />

          <h1 className="w-5xl max-w-full sm:text-6xl text-3xl text-center font-medium sm:leading-none leading-relaxed tracking-[-4%]">
            Turn Scheduling Chaos into Structured, Automated Workflows
          </h1>

          <p className="w-4xl max-w-full sm:text-xl text-lg text-center text-gray-500">
            Lekota helps service-driven organizations manage appointments,
            allocate resources intelligently, prevent conflicts and track
            performance &mdash; all in one unified platform.
          </p>

          <Link href="/dashboard/client/profile">
            <p className="sm:text-sm text-xs text-white bg-[#2D36E0] rounded-full p-4">
              Start free 10-day trial
            </p>
          </Link>

          <div className="w-full aspect-video relative rounded-4xl overflow-hidden mt-10">
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard preview"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              quality={100}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
          </div>
        </div>
      </div>

      {/* Trusted brands */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-5 px-5">
        <div className="w-full flex items-center justify-center gap-5">
          <div className="w-52 h-1 bg-gray-400 rounded-l-[75%] border-r-16 border-black" />
          <p className="w-3xs text-base sm:text-xl tracking-[-4%] text-center">
            Brands that has trusted us over the years
          </p>
          <div className="w-52 h-1 bg-gray-400 rounded-r-[75%] border-l-16 border-black" />
        </div>

        <div className="w-full flex items-center justify-center flex-wrap gap-14 sm:gap-20 mt-10">
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 32px, 40px"
                />
              </div>
              <p className="text-sm sm:text-lg">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problem statement */}
      <section
        id="statement"
        className="w-full flex flex-col items-center justify-center gap-5 py-20 px-5 scroll-mt-20"
      >
        <div className="w-xl max-w-full flex flex-col items-center justify-center gap-5">
          <Badge title="Problem Statement" />
          <h1 className="sm:text-5xl text-3xl text-center font-medium leading-none tracking-tighter">
            Scheduling Shouldn&apos;t Be This Complicated
          </h1>
          <p className="w-4xl max-w-full sm:text-xl text-lg text-center text-gray-500">
            Managing appointments across multiple staff, rooms, and services
            often leads to double bookings, idle time, and frustrated clients.
          </p>
        </div>

        <div className="w-6xl max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 px-4 mt-10">
          {problem_statements.map((statement, i) => {
            const Icon = statement.icon;

            return (
              <div
                key={i}
                className={`flex flex-col justify-between rounded-2xl p-5 min-h-48 ${i === 1 || i === 4 ? "bg-[#2D36E066]" : "bg-white border border-[#2D36E0]"} ${
                  i < 3 ? "lg:col-span-2" : "lg:col-span-3"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-fit rounded-xl p-4 text-[#2D36E0] ${i === 1 || i === 4 ? "" : "shadow"}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Text */}
                <p className="mt-4 text-sm sm:text-base md:text-lg">
                  {statement.statement}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Solution preview */}
      <div className="w-6xl max-w-full mx-auto flex flex-col lg:flex-row items-center gap-15 py-20 px-5">
        {/* LEFT: Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-6 text-center lg:text-start">
          <Badge title="Solution" />

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-medium leading-none tracking-[-4%]">
            A Smarter Way to Manage Appointments and Resources
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-500">
            LEKOTA replaces manual scheduling with an intelligent system that
            automatically assigns resources, enforces scheduling rules, and
            provides real-time visibility into your operations.
          </p>

          <div className="flex justify-center lg:justify-start lg:mt-24">
            <Link href="/dashboard">
              <p className="w-fit text-xs sm:text-sm text-white bg-[#2D36E0] rounded-full p-4">
                Start free 10-day trial
              </p>
            </Link>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-2xl overflow-hidden">
            <Image
              src="/solution-preview.png"
              alt="Solution preview"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              quality={100}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
      </div>

      {/* Appointment scheduling */}
      <section
        id="features"
        className="w-full flex flex-col items-center justify-center gap-15 py-20 px-5 scroll-mt-20"
      >
        <div className="w-6xl max-w-full flex flex-col items-center justify-center gap-5">
          <Badge title="Features" />

          <h1 className="w-full text-3xl sm:text-5xl font-medium leading-none text-center">
            {/* Top line */}
            <span className="block">Intelligent</span>

            {/* Bottom split */}
            <span className="flex items-center justify-center gap-0.5 lg:gap-2 flex-wrap">
              <span>Appointment</span>
              <span>Scheduling</span>
            </span>
          </h1>

          <p className="w-xl max-w-full sm:text-xl text-lg text-center text-gray-500">
            Allow clients and staff to book appointments seamlessly while the
            system checks availability and prevents conflicts in real time.
          </p>

          <div className="w-full aspect-video relative rounded-2xl overflow-hidden mt-15">
            <Image
              src="/features-preview.png"
              alt="Features preview"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              quality={100}
              priority
              sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 90vw,
           1200px"
            />
          </div>
        </div>
        <div className="w-6xl max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-10">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col gap-5">
              <div className="flex items gap-4 font-semibold">
                <p className="text-sm sm:text-base">{i + 1}</p>
                <h1 className="text-lg sm:text-xl">{feature.title}</h1>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="w-full flex flex-col items-center justify-center py-20 px-5 scroll-mt-20"
      >
        <div className="w-6xl max-w-full flex flex-col items-center justify-center gap-5">
          <Badge title="Pricing" />

          <h1 className="w-lg max-w-full text-3xl sm:text-5xl font-medium leading-none tracking-[-4%] text-center">
            Start Free. Upgrade When You&apos;re Ready.
          </h1>

          <p className="w-md max-w-full sm:text-xl text-lg text-center text-gray-500">
            Every organization gets full access to LEKOTA for 10 days. No
            payment required upfront.
          </p>

          <div className="w-full flex flex-col lg:flex-row gap-5 lg:items-stretch mt-10">
            <div className="w-full lg:w-4/12 relative rounded-2xl overflow-hidden min-h-100 lg:min-h-0">
              <Image
                src="/banner.png"
                alt="Banner"
                fill
                className="object-cover"
                quality={100}
                priority
              />
              <p className="absolute bottom-5 left-5 text-white text-base sm:text-lg font-medium pr-2">
                LEKOTA is a multi-tenant scheduling and resource allocation
                system
              </p>
            </div>

            <div className="w-full lg:w-8/12 flex flex-col gap-10 bg-black text-white rounded-2xl py-8 px-6">
              <div className="flex flex-col gap-5">
                <h1 className="text-lg">Lekota Premium</h1>

                <div className="flex items-baseline">
                  <p className="text-[48px] font-medium">N1,000</p>
                  <p className="text-[#ABABAB]">/Month</p>
                </div>

                <ul className="lg:w-2/3 w-full px-5 list-disc marker:text-[#2D36E0] space-y-5">
                  <li>Healthcare clinics with multiple practitioners</li>
                  <li>University advisory or service departments</li>
                  <li>
                    Independent practices experiencing increased booking demand
                  </li>
                  <li>Care facilities managing multiple service units</li>
                </ul>
              </div>

              <Link href="/dashboard">
                <p className="w-full text-xs sm:text-sm text-white text-center bg-[#2D36E0] rounded-full p-4">
                  Start free 10-day trial
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
