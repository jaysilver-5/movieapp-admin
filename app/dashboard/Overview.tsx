import React, { useState, useEffect } from "react";
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

// Interfaces
interface User {
  id: string;
  [key: string]: any;
}

interface Movie {
  id: string;
  title: string;
  type?: string;
  episodes?: {
    downloadLink: string;
    episode: string;
    season: string;
    title: string;
  }[];
  [key: string]: any;
}

interface Episode {
  title: string;
  season: string;
  episode: string;
  downloadLink: string;
}

// Components
const OverviewCard = ({
  title,
  value,
  bgColor,
}: {
  title: string;
  value: number;
  bgColor: string;
}) => (
  <div className={`p-4 rounded shadow ${bgColor} text-white`}>
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="text-2xl">{value}</p>
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedMovie,
  newEpisode,
  setNewEpisode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedMovie: Movie | null;
  newEpisode: Episode;
  setNewEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}) =>
  isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add Episode to {selectedMovie?.title}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {["title", "season", "episode", "downloadLink"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-bold mb-2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                value={(newEpisode as any)[field]}
                onChange={(e) =>
                  setNewEpisode({ ...newEpisode, [field]: e.target.value })
                }
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Episode
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

const AdminOverview = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [newEpisode, setNewEpisode] = useState<Episode>({
    title: "",
    season: "",
    episode: "",
    downloadLink: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  
    const unsubscribeMovies = onSnapshot(collection(db, "movies"), (snapshot) => {
      setMovies(snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, title: data.title || "", ...data }; // Ensure `title` is present
      }));
    });
  
    return () => {
      unsubscribeUsers();
      unsubscribeMovies();
    };
  }, []);
  

  const handleDeleteMovie = async (id: string) => {
    try {
      await deleteDoc(doc(db, "movies", id));
      alert("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedMovies.map((id) => deleteDoc(doc(db, "movies", id))));
      setSelectedMovies([]);
      alert("Selected movies deleted successfully!");
    } catch (error) {
      console.error("Error deleting movies:", error);
    }
  };

  const handleAddEpisode = async () => {
    if (!selectedMovie) return;
    const movieRef = doc(db, "movies", selectedMovie.id);
    try {
      const updatedEpisodes = [...(selectedMovie.episodes || []), newEpisode];
      await updateDoc(movieRef, { episodes: updatedEpisodes });
      setIsModalOpen(false);
      setNewEpisode({ title: "", season: "", episode: "", downloadLink: "" });
      alert("Episode added successfully!");
    } catch (error) {
      console.error("Error adding episode:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <OverviewCard title="Total Users" value={users.length} bgColor="bg-blue-500" />
        <OverviewCard title="Total Movies" value={movies.length} bgColor="bg-green-500" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className="border border-gray-300 rounded p-2 w-1/3"
        />
        <button
          onClick={handleBulkDelete}
          className="bg-red-500 text-white px-4 py-2 rounded shadow"
        >
          Delete Selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedMovies(e.target.checked ? movies.map((m) => m.id) : [])
                  }
                />
              </th>
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Episodes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies
              .filter((movie) => movie.title?.toLowerCase().includes(search))
              .map((movie) => (
                <tr key={movie.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedMovies.includes(movie.id)}
                      onChange={(e) =>
                        setSelectedMovies((prev) =>
                          e.target.checked
                            ? [...prev, movie.id]
                            : prev.filter((id) => id !== movie.id)
                        )
                      }
                    />
                  </td>
                  <td className="p-2">{movie.title}</td>
                  <td className="p-2">{movie.type || "Movie"}</td>
                  <td className="p-2">{movie.episodes?.length || 0}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Delete
                    </button>
                    {movie.episodes?.length !== undefined && (
                      <button
                        onClick={() => {
                          setSelectedMovie(movie);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Add Episode
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEpisode}
        selectedMovie={selectedMovie}
        newEpisode={newEpisode}
        setNewEpisode={setNewEpisode}
      />
    </div>
  );
};

export default AdminOverview;
