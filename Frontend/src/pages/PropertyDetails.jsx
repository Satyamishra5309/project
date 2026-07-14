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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-200">
            {property.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} ${index + 1}`}
                className="w-full h-[350px] object-cover"
              />
            ))}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {property.title}
                </h1>

                <p className="text-gray-500 text-lg mt-2">
                  📍 {property.location}
                </p>
              </div>

              <h2 className="text-3xl font-bold text-green-600">
                ₹{Number(property.pricing).toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="border-t border-gray-200 my-7" />

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Property Description
              </h3>

              <p className="text-gray-600 leading-7">
                {property.description}
              </p>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Listed By
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-1">
                {property.listed_By?.name || "Unknown User"}
              </p>
            </div>

            {isOwner && (
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() =>
                    navigate(`/edit-property/${property._id}`)
                  }
                  className="bg-blue-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Edit Property
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-red-700 transition"
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