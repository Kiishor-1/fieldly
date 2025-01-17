const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center overflow-hidden">
    <div className="bg-white rounded-lg p- max-h-[90vh] w-full md:w-auto overflow-y-auto hideScroll relative">
      <button
        className="text-red-500 font-bold mb-4 sticky z-[51] p-2 text-start top-0 bg-white w-full"
        onClick={onClose}
      >
        Close
      </button>
      {children}
    </div>
  </div>
);

export default Modal;