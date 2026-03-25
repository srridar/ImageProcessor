import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const bgColor = (formData.get("bgColor") as string) || "white";
    const photoCount = Number(formData.get("photoCount")) || 4;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // ✅ REMOVE BG (CORRECT WAY)
    let noBgBuffer: Buffer;

    try {
      const form = new FormData();
      form.append("image_file", inputBuffer, {
        filename: "image.png",
      });

      const rbResponse = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
          },
          responseType: "arraybuffer",
        }
      );

      noBgBuffer = Buffer.from(rbResponse.data);
    } catch (err: any) {
      console.error("Remove.bg failed, using original image");
      noBgBuffer = inputBuffer; // fallback (IMPORTANT)
    }

    // ✅ CREATE PASSPORT PHOTO
    const bg = bgColor === "blue" ? "#0047AB" : "#FFFFFF";

    const singlePhoto = await sharp(noBgBuffer)
      .resize(600, 600, {
        fit: "cover",
        position: "attention", // 🔥 auto-focus on face/body
      })
      .flatten({ background: bg })
      .jpeg({ quality: 95 })
      .toBuffer();

    // ✅ GRID CALCULATION
    const cols = photoCount === 1 ? 1 : photoCount <= 4 ? 2 : photoCount === 6 ? 3 : 4;
    const rows = Math.ceil(photoCount / cols);

    const size = 600;
    const gap = 20;
    const padding = 40;

    const width = cols * size + (cols - 1) * gap + padding * 2;
    const height = rows * size + (rows - 1) * gap + padding * 2;

    const composites = [];

    for (let i = 0; i < photoCount; i++) {
      const x = i % cols;
      const y = Math.floor(i / cols);

      composites.push({
        input: singlePhoto,
        left: padding + x * (size + gap),
        top: padding + y * (size + gap),
      });
    }

    const finalImage = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: "#edf2f7",
      },
    })
      .composite(composites)
      .jpeg({ quality: 95 })
      .toBuffer();


    return new NextResponse(finalImage, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}