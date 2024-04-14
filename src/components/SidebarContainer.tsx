import Link from "next/link";
import { SVGProps } from "react";
import { PiGithubLogo, PiTwitterLogo } from "react-icons/pi";
import { Button } from "./ui/button";
import { MenuButton } from "./MenuButton";

type SidebarContainerProps = {
  children: React.ReactNode;
};

export const sections = [
  {
    title: "EIP712 Code Gen",
    href: "/eip712",
    icon: PackageIcon,
  },
  {
    title: "Gas Prices",
    href: "/gas-prices",
    icon: PackageIcon,
  },
  {
    title: "Jesper Error Checker",
    href: "/jesper-error-checker",
    icon: PackageIcon,
  },
];
export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  children,
}) => {
  return (
    <div className=" min-h-screen w-full flex">
      <div className="sm:flex hidden border-r border-gray-200 bg-gray-100/40 dark:border-gray-800  flex-col dark:bg-gray-800/40">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link className="flex items-center gap-2 font-semibold" href="">
              <img className="h-12 w-12 rounded-full" src="/cat.jpg" />
              <span className="">0xSimon Tools</span>
            </Link>
          </div>
          <nav className="grid items-start px-4 text-sm font-medium">
            {sections.map((section) => (
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href={section.href}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="grow flex  flex-col h-max justify-end">
          <a
            href="https://github.com/0xSimbo/eth-tools/issues/new"
            target="_blank"
            className="flex items-center gap-2 px-6 py-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          >
            <Button variant={"secondary"} className=" w-[80%] mx-auto">
              Report A Bug
            </Button>
          </a>
          <a
            href="https://github.com/0xSimbo/eth-tools/issues/new"
            target="_blank"
            className="flex items-center gap-2 px-6 py-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          >
            <Button className=" w-[80%] mx-auto">Request A Feature</Button>
          </a>

          <div className="flex justify-center gap-2 p-4">
            <a
              href="https://github.com/0xSimbo/eth-tools"
              target="_blank"
              className="flex items-center gap-2 px-6 py-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
            >
              <PiGithubLogo className="h-10 w-10 text-white p-2 bg-black rounded-full" />
            </a>

            <a
              href="https://x.com/0xSimon"
              target="_blank"
              className="flex items-center gap-2 px-6 py-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
            >
              <PiTwitterLogo className="h-10 w-10 text-white p-2 bg-black rounded-full" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-[4%] sm:mx-0 mt-12 sm:mt-0   w-full">
        <MenuButton />
        {children}
      </div>
    </div>
  );
};

function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function CreditCardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function DollarSignIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LineChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function Package2Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function ShoppingCartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
