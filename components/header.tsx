import { BoxIcon, MailIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { Input } from "./ui/input";
import { useSidebar } from "./ui/sidebar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Email } from "@/types/email";
import {useDebouncedCallback} from 'use-debounce'
import { useEmails } from "@/hooks/use-emails";
import { useEffect } from "react";

export default function Header({setQuery}:{setQuery:(q:string) => void}) {
  const { toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const isMobile = useIsMobile()

  const search = useDebouncedCallback((q:string)=>{
    console.log(q)
    setQuery(q)
  },300)

  return (
    <div className="mb-3 w-full">
      <div className="p-5 h-15 flex items-center w-full">
        <MenuIcon className="mr-5" onClick={toggleSidebar} size={isMobile ? 48 : 32} />
        <Input placeholder="Search" onChange={(e) => search(e.currentTarget.value)} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="mx-2">
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="float-right" onClick={() => signOut()}>
          Log out
        </Button>
      </div>
      <Separator />
    </div>
  );
}
