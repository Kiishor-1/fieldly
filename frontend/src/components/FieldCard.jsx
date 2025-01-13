import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { FiMapPin } from "react-icons/fi";
import { LuMapPinOff } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { TiTrash } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import EditFieldForm from "./EditFieldForm";
import ConfirmDelete from "./ConfirmDelete";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { deleteField } from "../slices/fieldSlice";
import { useDispatch } from "react-redux";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;

const FieldCard = ({ field }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteField(field._id)).unwrap();
      toast.success("Field deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to delete the field");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-gray-600 mb-2">{field.name}</h3>
      <p className="text-gray-600 text-sm">
        Crop Type: {Array.isArray(field.cropType) ? field.cropType.join(", ") : field.cropType}
      </p>
      <p className="text-gray-600 text-sm">Area: {field.areaSize} acres</p>
      <div className="flex items-center mt-auto">
        <button
          className="text-green-500 p-2 rounded hover:bg-gray-100 transition"
          onClick={() => navigate(`/analytics/${field?._id}`)}
        >
          <TbBrandGoogleAnalytics />
        </button>
        <button
          className="text-teal-500 text-lg p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? <LuMapPinOff /> : <FiMapPin />}
        </button>
        <button
          className="text-red-500 text-lg p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <TiTrash />
        </button>
        <button
          className="text-gray-500 text-lg p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setIsEditFormOpen(true)}
        >
          <MdEdit />
        </button>
      </div>
      {showMap && field.location && (
        <div className="mt-4 h-64 w-full border">
          <div
            ref={(el) => {
              if (el) {
                new mapboxgl.Map({
                  container: el,
                  style: "mapbox://styles/mapbox/streets-v11",
                  center: field.location,
                  zoom: 12,
                }).addControl(new mapboxgl.Marker().setLngLat(field.location));
              }
            }}
            className="h-full w-full"
          ></div>
        </div>
      )}
      {isEditFormOpen && (
        <Modal onClose={() => setIsEditFormOpen(false)}>
          <EditFieldForm
            fieldId={field?._id}
            onClose={() => setIsEditFormOpen(false)}
          />
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal>
          <ConfirmDelete
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </Modal>
      )}
    </div>
  );
};

export default FieldCard;
