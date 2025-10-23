import { ContactFormData } from "@/lib/validations/contact";

export function generateContactEmailHtml(data: ContactFormData): string {
  const trimmedCompanyName = (data.companyName ?? "").trim();
  const companyNameDisplay =
    trimmedCompanyName.length > 0 ? trimmedCompanyName : "（未入力）";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせを受け付けました</title>
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; padding: 40px; border-radius: 8px;">
      <h1 style="font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; margin-top: 0;">
        お問い合わせを受け付けました
      </h1>

      <div style="margin-bottom: 30px;">
        <p style="margin-bottom: 10px; line-height: 1.6;">
          以下の内容でお問い合わせを受け付けました：
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">
                お名前
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${escapeHtml(data.name)}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">
                法人名・団体名
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${escapeHtml(companyNameDisplay)}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">
                電話番号
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${escapeHtml(data.phone)}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">
                メールアドレス
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${escapeHtml(data.email)}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">
                お問い合わせ内容
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; white-space: pre-wrap;">
                ${escapeHtml(data.message)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          このメールは自動送信されています。
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
