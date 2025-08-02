import { MailIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { Input } from "./ui/input";

export default function Header() {
  return (
    <div className="mb-3 w-full">
      <div className="p-5 h-15 flex items-center w-full">
        <Input className="mr-2" placeholder="Search" />
        <Button className="float-right" onClick={() => signOut()}>
          Log out
        </Button>
      </div>
      <Separator />
    </div>
  );
}
