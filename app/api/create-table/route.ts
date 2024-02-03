import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await sql`DROP TABLE IF EXISTS users;`;
    const user = await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      movies INT[]
  );
      `;

    await sql`DROP TABLE IF EXISTS movies;`;
    const movies = await sql`CREATE TABLE IF NOT EXISTS movies (
      movieID INT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      releaseYear INT,
      genre VARCHAR(50),
      director VARCHAR(100),
      rating FLOAT
  );
        `;

    return NextResponse.json({ user, movies }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
