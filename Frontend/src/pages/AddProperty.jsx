import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/AddProperty.css";

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    images: "",
    description: "",
    pricing: "",
  });

  const [loading, setLoading] = useState(false);

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

      const { data } = await api.post("/properties", propertyData);

      toast.success(data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add property"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <form onSubmit={handleSubmit} className="property-form">
        <h1>Add Property</h1>

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
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;