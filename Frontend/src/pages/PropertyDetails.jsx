import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProperty = async () => {
    try {
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data.property);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch property"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/properties/${id}`);

      toast.success(data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl font-semibold text-gray-700">
          Loading property...
        </h1>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">
          Property not found
        </h1>
      </div>
    );
  }

  const isOwner = property.listed_By?._id === user?.id;

  return (
  <div className="details-page">
    <div className="details-container">
      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="details-card">
        <div className="details-images">
          {property.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={property.title}
            />
          ))}
        </div>

        <div className="details-content">
          <div className="details-header">
            <div>
              <h1>{property.title}</h1>
              <p className="location">
                📍 {property.location}
              </p>
            </div>

            <h2 className="price">
              ₹{Number(property.pricing).toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="description-section">
            <h3>Property Description</h3>
            <p>{property.description}</p>
          </div>

          <div className="owner-card">
            <span>Listed By</span>
            <strong>
              {property.listed_By?.name || "Unknown User"}
            </strong>
          </div>

          {isOwner && (
            <div className="details-actions">
              <button
                className="edit-button"
                onClick={() =>
                  navigate(`/edit-property/${property._id}`)
                }
              >
                Edit Property
              </button>

              <button
                className="delete-button"
                onClick={handleDelete}
              >
                Delete Property
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default PropertyDetails;