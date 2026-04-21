import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const CONFIG_PATH = path.join(process.cwd(), "config", "readme.json")
const GENERATED_DIR = path.join(process.cwd(), "generated")

type Config = {
  animal: string
  variant: string
  action: "walk" | "run"
}

function getConfig(): Config {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8")
  return JSON.parse(raw)
}

function setConfig(config: Config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

function getGifPath(config: Config) {
  const fileName = `${config.variant}_${config.action}_8fps.gif`
  return path.join(GENERATED_DIR, config.animal, fileName)
}


export async function GET() {
  try {
    const config = getConfig()
    const filePath = getGifPath(config)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store"
      }
    })
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { animal, variant, action } = body

    // 🧠 basic validation
    if (!animal || !variant || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    if (!["walk", "run"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const newConfig: Config = { animal, variant, action }

    // 🧠 verify file actually exists before saving
    const filePath = getGifPath(newConfig)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Selected GIF does not exist" },
        { status: 400 }
      )
    }

    setConfig(newConfig)

    return NextResponse.json({ success: true, config: newConfig })
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}