import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Welcome to the movies API, created with NextJS!",
    usage: "/movies for GET, POST; /{movie_id} for GET, DELETE, PUT; /movies?watched={boolean} for GET",
  });
}
