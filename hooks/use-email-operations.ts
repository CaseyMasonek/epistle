import { useSession } from "next-auth/react";
import parseMessage from "gmail-api-parse-message";
import { Email } from "@/types/email";

export function useEmailOperations() {
  const { data: session } = useSession();

  async function parsedMessageToEmail(parsed: any) {
    if (!session?.accessToken) return;

    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/json",
    };

    const threadId = parsed.threadId;

    const threadRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`,
      { headers }
    );
    const thread = await threadRes.json();

    const email: Email = {
      id: parsed.id,
      snippet: parsed.snippet,
      headers: parsed.headers,
      textPlain: parsed.textPlain,
      textHtml: parsed.textHtml,
      attachments: parsed.attachments,
      inline: parsed.inline,
      threadId: threadId,
      threadMembers: thread.messages,
      labelIds: parsed.labelIds,
    };

    return email;
  }

  async function addInlineAttachments(email: Email) {
    const attachmentDataArray = await Promise.all(
      email.attachments.map((e) => getAttachmentData(e.attachmentId, email)!)
    );

    const cidMap = Object.fromEntries(
      attachmentDataArray.filter((a) => a.cid).map(({ cid, url }) => [cid, url])
    );

    const replacedHtml = email.textHtml.replace(
      /cid:([^">]+)/g,
      (match, cid) => {
        return cidMap[cid] ?? match;
      }
    );

    let newEmail = email;
    newEmail.textHtml = replacedHtml;

    return newEmail;
  }

  async function getAttachmentData(id: string, email: Email) {
    if (!email) return { url: "", cid: "" };

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

    return { url: "", cid: "" };
  }

  async function getThread(email: Email) {
    const threadResults = await Promise.all(
      email.threadMembers.map(async (t) => {

        const parsed = parsedMessageToEmail(parseMessage(t));

        if (email.attachments) {
          return addInlineAttachments((await parsed)!);
        }

        return parsed;
      })
    );

    const threads = threadResults.filter((t): t is Email => t !== null);

    return threads;
  }

  return {
    parsedMessageToEmail,
    addInlineAttachments,
    getAttachmentData,
    getThread,
  };
}
