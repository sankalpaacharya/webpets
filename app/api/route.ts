import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "config", "readme.json");
const GENERATED_DIR = path.join(process.cwd(), "public", "generated");

type Config = {
  animal: string;
  variant: string;
  action: string;
};

const DEFAULT_CONFIG: Config = {
  animal: "fox",
  variant: "red",
  action: "walk",
};

const tokenRegex = /^[a-z0-9-]+$/i;
const actionRegex = /^[a-z0-9-_]+$/i;

function isValidToken(value: string, regex: RegExp) {
  return regex.test(value);
}

function getConfig(): Config {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Config>;
    if (!parsed?.animal || !parsed.variant || !parsed.action) {
      return DEFAULT_CONFIG;
    }
    return {
      animal: parsed.animal,
      variant: parsed.variant,
      action: parsed.action,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function setConfig(config: Config) {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getGifPath(config: Config) {
  const fileName = `${config.variant}_${config.action}_8fps.gif`;
  return path.join(GENERATED_DIR, config.animal, fileName);
}

export async function GET(req: NextRequest) {
  try {
    const config = getConfig();
    const wantsConfig = req.nextUrl.searchParams.get("config") === "1";

    if (wantsConfig) {
      return NextResponse.json({ config });
    }

    const filePath = getGifPath(config);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { animal, variant, action } = body ?? {};

    if (!animal || !variant || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!isValidToken(animal, tokenRegex)) {
      return NextResponse.json({ error: "Invalid animal" }, { status: 400 });
    }

    if (!isValidToken(variant, tokenRegex)) {
      return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
    }

    if (!isValidToken(action, actionRegex)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const newConfig: Config = { animal, variant, action };

    const filePath = getGifPath(newConfig);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Selected GIF does not exist" },
        { status: 400 },
      );
    }

    setConfig(newConfig);

    return NextResponse.json({ success: true, config: newConfig });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}