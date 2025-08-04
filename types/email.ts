
export type Email = {
  id: string;
  snippet: string;
  labelIds: string[];
  headers: { from: string; to: string; date: string; subject: string };
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
  threadMembers: Email[];
  threadId: string;
}; 