import "./tracker.css";

const timeExceededModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Time Exceeded</h2>
        <h2>00:10:00</h2>
        <p>Time is up. Do you wish to continue?</p>
        <div className="modal-actions">
          <button onClick={onClose}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default timeExceededModal;
