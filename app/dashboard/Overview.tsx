import React, { useState, useEffect } from "react";
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const AdminOverview = () => {
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    season: "",
    episode: "",
    downloadLink: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users and movies from Firestore
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });

    const unsubscribeMovies = onSnapshot(collection(db, "movies"), (snapshot) => {
      const moviesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(moviesData);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeMovies();
    }; // Cleanup listeners
  }, []);

  // Handle Delete Movie
  const handleDeleteMovie = async (id) => {
    try {
      await deleteDoc(doc(db, "movies", id));
      alert("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedMovies.map((id) => deleteDoc(doc(db, "movies", id)));
      await Promise.all(deletePromises);
      setSelectedMovies([]);
      alert("Selected movies deleted successfully!");
    } catch (error) {
      console.error("Error deleting movies:", error);
    }
  };

  // Open Add Episode Modal
  const handleAddEpisodeModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Handle Adding a New Episode
  const handleAddEpisode = async () => {
    if (!selectedMovie) return;

    const movieRef = doc(db, "movies", selectedMovie.id);
    try {
      const updatedEpisodes = [...(selectedMovie.episodes || []), newEpisode];
      await updateDoc(movieRef, { episodes: updatedEpisodes });
      alert("Episode added successfully!");
      setIsModalOpen(false);
      setNewEpisode({
        title: "",
        season: "",
        episode: "",
        downloadLink: "",
      });
    } catch (error) {
      console.error("Error adding episode:", error);
    }
  };

  return (
    <div className="w-full p-4">
      {/* Overview Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">Total Users</h2>
          <p className="text-2xl">{users.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">Total Movies</h2>
          <p className="text-2xl">{movies.length}</p>
        </div>
      </div>

      {/* Search & Bulk Delete */}
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

      {/* Movies Table */}
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
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMovies([...selectedMovies, movie.id]);
                        } else {
                          setSelectedMovies(selectedMovies.filter((id) => id !== movie.id));
                        }
                      }}
                    />
                  </td>
                  <td className="p-2">{movie.title}</td>
                  <td className="p-2">{movie.type || (movie.episodes?.length > 0 ? "Series" : "Movie")}</td>
                  <td className="p-2">{movie.episodes?.length || 0}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Delete
                    </button>
                    {movie.episodes?.length > 0 && (
                      <button
                        onClick={() => handleAddEpisodeModal(movie)}
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

      {/* Add Episode Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add Episode to {selectedMovie?.title}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEpisode();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={newEpisode.title}
                  onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Season</label>
                <input
                  type="text"
                  value={newEpisode.season}
                  onChange={(e) => setNewEpisode({ ...newEpisode, season: e.target.value })}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Episode</label>
                <input
                  type="text"
                  value={newEpisode.episode}
                  onChange={(e) => setNewEpisode({ ...newEpisode, episode: e.target.value })}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Download Link</label>
                <input
                  type="text"
                  value={newEpisode.downloadLink}
                  onChange={(e) => setNewEpisode({ ...newEpisode, downloadLink: e.target.value })}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
};

export default AdminOverview;
