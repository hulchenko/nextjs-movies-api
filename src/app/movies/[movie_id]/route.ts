import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import movies from "@/data/movies.json";
import { Movie } from "../../../interfaces/Movie";

const dirname = path.resolve();
const pathToMovies = path.join(dirname, "src/data/movies.json");

async function GET(request: NextRequest, { params }: { params: Promise<{ movie_id: string }> }): Promise<NextResponse> {
  const { movie_id } = await params;

  const movie: Movie | null = movies.find((m) => m.id === Number(movie_id)) || null;

  if (!movie) {
    return NextResponse.json({ error: "Movie was not found!" }, { status: 404 });
  }
  return NextResponse.json({ data: movie }, { status: 200 });
}

async function DELETE(request: NextRequest, { params }: { params: Promise<{ movie_id: string }> }): Promise<NextResponse> {
  try {
    const { movie_id } = await params;

    const existingIdx = movies.findIndex((m) => m.id === Number(movie_id));

    if (existingIdx === -1) {
      return NextResponse.json({ error: `Movie with id: ${movie_id} does not exist.` }, { status: 404 });
    }
    const updatedMovies = movies.filter((m) => m.id != Number(movie_id));
    await fs.promises.writeFile(pathToMovies, JSON.stringify(updatedMovies), "utf-8");
    return NextResponse.json({ data: updatedMovies }, { status: 200 });
  } catch (err) {
    console.log("ERROR: ", err);
    return NextResponse.json({ error: "Error writing to a file" }, { status: 500 });
  }
}

async function PUT(request: NextRequest, { params }: { params: Promise<{ movie_id: string }> }): Promise<NextResponse> {
  try {
    const { movie_id } = await params;
    const body = await request.json();
    const { watched } = body;

    const existingIdx = movies.findIndex((m) => m.id === Number(movie_id));
    if (existingIdx === -1) {
      return NextResponse.json({ error: `Movie with id ${movie_id} doesn't exist.` }, { status: 400 });
    }

    movies[existingIdx] = {
      ...movies[existingIdx],
      watched,
    };
    await fs.promises.writeFile(pathToMovies, JSON.stringify(movies), "utf-8");
    return NextResponse.json({ data: movies }, { status: 201 });
  } catch (err) {
    console.log("ERROR: ", err);
    return NextResponse.json({ error: "Error writing to a file." }, { status: 500 });
  }
}

export { GET, DELETE, PUT };
