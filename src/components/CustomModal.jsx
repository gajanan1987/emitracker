import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const CustomModal = ({ children, onCloseModal, open }) => {
  return (
    <div>
      <Modal open={open} onClose={onCloseModal} center>
        {children}
      </Modal>
    </div>
  );
};

export default CustomModal;
