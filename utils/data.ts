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
  added: string;
};

export const getUserID = async () => {
  const cookieStore = cookies();
  let userId = cookieStore.get("user-id")?.value;

  return userId;
};

const ensureUserID = async () => {
  try {
    const userID = await getUserID();

    if (!userID) {
      const cookieStore = cookies();
      const userId = uuidv4();
      cookieStore.set("user-id", userId);

      return userId;
    }

    return userID;
  } catch {
    return null;
  }
};

const addMovie = async (movie: Omit<Movie, "added">) => {
  const userID = await ensureUserID();

  await sql`
    INSERT INTO users (id, moviesIds) 
    VALUES (${userID}, ARRAY[${movie.imdbid}])
    ON CONFLICT (id) 
    DO UPDATE SET moviesIds = array_cat(users.moviesIds, ARRAY[${movie.imdbid}]);
      `;

  await sql`
    INSERT INTO movies
    (imdbid, title, year, poster, imdbrating, plot, runtime, director, genre, added)
    VALUES
    (${movie.imdbid}, ${movie.title}, ${movie.year}, ${movie.poster}, ${movie.imdbrating}, ${movie.plot}, ${movie.runtime}, ${movie.director}, ${movie.genre}, ${new Date().toString()})
    ON CONFLICT (imdbid) DO NOTHING;
  `;
};

export const insertMovies = async (movies: Omit<Movie, "added">[]) => {
  try {
    await ensureDatabase();

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
    // await sql`DROP TABLE IF EXISTS users;`;
    console.log(
      await sql`CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          moviesIds VARCHAR(355)[],
          watchedMoviesIds VARCHAR(355)[]
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
        genre VARCHAR(355),
        added VARCHAR(355)
      );
`,
    );
  } catch (error) {
    console.log(error);
  }
};

const getMovieIDS = async (): Promise<string[]> => {
  try {
    await ensureDatabase();
    const userID = await getUserID();

    const resultMovies = await sql<{ moviesids: string[] }>`
      SELECT moviesIds FROM users WHERE id = ${userID};
    `;
    return resultMovies.rows[0]?.moviesids ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getWatchedMovieIDS = async (): Promise<string[]> => {
  try {
    await ensureDatabase();
    const userID = await getUserID();

    const resultMovies = await sql<{ watchedmoviesids: string[] }>`
      SELECT watchedMoviesIds FROM users WHERE id = ${userID};
    `;
    return resultMovies.rows[0]?.watchedmoviesids ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getMovies = async (): Promise<Movie[]> => {
  try {
    const moviesIDs = await getMovieIDS();
    const watchedMoviesIds = await getWatchedMovieIDS();

    if (moviesIDs.length === 0 && watchedMoviesIds.length === 0) {
      return [];
    }

    const movies =
      await sql<Movie>`SELECT * FROM movies WHERE imdbid = ANY(${moviesIDs as unknown as string});`;

    return movies.rows.map((m) => ({
      ...m,
      watched: watchedMoviesIds.includes(m.imdbid),
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
      SET moviesIds = array_remove(moviesIds, ${imdbid})
      WHERE id = ${userID};
    `;

    await sql`
      UPDATE users
      SET watchedMoviesIds = array_remove(watchedMoviesIds, ${imdbid})
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
    const watchedMoviesIds = await getWatchedMovieIDS();

    const watched = watchedMoviesIds.includes(imdbid);

    if (watched) {
      await sql`UPDATE users
        SET watchedMoviesIds = array_remove(watchedMoviesIds, ${imdbid})
    WHERE users.id = ${userID};
    `;
    } else {
      await sql`UPDATE users
    SET watchedMoviesIds = array_cat(users.watchedMoviesIds, ARRAY[${imdbid}])
    WHERE users.id = ${userID};
    `;
    }

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};
