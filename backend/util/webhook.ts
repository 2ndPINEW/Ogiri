export const sendSlack = async ({
  message,
  username,
  url,
}: {
  message: string;
  username?: string;
  url: string;
}) => {
  const payload = {
    text: message,
    username,
    unfurl_links: false,
  };
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    throw new Error(`Slack webhook failed: ${resp.statusText}`);
  }
};
