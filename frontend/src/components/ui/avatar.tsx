import Image from "next/image";

type AvatarProps = {
  image: string;
  name: string;
  className?: string;
};

const Avatar = ({ image, name, className }: AvatarProps) => {
  return (
    <div
      className={`relative w-8 aspect-square rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
    >
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <span className="text-xs font-semibold text-gray-700">
          {name?.charAt(0)?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
};

export default Avatar;
