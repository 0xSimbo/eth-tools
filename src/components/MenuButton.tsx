import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { sections } from "./SidebarContainer";
import { PiGithubLogo, PiTwitterLogo } from "react-icons/pi";
export const MenuButton = () => {
  return (
    <div className="fixed sm:hidden top-0 left-0 w-screen ">
      <div className="bg-white border-b flex items-center justify-between px-4 py-2">
        <div>
          <Link className="flex items-center gap-2 font-semibold" href="">
            <img className="h-8 w-8 rounded-full" src="/cat.jpg" />
            <span className=" text-sm">0xSimon Tools</span>
          </Link>
        </div>
        <div>
          <Sheet>
            <SheetTrigger>
              <Button>Menu</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  This will redirect you to the your desired page.
                </SheetDescription>
              </SheetHeader>
              {
                <nav className="grid items-start px-4 text-sm font-medium mt-8 gap-y-4">
                  {sections.map((section) => (
                    <Link
                      className="flex items-center border gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href={section.href}
                    >
                      <section.icon className="h-4 w-4" />
                      {section.title}
                    </Link>
                  ))}
                </nav>
              }
              <div className="grow  h-full w-full">
                <div className="flex justify-center h-full items-end gap-2 p-4">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
