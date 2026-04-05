import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center flex-wrap gap-16">
        <div className="flex justify-center max-w-full">
          <div className="relative w-100 max-w-full h-152 bg-black">
            <Image
              src="/banner.png"
              alt="Banner"
              fill
              className="object-cover"
            />
            <p className="absolute bottom-5 left-5 text-white text-lg sm:text-2xl font-medium pr-2">
              LEKOTA is a multi-tenant scheduling and resource allocation system
            </p>
          </div>
        </div>
        <div className="flex justify-center w-md max-w-full">{children}</div>
      </div>
    </div>
  );
}
