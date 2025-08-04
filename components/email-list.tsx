import { Separator } from "@/components/ui/separator";
import { useEmails } from "@/hooks/use-emails";
import { cleanSpaces, decodeHtml, formatDate } from "@/lib/utils";
import { Email } from "@/types/email";
import clsx from "clsx";

interface EmailListProps {
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ onSelectEmail }: EmailListProps) {
  const {emails} = useEmails()

  return (
    <>
      {emails.map((email, i) => (
        <>
          <div
            key={email.id}
            className={clsx(
              "gap-y-0.5 pl-3 hover:shadow-lg h-fit p-3 rounded-md relative",
              !email.labelIds.includes("UNREAD") && "bg-accent"
            )}
            onClick={() => onSelectEmail(email)}
          >
            <h4 className="text-sm leading-none font-medium">
              {email.headers.subject ?? "(No subject)"}
              <span className="text-muted-foreground text-sm">
                &nbsp;
                {email.threadMembers.length != 1
                  ? email.threadMembers.length
                  : null}
              </span>
            </h4>
            <p className="absolute right-2 text-muted-foreground text-sm top-2">
              {formatDate(email.headers.date)}
            </p>
            <p className="text-muted-foreground text-sm">
              {email.headers.from}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              {(decodeHtml(email.snippet))}
            </p>
          </div>
          {i != emails.length - 1 && (
            <Separator className="max-w-99/100 justify-self-center" />
          )}
        </>
      ))}
    </>
  );
} 