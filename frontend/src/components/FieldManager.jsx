import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllFields } from "../slices/fieldSlice";
import FieldCard from "./FieldCard";
import Modal from "./Modal";
import CreateFieldForm from "./CreateFieldForm";
import { FaPlus } from "react-icons/fa";

const FieldManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { fields, error } = useSelector((state) => state.field);

  useEffect(() => {
    dispatch(fetchAllFields());
  }, [dispatch]);

  console.log(fields)

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg text-gray-600 font-semibold">All Fields</p>
        <button
          className="p-2 m-2 border border-dashed rounded-full border-3 border-gray-900 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus />
        </button>
      </div>


      {fields.length === 0 && (
        <p className="text-center text-gray-600">No fields available.</p>
      )}
      {fields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {fields.map((field) => (
            <FieldCard key={field?._id} field={field} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CreateFieldForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              dispatch(fetchAllFields());
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default FieldManager;
