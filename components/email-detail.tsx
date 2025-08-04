import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { UserCircle2 } from "lucide-react";
import ShadowHtml from "@/components/shadow-html";
import { Email } from "@/types/email";
import { useEmailOperations } from "@/hooks/use-email-operations";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface EmailDetailProps {
  selectedEmail: Email;
}

export function EmailDetail({ selectedEmail }: EmailDetailProps) {
  const { getThread } = useEmailOperations();
  const [thread,setThread] = useState<Email[]>([])

  useEffect(() => {
    (async () => {
      const threads = await getThread(selectedEmail)
      setThread(threads)
    })()
  })

  return (
    <div>
      <div className="m-3">
        <h1 className="text-3xl">
          {selectedEmail.headers.subject ?? "(No subject)"}
        </h1>
      </div>
      {thread.flatMap((email) => {
        if (!email?.headers) return []

        return (
          <div className="m-3 relative">
            <Separator className="my-4" />
            <p className="text-muted-foreground text-sm float-right">
              {formatDate(email?.headers.date)}
            </p>
            <span className="flex gap-x-2">
              <Avatar className="">
                <AvatarFallback>
                  <UserCircle2 />
                </AvatarFallback>
              </Avatar>
              {email.headers.from}
            </span>
            <p className="text-muted-foreground text-xs mb-2">
              To: {email.headers.to}
            </p>

            <ShadowHtml html={email.textHtml} />
          </div>
        );
      })}
    </div>
  );
} 