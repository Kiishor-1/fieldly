import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, fetchFieldById } from "../slices/fieldSlice";
import toast from "react-hot-toast";
import MapInput from "./MapInput";

const EditFieldForm = ({ fieldId, onSuccess, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, field } = useSelector((state) => state.field);

  const [formData, setFormData] = useState({
    name: "",
    cropTypes: [],
    location: null,
  });

  const [coordinates, setCoordinates] = useState(null);
  const [currentCropType, setCurrentCropType] = useState(""); 

  useEffect(() => {
    if (fieldId) {
      dispatch(fetchFieldById(fieldId));
    }
  }, [dispatch, fieldId]);

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || "",
        cropTypes: field.cropType || [], 
        areaSize: field.areaSize || "",
        location: field.location || null,
      });
      setCoordinates(field.location || null);
    }
  }, [field]);

  useEffect(() => {
    if (coordinates) {
      setFormData((prev) => ({ ...prev, location: coordinates }));
    }
  }, [coordinates]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(field)

  const handleCropTypeKeyPress = (e) => {
    if (e.key === "Enter" && currentCropType.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        cropTypes: [...prev.cropTypes, currentCropType.trim()],
      }));
      setCurrentCropType("");
    }
  };

  const handleRemoveCropType = (index) => {
    setFormData((prev) => ({
      ...prev,
      cropTypes: prev.cropTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      toast.error("Please select coordinates on the map.");
      return;
    }

    const resultAction = await dispatch(updateField({ id: fieldId, data: formData }));
    if (updateField.fulfilled.match(resultAction)) {
      toast.success("Field updated successfully!");
      onClose();
    } else {
      const errorMessage = resultAction.payload?.message || "Error updating field.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="md:w-[80vw] w-full h-full md:h-[80vh] p-6 bg-white rounded-md">
      <h5 className="font-semibold text-xl text-gray-700 mb-4">Edit Field Details</h5>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full p-4 flex md:flex-row flex-col gap-6 md:gap-12"
      >
        <div className="h-full flex flex-1 flex-col justify-center items-center">
          <input
            type="text"
            name="name"
            placeholder="Field Name"
            className="border lg:w-[80%] w-full mx-auto p-2 mb-4 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Add Crop Type"
            className="border lg:w-[80%] w-full mx-auto p-2 mb-4 rounded"
            value={currentCropType}
            onChange={(e) => setCurrentCropType(e.target.value)}
            onKeyPress={handleCropTypeKeyPress}
          />
          <div className="lg:w-[80%] w-full mx-auto mb-4">
            {formData.cropTypes.map((crop, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full mr-2 mb-2"
              >
                {crop}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveCropType(index)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <input
            type="number"
            name="areaSize"
            placeholder="Area Size (acres)"
            className="border lg:w-[80%] w-full mx-auto p-2 mb-4 rounded"
            value={formData.areaSize}
            onChange={handleChange}
            required
          />
          {formData.location && (
            <span className="border w-[80%] mx-auto rounded px-4 py-2 text-center my-2">
              Longitude: {formData.location[0]}, Latitude: {formData.location[1]}
            </span>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded lg:w-[80%] w-full mx-auto"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Field"}
          </button>
        </div>
        <div className="md:w-[50%] h-auto w-full rounded-md">
          <MapInput onCoordinatesChange={setCoordinates} initialCoordinates={coordinates} />
        </div>
      </form>
    </div>
  );
};

export default EditFieldForm;
