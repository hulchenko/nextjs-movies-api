import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
import movies from "@/data/movies.json";

const dirname = path.resolve();
const pathToMovies = path.join(dirname, "src/data/movies.json");

async function GET(request: NextRequest): Promise<NextResponse> {
  // get query params
  const searchParams = request.nextUrl.searchParams;
  const watched = searchParams.get("watched");

  if (watched !== null) {
    const isWatched = watched.toLowerCase() === "true";
    const filteredMovies = movies.filter((m) => m.watched === isWatched);
    return NextResponse.json({ data: filteredMovies }, { status: 200 });
  }

  return NextResponse.json({ data: movies }, { status: 200 });
}

async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, watched } = body;

    const existingIdx = movies.findIndex((m) => m.name === name);
    if (existingIdx !== -1) {
      return NextResponse.json({ error: `Movie ${name} is already in the list.` }, { status: 400 });
    }
    const newMovie = {
      id: Date.now(),
      name,
      watched,
    };
    movies.push(newMovie);
    await fs.promises.writeFile(pathToMovies, JSON.stringify(movies), "utf-8");
    return NextResponse.json({ data: movies }, { status: 201 });
  } catch (err) {
    console.log("ERROR: ", err);
    return NextResponse.json({ error: "Error writing to a file." }, { status: 500 });
  }
}

export { GET, POST };
