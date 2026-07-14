import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/properties", {
        params: {
          search,
          location,
          minPrice,
          maxPrice,
          page,
          limit: 6,
        },
      });

      setProperties(data.properties);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch properties"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchProperties();
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);

    setTimeout(() => {
      fetchProperties();
    }, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Property Management</h2>

        <div>
          <Link to="/add-property">Add Property</Link>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <form
        className="filter-container"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search property"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button type="submit">
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>

      <h1>Properties</h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="property-grid">
          {properties.length === 0 ? (
            <p>No properties found</p>
          ) : (
            properties.map((property) => (
              <div
                className="property-card"
                key={property._id}
              >
                {property.images?.[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                  />
                )}

                <h2>{property.title}</h2>

                <p>{property.location}</p>

                <h3>
                  ₹{property.pricing}
                </h3>

                <Link
                  to={`/properties/${property._id}`}
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;