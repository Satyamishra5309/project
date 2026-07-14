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
    return <h1>Loading...</h1>;
  }

  if (!property) {
    return <h1>Property not found</h1>;
  }

  const isOwner = property.listed_By?._id === user?.id;

  return (
    <div className="property-details">
      <button onClick={() => navigate("/dashboard")}>
        Back
      </button>

      <div className="property-images">
        {property.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={property.title}
          />
        ))}
      </div>

      <h1>{property.title}</h1>

      <h3>{property.location}</h3>

      <h2>₹{property.pricing}</h2>

      <p>{property.description}</p>

      <p>
        Listed By: {property.listed_By?.name}
      </p>

      {isOwner && (
        <div className="property-actions">
          <button
            onClick={() =>
              navigate(`/edit-property/${property._id}`)
            }
          >
            Edit
          </button>

          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;