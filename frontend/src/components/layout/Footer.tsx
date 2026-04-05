import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-14 pt-20 px-5">
      <div className="w-lg max-w-full flex flex-col items-center justify-center gap-5">
        <h1 className="sm:text-5xl text-3xl text-center font-medium leading-none tracking-[-4%]">
          Take Control of Your Scheduling Today
        </h1>

        <p className="w-full sm:text-xl text-lg text-center text-gray-500">
          Streamline your operations, eliminate conflicts, and manage
          appointments with confidence using LEKOTA.
        </p>

        <Link href="/dashboard">
          <p className="sm:text-sm text-xs text-white bg-[#2D36E0] rounded-full p-4">
            Start free 10-day trial
          </p>
        </Link>
      </div>

      <div className="relative w-5xl max-w-full flex items-center py-5 sm:py-16 mt-10 overflow-hidden">
        {/* Background Text */}
        <p className="absolute inset-0 flex items-center justify-center text-[80px] sm:text-[200px] md:text-[220px] lg:text-[275px] font-bold tracking-widest bg-linear-to-b from-[#2D36E0] via-[#6C63FF] to-white bg-clip-text text-transparent opacity-50 pointer-events-none select-none">
          Lekota
        </p>

        {/* Foreground Content */}
        <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          <p>© 2025 Lekota. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal">Privacy Policy</Link>
            <Link href="/legal">Terms and conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
