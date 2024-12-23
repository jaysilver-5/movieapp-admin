import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Replace with your Firebase configuration
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  title: string;
  trailerUrl: string;
  posterUrl: string;
  bannerUrl: string;
  synopsis: string;
  releaseDate: string;
  categories: string[];
  series: boolean;
  downloadUrl?: string;
  episodes?: {
    season: string;
    episode: string;
    title: string;
    downloadLink: string;
  }[];
}

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesCollection = collection(db, 'movies');
      const movieSnapshot = await getDocs(moviesCollection);
      const moviesList = movieSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Movie[];
      setMovies(moviesList);
    };

    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this movie?');
    if (confirmed) {
      await deleteDoc(doc(db, 'movies', id));
      setMovies(movies.filter((movie) => movie.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Movies List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={300}
              height={450}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
              <p className="text-gray-700 text-sm mb-2">{movie.synopsis}</p>
              <p className="text-gray-500 text-xs">Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
              <div className="flex gap-2 mt-2">
                <Link href={movie.trailerUrl} passHref>
                  <a className="text-blue-500 text-sm" target="_blank" rel="noopener noreferrer">
                    Watch Trailer
                  </a>
                </Link>
                {movie.downloadUrl && (
                  <Link href={movie.downloadUrl} passHref>
                    <a className="text-blue-500 text-sm" target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Link>
                )}
              </div>
              {movie.series && movie.episodes && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Episodes:</h3>
                  <ul className="list-disc list-inside">
                    {movie.episodes.map((episode, index) => (
                      <li key={index} className="text-sm">
                        <span>{`Season ${episode.season}, Episode ${episode.episode}: `}</span>
                        <Link href={episode.downloadLink} passHref>
                          <a className="text-blue-500" target="_blank" rel="noopener noreferrer">
                            {episode.title}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDelete(movie.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
