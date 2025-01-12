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
    cropType: "",
    areaSize: "",
    location: null,
  });

  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (fieldId) {
      console.log("Fetching field with ID:", fieldId);
      dispatch(fetchFieldById(fieldId));
    }
  }, [dispatch, fieldId]);

  useEffect(() => {
    if (field) {
      console.log("Field data loaded:", field);
      setFormData({
        name: field.name || "",
        cropType: field.cropType || "",
        areaSize: field.areaSize || "",
        location: field.location || null,
      });
      setCoordinates(field.location || null);
    }
  }, [field]);

  useEffect(() => {
    if (coordinates) {
      console.log("Coordinates updated:", coordinates);
      setFormData((prev) => ({ ...prev, location: coordinates }));
    }
  }, [coordinates]);

  const handleChange = (e) => {
    console.log("Field changed:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      toast.error("Please select coordinates on the map.");
      return;
    }

    console.log("Submitting form data:", formData);

    const resultAction = await dispatch(updateField({ id: fieldId, data: formData }));
    if (updateField.fulfilled.match(resultAction)) {
      toast.success("Field updated successfully!");
      onSuccess();
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
            name="cropType"
            placeholder="Crop Type"
            className="border lg:w-[80%] w-full mx-auto p-2 mb-4 rounded"
            value={formData.cropType}
            onChange={handleChange}
            required
          />
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
