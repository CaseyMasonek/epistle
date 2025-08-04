"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { SessionProvider, signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MoveLeftIcon, UserCircle2, UserIcon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import parseMessage from "gmail-api-parse-message";
import ShadowHtml from "@/components/shadow-html";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Email } from "@/types/email";
import { useEmails } from "@/hooks/use-emails";
import { useEmailOperations } from "@/hooks/use-email-operations";
import { EmailList } from "@/components/email-list";
import { EmailDetail } from "@/components/email-detail";

export default () => (
  <SessionProvider>
    <HomePage />
  </SessionProvider>
);

function HomePage() {
  const { data: session, status } = useSession();
  const [selectedEmail, setSelectedEmail] = useState<Email>();
  const emailBox = useRef<HTMLDivElement>(null);
  const { emails } = useEmails();
  const { parsedMessageToEmail, addInlineAttachments } = useEmailOperations();

  // Authorization
  useEffect(() => {
    if (status == "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => console.log(emails), [emails]);

  async function handleSelectEmail(email: Email) {
    setSelectedEmail(email);
    emailBox.current!.scrollTo(0, 0);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-screen flex flex-row">
        <div className="w-full">
          <div className="">
            <Header />
            <Card className="m-5 gap-y-0 h-max">
              <CardTitle className="ml-9">
                {selectedEmail ? (
                  <div
                    className="text-2xl"
                    onClick={() => setSelectedEmail(undefined)}
                  >
                    <MoveLeftIcon />
                  </div>
                ) : (
                  <h3 className="text-3xl mb-2">Inbox</h3>
                )}
              </CardTitle>
              <CardContent
                className="overflow-y-auto max-h-[80vh] h-screen"
                ref={emailBox}
              >
                {!selectedEmail ? (
                  <EmailList emails={emails} onSelectEmail={handleSelectEmail} />
                ) : (
                  <EmailDetail selectedEmail={selectedEmail} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
