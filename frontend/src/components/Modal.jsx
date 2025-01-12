const Modal = ({ onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center">
      <div className="bg-white rounded-lg p-4">
        <button
          className="text-red-500 font-bold"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
  
  export default Modal;
  