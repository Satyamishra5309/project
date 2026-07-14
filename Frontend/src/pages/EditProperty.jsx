import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    images: "",
    description: "",
    pricing: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);

        setFormData({
          title: data.property.title,
          location: data.property.location,
          images: data.property.images?.join(", ") || "",
          description: data.property.description,
          pricing: data.property.pricing,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch property"
        );
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const propertyData = {
        ...formData,
        pricing: Number(formData.pricing),
        images: formData.images
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean),
      };

      const { data } = await api.put(
        `/properties/${id}`,
        propertyData
      );

      toast.success(data.message);

      navigate(`/properties/${id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <form onSubmit={handleSubmit} className="property-form">
        <h1>Edit Property</h1>

        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="images"
          placeholder="Image URLs separated by comma"
          value={formData.images}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pricing"
          placeholder="Price"
          value={formData.pricing}
          onChange={handleChange}
          min="0"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Property"}
        </button>
      </form>
    </div>
  );
};

export default EditProperty;