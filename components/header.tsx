import { BoxIcon, MailIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { Input } from "./ui/input";
import { SidebarProvider, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Header() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <div className="mb-3 w-full">
      <div className="p-5 h-15 flex items-center w-full">
        <BoxIcon className="mr-5" onClick={toggleSidebar} />
        <Input className="mr-5" placeholder="Search" />
        <Button className="float-right" onClick={() => signOut()}>
          Log out
        </Button>
      </div>
      <Separator />
    </div>
  );
}
