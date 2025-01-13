import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createField } from "../slices/fieldSlice";
import toast from "react-hot-toast";
import MapInput from "./MapInput";

const CreateFieldForm = ({ onSuccess, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.field);

  const [formData, setFormData] = useState({
    name: "",
    cropType: [],
    areaSize: "",
    location: null,
  });

  const [newCropType, setNewCropType] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (coordinates) {
      setFormData((prev) => ({ ...prev, location: coordinates }));
    }
  }, [coordinates]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCropTypeAdd = (e) => {
    if (e.key === "Enter" && newCropType.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        cropType: [...prev.cropType, newCropType.trim()],
      }));
      setNewCropType(""); // Clear the input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      toast.error("Please select coordinates on the map.");
      return;
    }

    if (!formData.cropType.length) {
      toast.error("Please add at least one crop type.");
      return;
    }

    const resultAction = await dispatch(createField(formData));
    if (createField.fulfilled.match(resultAction)) {
      toast.success("Field created successfully!");
      onSuccess();
      setFormData({
        name: "",
        cropType: [],
        areaSize: "",
        location: null,
      });
      setCoordinates(null);
      onClose();
    } else {
      const errorMessage =
        resultAction.payload?.message || "Error creating field.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="md:w-[80vw] w-full h-full md:h-[80vh] p-6 bg-white rounded-md">
      <h5 className="font-semibold text-xl text-gray-700 mb-4">
        Add Field Details
      </h5>
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
          <div className="lg:w-[80%] w-full mx-auto mb-4">
            <input
              type="text"
              name="cropTypeInput"
              placeholder="Add Crop Type"
              className="border p-2 w-full rounded"
              value={newCropType}
              onChange={(e) => setNewCropType(e.target.value)}
              onKeyDown={handleCropTypeAdd}
            />
            <div className="flex gap-2 flex-wrap mt-2">
              {formData.cropType.map((type, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
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
            {isLoading ? "Creating..." : "Create Field"}
          </button>
        </div>
        <div className="md:w-[50%] h-auto w-full rounded-md">
          <MapInput onCoordinatesChange={setCoordinates} />
        </div>
      </form>
    </div>
  );
};

export default CreateFieldForm;
