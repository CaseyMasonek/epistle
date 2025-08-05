"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import { MoveLeftIcon } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Email } from "@/types/email";
import { useEmails } from "@/hooks/use-emails";
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
  const { emails, setEmails, setQuery, query } = useEmails();

  useEffect(() => {
    if (status == "unauthenticated") redirect("/login");
  }, [status]);

  async function handleSelectEmail(email: Email) {
    setSelectedEmail(email);
    emailBox.current!.scrollTo(0, 0);
  }

  function handleLeaveEmail() {
    setSelectedEmail(undefined)
    setQuery(query)
  }

  return (
    <SidebarProvider>
      <AppSidebar setQuery={setQuery} />
      <div className="w-full h-screen flex flex-row">
        <div className="w-full">
          <div className="">
            <Header setQuery={setQuery} />
            <Card className="m-5 gap-y-0 h-max">
              <CardTitle className="ml-9">
                {selectedEmail ? (
                  <div
                    className="text-2xl"
                    onClick={handleLeaveEmail}
                  >
                    <MoveLeftIcon />
                  </div>
                ) : (
                  <h3 className="text-3xl mb-2">Inbox</h3>
                )}
              </CardTitle>
              <CardContent
                className="overflow-y-auto overflow-x-auto max-h-[80vh] h-screen"
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
