"use server";

import { revalidatePath } from "next/cache";

import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export type Movie = {
  title: string;
  imdbid: string;
  year: string;
  poster: string;
  genre: string;
  imdbrating: string;
  plot: string;
  runtime: string;
  director: string;
  watched?: boolean;
  added?: string;
};

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
  try {
    await ensureDatabase();
    const userID = await ensureUserID();

    const currentMovie = await getMovieIDS();

    if (currentMovie.length > 0) {
      console.log(
        await sql`
        UPDATE users
        SET moviesIds = array_cat(users.moviesIds, ARRAY[${movie.imdbid}])
        WHERE id = ${userID};
`,
      );
    } else {
      console.log(
        await sql`INSERT INTO users (id, moviesIds) VALUES (${userID}, ARRAY[${movie.imdbid}]);`,
      );
    }

    console.log(
      await sql`
    INSERT INTO movies
    (imdbid, title, year, poster, imdbrating, plot, runtime, director, genre, watched, added)
    VALUES
    (${movie.imdbid}, ${movie.title}, ${movie.year}, ${movie.poster}, ${movie.imdbrating}, ${movie.plot}, ${movie.runtime}, ${movie.director}, ${movie.genre}, false, ${new Date().toString()})
    ON CONFLICT (imdbid) DO NOTHING;
  `,
    );

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};

export const ensureDatabase = async () => {
  try {
    // await sql`DROP TABLE IF EXISTS users;`;
    const user = await sql`CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) NOT NULL,
          moviesIds VARCHAR(9)[]
      );
`;

    // await sql`DROP TABLE IF EXISTS movies;`;
    const movies = await sql`CREATE TABLE IF NOT EXISTS movies (
        imdbid VARCHAR(9) PRIMARY KEY,
        title VARCHAR(355) NOT NULL,
        year VARCHAR(4),
        poster VARCHAR(355),
        imdbrating VARCHAR(4),
        plot VARCHAR(355),
        runtime VARCHAR(355),
        director VARCHAR(355),
        genre VARCHAR(355),
        watched BOOLEAN,
        added VARCHAR(355)
      );
`;

    console.log({ user, movies });
  } catch (error) {
    console.log(error);
  }
};

export const getMovieIDS = async (): Promise<string[]> => {
  try {
    await ensureDatabase();
    const userID = await getUserID();

    const result = await sql<{ moviesids: string[] }>`
      SELECT moviesIds FROM users WHERE id = ${userID};
    `;

    return result.rows[0]?.moviesids ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getMovies = async (): Promise<Movie[]> => {
  try {
    const moviesIDs = await getMovieIDS();

    if (moviesIDs.length === 0) {
      return [];
    }

    const result =
      await sql<Movie>`SELECT * FROM movies WHERE imdbid = ANY(${moviesIDs});`;

    return result.rows;
  } catch (error) {
    console.log(error);
    return [];
  }
};
