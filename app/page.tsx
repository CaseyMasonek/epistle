"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SessionProvider, signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { use, useEffect, useState } from "react";
import Header from "@/components/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MoveLeftIcon } from "lucide-react";

export default () => (
  <SessionProvider>
    <HomePage />
  </SessionProvider>
);

type Email = {
  id: string;
  snippet: string;
  labelIds: string[];
  headers: { name: string; value: string }[];
};

function HomePage() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email>();

  // Authorization
  useEffect(() => {
    if (status == "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchEmails = async () => {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/json",
      };

      const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
        { headers }
      );
      const list = await res.json();
      const messages = list.messages || [];

      const detailedEmails = await Promise.all(
        messages.map(async ({ id }: { id: string }) => {
          console.log("Fetching data for", id);

          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
            { headers }
          );
          const detail = await detailRes.json();

          console.log(detail);

          return {
            id: detail.id,
            snippet: detail.snippet,
            headers: detail.payload.headers,
          };
        })
      );

      setEmails(detailedEmails);

      console.log(detailedEmails);
    };

    fetchEmails();
  }, [session?.accessToken]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-screen flex flex-row"
    >
      <ResizablePanel defaultSize={10}>
        <div className="w-full flex flex-col m-3 gap-y-4">
          <h1 className="text-4xl mb-3">Epistle</h1>
          <Button className="w-[90%]" variant={'outline'}>All Mail</Button>
          <Button className="w-[90%]" variant={'outline'}>Primary</Button>
          <Button className="w-[90%]" variant={'outline'}>Junk</Button>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="w-full">
        <div>
          <Header />
          <Card className="m-5 gap-y-0 h-max">
            <CardTitle className="ml-9">
              {selectedEmail ? (
                <div className="text-2xl" onClick={() => setSelectedEmail(undefined)}>
                  <MoveLeftIcon />
                </div>
              ) : (
                <h3 className="text-3xl mb-2">Inbox</h3>
              )}
            </CardTitle>
            <CardContent className="overflow-y-auto max-h-[80vh] h-screen">
              {!selectedEmail ? (
                emails.map((email, i) => (
                  <>
                    <div
                      key={email.id}
                      className="gap-y-0.5 pl-3 hover:bg-zinc-800 h-fit p-3 rounded-md"
                      onClick={() => setSelectedEmail(email)}
                    >
                      <h4 className="text-sm leading-none font-medium">
                        {email.headers.find((h) => h.name == "Subject")
                          ?.value ?? "(No subject)"}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {email.headers.find((h) => h.name == "From")?.value ??
                          "(No subject)"}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {email.snippet}
                        {email.snippet.length >= 198 && <>...</>}
                      </p>
                    </div>
                    {i != emails.length - 1 && (
                      <Separator className="max-w-99/100 justify-self-center" />
                    )}
                  </>
                ))
              ) : (
                <div className="m-3">
                  <h1 className="text-3xl">
                    {selectedEmail.headers.find((h) => h.name == "Subject")
                      ?.value ?? "(No subject)"}
                  </h1>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
