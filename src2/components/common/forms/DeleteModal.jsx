import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./modal.scss";
export const DeleteModal = (props) => {
  let text;
console.log(props);
  if (props.row[1]=="A") {
    text = (
      <span class="inact">
        Are you sure you want to Active <b>"{props.row[0]}"</b> ?
      </span>
    );
  } else if (props.row[1] == "D") {
    text = (
      <span class="inact">
        Are you sure you want to Inactive <b>{props.row[0]}</b> ?
      </span>
    );
  } else {
    text = "Something has missed";
  }
  return (
    <div className="delete-modal">
      <Modal isOpen={props.isOpen}>
        <ModalHeader style={{ borderBottom: " 0 none", color: "#124a97" }}>
          Active/Inactive{" "}
        </ModalHeader>
        <ModalBody style={{ padding: " 0 0 0 35px " }}>{text}</ModalBody>
        <ModalFooter style={{ borderTop: " 0 none" }}>
          <button
            style={{
              backgroundColor: "#1c4e9a",
              border: "none",
              color: "white",
              padding: "5px",
            }}
            className="px-3"
            onClick={props.onClick}
          >
            OK
          </button>
          <button
            style={{
              backgroundColor: "#e1e3e6",
              border: "none",
              color: "#464b52",
              padding: "5px",
            }}
            className="px-2"
            onClick={props.CloseModal}
          >
            CANCEL
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default DeleteModal;