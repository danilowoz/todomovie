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
  await ensureDatabase();
  const userID = await ensureUserID();

  try {
    const currentMovie = await getMovieIDS();

    if (currentMovie.length > 0) {
      const resultUser = await sql`
        UPDATE users
        SET movies = array_cat(users.movies, ARRAY[${movie.imdbID}])
        WHERE id = ${userID};
`;
    } else {
      const resultUser =
        await sql`INSERT INTO users (id, movies) VALUES (${userID}, ARRAY[${movie.imdbID}]);`;
    }

    const resultMovie = await sql`
    INSERT INTO movies
    (imdbID, Title, Year, Poster, imdbRating, Plot, Runtime, Director)
    VALUES
    (${movie.imdbID}, ${movie.Title}, ${movie.Year}, ${movie.Poster}, ${movie.imdbRating}, ${movie.Plot}, ${movie.Runtime}, ${movie.Director});
  `;
  } catch (error) {
    console.log(error);
  }
};

export const ensureDatabase = async () => {
  try {
    // await sql`DROP TABLE IF EXISTS users;`;
    const user = await sql`CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) NOT NULL,
          movies VARCHAR(9)[]
      );
`;

    // await sql`DROP TABLE IF EXISTS movies;`;
    const movies = await sql`CREATE TABLE IF NOT EXISTS movies (
        imdbID VARCHAR(9) PRIMARY KEY,
        Title VARCHAR(355) NOT NULL,
        Year VARCHAR(4),
        Poster VARCHAR(355),
        imdbRating VARCHAR(4),
        Plot VARCHAR(355),
        Runtime VARCHAR(355),
        Director VARCHAR(355)
      );
`;

    return { user, movies };
  } catch (error) {
    console.log(error);
  }
};

export const getMovieIDS = async () => {
  try {
    const userID = await getUserID();

    const result = await sql`
      SELECT movies FROM users WHERE id = ${userID};
    `;

    return result.rows[0].movies;
  } catch {
    return [];
  }
};
