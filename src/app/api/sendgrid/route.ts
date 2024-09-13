import { NextResponse } from "next/server";
import sendGrid from "@sendgrid/mail";

sendGrid.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "https://rielj.xyz",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  const { name, from, subject, text } = await req.json();

  if (!name || !from || !subject || !text) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await sendGrid.send({
      to: "bulaybulay.rielj@gmail.com",
      from: "bulaybulay.rielj@gmail.com",
      subject: `[Lead from website] : ${subject}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
<head>
<meta charset="utf-8">

<title>The HTML5 Herald</title>
<meta name="description" content="The HTML5 Herald">
<meta name="author" content="SitePoint">
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />

<link rel="stylesheet" href="css/styles.css?v=1.0">

</head>

<body>
<div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">
<div class="container" style="margin-left: 20px;margin-right: 20px;">
<h3>You've got a new mail from ${name}, their email is: ✉️${from} </h3>
<div style="font-size: 16px;">
<p>Message:</p>
<p>${text}</p>
<br>
</div>
</div>
</div>
</body>
</html>`,
    });
    return NextResponse.json(
      { message: "Email sent" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://rielj.xyz",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "https://rielj.xyz",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}
