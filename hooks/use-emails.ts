import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import parseMessage from "gmail-api-parse-message";
import { Email } from "@/types/email";

export function useEmails(pageToken?:string) {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [query,setQuery] = useState<String>()
  const [nextPageToken,setNextPageToken] = useState<string>()

  useEffect(() => {
    if (!session?.accessToken) return;

    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/json",
    };

    const fetchEmails = async () => {
      const pageTokenQuery = pageToken ? '&pageToken='+pageToken : ""
      const queryQuery = query ? '&q='+query : ""

      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20`+queryQuery+pageTokenQuery,
        { headers }
      );
      const list = await res.json();
      const messages = list.messages || [];
      setNextPageToken(list.nextPageToken)

      const detailedEmails = await Promise.all(
        messages.map(async ({ id }: { id: string }): Promise<Email | []> => {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
            { headers }
          );
          let detail = await detailRes.json();
          const parsed = parseMessage(detail);

          const threadId = parsed.threadId;

          const threadRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`,
            { headers }
          );
          const thread = await threadRes.json();

          const newestMessageId = thread.messages.find(
            (t: any) => t.historyId == thread.historyId
          ).id;

          if (parsed.id != newestMessageId) {
            return [];
          }

          detail = parseMessage(thread.messages.find((t:any) => t.id == newestMessageId))

          const email: Email = {
            id: detail.id,
            snippet: detail.snippet,
            headers: parsed.headers,
            textPlain: parsed.textPlain,
            textHtml: parsed.textHtml,
            attachments: parsed.attachments,
            inline: parsed.inline,
            threadMembers: thread.messages.reverse(),
            labelIds: parsed.labelIds,
            threadId: threadId,
          };

          return email;
        })
      );

      setEmails(detailedEmails.flat());
    };

    fetchEmails();
  }, [session?.accessToken,query]);

  return { emails, status, nextPageToken, setQuery, setEmails, query };
} 