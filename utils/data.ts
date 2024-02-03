"use server";

import { Movie } from "@/components/Search";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const getUserID = async () => {
  const cookieStore = cookies();
  let userId = cookieStore.get("user-id")?.value;

  if (!userId) {
    throw new Error("User ID not found");
  }

  return userId;
};

const ensureUserID = async () => {
  try {
    return await getUserID();
  } catch {
    const cookieStore = cookies();
    const userId = uuidv4();
    cookieStore.set("user-id", userId);

    return userId;
  }
};

export const insertMovie = async (movie: Movie) => {
  const userID = await ensureUserID();

  console.log(userID, movie);
};

export const ensureDatabase = async () => {
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

    return { user, movies };
  } catch (error) {}
};

export const getMovies = async () => {
  try {
    await getUserID();
  } catch {
    return [];
  }
};
