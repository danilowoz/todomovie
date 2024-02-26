"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export type Movie = {
  title: string;
  imdbid: string;
  year: string;
  released: string;
  poster: string;
  genre: string;
  imdbrating: string;
  plot: string;
  runtime: string;
  director: string;
  country: string;
  watched?: boolean;
  added: string;
};

export const getUserID = async () => {
  const cookieStore = cookies();
  let userId = cookieStore.get("user-id")?.value;

  return userId;
};

export const updateCookirUserId = async (newUserId: string | null) => {
  if (newUserId) {
    const cookieStore = cookies();
    cookieStore.set("user-id", newUserId, { path: "/" });
  }
};

const ensureUserID = async () => {
  const userID = await getUserID();

  if (!userID) {
    const cookieStore = cookies();
    const userId = uuidv4();
    cookieStore.set("user-id", userId);

    return userId;
  }

  return userID;
};

const addMovie = async (movie: Omit<Movie, "added">) => {
  const userID = await ensureUserID();

  await sql`
    INSERT INTO users (id, moviesids) 
    VALUES (${userID}, ARRAY[${movie.imdbid}])
    ON CONFLICT (id) 
    DO UPDATE SET moviesids = array_cat(users.moviesids, ARRAY[${movie.imdbid}]);
      `;

  await sql`
    INSERT INTO movies
    (imdbid, title, year, poster, imdbrating, plot, runtime, director, released, genre, country, added)
    VALUES
    (${movie.imdbid}, ${movie.title}, ${movie.year}, ${movie.poster}, ${movie.imdbrating}, ${movie.plot}, ${movie.runtime}, ${movie.director}, ${movie.released}, ${movie.genre}, ${movie.country}, ${new Date().toString()})
    ON CONFLICT (imdbid) DO NOTHING;
  `;
};

export const insertMovies = async (movies: Omit<Movie, "added">[]) => {
  try {
    for (const movie of movies) {
      await addMovie(movie);
    }

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};

export const ensureDatabase = async () => {
  try {
    await sql`SELECT * FROM users LIMIT 1;`;
  } catch (error) {
    // await sql`DROP TABLE IF EXISTS users;`;
    console.log(
      await sql`CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          moviesids VARCHAR(355)[],
          watchedmoviesids VARCHAR(355)[]
      );`,
    );

    // await sql`DROP TABLE IF EXISTS movies;`;
    console.log(
      await sql`CREATE TABLE IF NOT EXISTS movies (
        imdbid VARCHAR(355) PRIMARY KEY,
        title VARCHAR(355) NOT NULL,
        year VARCHAR(4),
        poster VARCHAR(355),
        imdbrating VARCHAR(4),
        plot VARCHAR(355),
        runtime VARCHAR(355),
        director VARCHAR(355),
        released VARCHAR(355),
        genre VARCHAR(355),
        country VARCHAR(355),
        added VARCHAR(355)
      );
`,
    );
  }
};

const getMovieIDS = async (): Promise<string[]> => {
  try {
    const userID = await getUserID();

    const resultMovies = await sql<{ moviesids: string[] }>`
      SELECT moviesids FROM users WHERE id = ${userID};
    `;
    return resultMovies.rows[0]?.moviesids ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getWatchedMovieIDS = async (): Promise<string[]> => {
  try {
    const userID = await getUserID();

    const resultMovies = await sql<{ watchedmoviesids: string[] }>`
      SELECT watchedmoviesids FROM users WHERE id = ${userID};
    `;
    return resultMovies.rows[0]?.watchedmoviesids ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getMovies = async (): Promise<Movie[]> => {
  try {
    const moviesiDs = await getMovieIDS();
    const watchedmoviesids = await getWatchedMovieIDS();

    if (moviesiDs.length === 0 && watchedmoviesids.length === 0) {
      return [];
    }

    const movies =
      await sql<Movie>`SELECT * FROM movies WHERE imdbid = ANY(${moviesiDs as unknown as string});`;

    return movies.rows.map((m) => ({
      ...m,
      watched: watchedmoviesids.includes(m.imdbid),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteMovie = async (imdbid: string) => {
  try {
    const userID = await getUserID();

    await sql`
      UPDATE users
      SET moviesids = array_remove(moviesids, ${imdbid})
      WHERE id = ${userID};
    `;

    await sql`
      UPDATE users
      SET watchedmoviesids = array_remove(watchedmoviesids, ${imdbid})
      WHERE id = ${userID};
    `;

    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
};

export const toggleWatched = async (imdbid: string) => {
  try {
    const userID = await getUserID();
    const watchedmoviesids = await getWatchedMovieIDS();

    const watched = watchedmoviesids.includes(imdbid);

    if (watched) {
      await sql`UPDATE users
        SET watchedmoviesids = array_remove(watchedmoviesids, ${imdbid})
    WHERE users.id = ${userID};
    `;
    } else {
      await sql`UPDATE users
    SET watchedmoviesids = array_cat(users.watchedmoviesids, ARRAY[${imdbid}])
    WHERE users.id = ${userID};
    `;
    }

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};
