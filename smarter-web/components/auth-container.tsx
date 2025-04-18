import Image from "next/image";
import { images } from "@/constants/images";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen flex-col items-center justify-center">
      {/* <div className="top-3 left-3 absolute flex items-center space-x-2">
        <Image
          src={images.circleLogo}
          alt="Smarter Logo"
          width={32}
          height={32}
        />
        <p className="text-primary/90 font-bold text-xl">Smarter</p>
      </div> */}
      <div className="flex h-full items-center p-4 lg:p-8">{children}</div>
    </div>
  );
}
