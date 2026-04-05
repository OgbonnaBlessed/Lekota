import Link from "next/link";
import { Button } from "../ui/button";
import Input from "../ui/input";

type AuthFormField = {
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  secured?: boolean;
};

type AuthFormProps = {
  header: string;
  subheader?: string | React.ReactNode;
  fields: AuthFormField[];
  nav?: string;
  buttontitle: string;
  onclick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  footer?: React.ReactNode;
};

const AuthForm = ({
  header,
  subheader,
  fields,
  nav,
  buttontitle,
  onclick,
  footer,
}: AuthFormProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-medium mb-2">{header}</h2>
      <div className="text-[#ABABAB] text-lg sm:text-xl">{subheader}</div>
      <div className="w-full flex flex-col gap-5 mt-5">
        {fields.map((field) => (
          <Input key={field.name} {...field} />
        ))}
      </div>
      <div className="flex justify-end text-sm text-[#2D36E0] py-2">
        <Link href="/forgot-password">{nav}</Link>
      </div>
      <Button
        onClick={onclick}
        disabled={fields.some((field) => !field.value)}
        className="w-full text-base py-6! mt-5 cursor-pointer bg-[#2D36E0] disabled:bg-[#2D36E066]"
      >
        {buttontitle}
      </Button>
      <div className="flex items-center justify-center mt-5">{footer}</div>
    </div>
  );
};

export default AuthForm;
