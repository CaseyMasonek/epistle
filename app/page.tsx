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
import { use, useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MoveLeftIcon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import parseMessage from "gmail-api-parse-message";
import ShadowHtml from "@/components/shadow-html";
import Image from "next/image";

export default () => (
  <SessionProvider>
    <HomePage />
  </SessionProvider>
);

export type Email = {
  id: string;
  snippet: string;
  labelIds: string[];
  headers: { name: string; value: string }[];
  body: { body: { data: string }; mimeType: string }[];
  textPlain: string;
  textHtml: string;
  attachments: {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
    headers: { "content-id": string };
  }[];
  inline: {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
  }[];
};

function formatDate(str: string) {
  const date = new Date(str);

  let hours = date.getHours();
  let amPm = date.getHours() >= 12 ? "PM" : "AM";

  if (amPm == "PM" && date.getHours() > 12) {
    hours = hours - 12;
  }

  if (hours == 0) {
    hours = 12;
  }

  return `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}, ${hours}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${amPm}`;
}

function HomePage() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email>();
  const emailBox = useRef<HTMLDivElement>(null)

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
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20",
        { headers }
      );
      const list = await res.json();
      const messages = list.messages || [];

      const detailedEmails = await Promise.all(
        messages.map(async ({ id }: { id: string }) => {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
            { headers }
          );
          const detail = await detailRes.json();
          const parsed = parseMessage(detail);

          console.log(detail, parsed);

          return {
            id: detail.id,
            snippet: detail.snippet,
            headers: detail.payload.headers,
            body: detail.payload.parts,
            textPlain: parsed.textPlain,
            textHtml: parsed.textHtml,
            attachments: parsed.attachments,
            inline: parsed.inline,
          };
        })
      );

      setEmails(detailedEmails);

      console.log(detailedEmails);
    };

    fetchEmails();
  }, [session?.accessToken]);

  async function handleSelectEmail(email: Email) {
    if (!email.attachments) {
      setSelectedEmail(email)
      emailBox.current!.scrollTo(0,0)
      return
    }

    const attachmentDataArray = await Promise.all(
      email.attachments.map(e => getAttachmentData(e.attachmentId,email)!)
    )

    // Build cid → dataUrl map
    const cidMap = Object.fromEntries(
      attachmentDataArray
        .filter((a) => a.cid)
        .map(({ cid, url }) => [cid, url])
    );

    // Replace cid links in the email HTML
    const replacedHtml = email.textHtml.replace(
      /cid:([^">]+)/g,
      (match, cid) => {
        return cidMap[cid] ?? match;
      }
    );

    let newEmail = email

    newEmail.textHtml = replacedHtml

    setSelectedEmail(newEmail);
  }

  async function getAttachmentData(id: string, email: Email) {
    if (!email) return {url:'',cid:''};

    const headers = {
      //@ts-ignore
      Authorization: `Bearer ${session!.accessToken}`,
      Accept: "application/json",
    };

    if (email.attachments) {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${email.id}/attachments/${id}`,
        { headers }
      );

      const attachment: string = (await res.json()).data!;

      const base64 = attachment.replaceAll("-", "+").replaceAll("_", "/");

      const dataUrl = `data:${email.attachments[0].mimeType};base64,${base64}`;

      return {
        url: dataUrl,
        cid: email.attachments
          .find((a) => a.attachmentId == id)!
          .headers["content-id"]?.replace(/[<>]/g, ""),
      };
    }

    return {url:'',cid:''}
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
              <CardContent className="overflow-y-auto max-h-[80vh] h-screen" ref={emailBox}>
                {!selectedEmail ? (
                  emails.map((email, i) => (
                    <>
                      <div
                        key={email.id}
                        className="gap-y-0.5 pl-3 hover:bg-accent h-fit p-3 rounded-md relative"
                        onClick={() => handleSelectEmail(email)}
                      >
                        <h4 className="text-sm leading-none font-medium">
                          {email.headers.find((h) => h.name == "Subject")
                            ?.value ?? "(No subject)"}
                        </h4>
                        <p className="absolute right-2 text-muted-foreground text-sm top-2">
                          {formatDate(
                            email.headers.find((h) => h.name == "Date")!.value
                          )}
                        </p>
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
                    <Separator className="my-4" />
                    <ShadowHtml html={selectedEmail.textHtml} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
