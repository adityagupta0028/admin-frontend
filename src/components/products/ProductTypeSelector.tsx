import React from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

interface ProductTypeSelectorProps {
  show: boolean;
  handleClose: () => void;
  onSelectType: (type: "Rings" | "Bracelets" | "Necklace" | "Earrings") => void;
}

export function ProductTypeSelector({
  show,
  handleClose,
  onSelectType,
}: ProductTypeSelectorProps) {
  const handleTypeClick = (type: "Rings" | "Bracelets" | "Necklace" | "Earrings") => {
    onSelectType(type);
    handleClose();
  };

  return (
    <Modal 
      centered 
      show={show} 
      onHide={handleClose} 
      size="md" 
      className="modal-parent"
      style={{ zIndex: 1050 }}
    >
      <Modal.Body 
        className="modal-body-scrollable"
        style={{ 
          padding: "2.5rem",
          paddingTop: "3rem",
          position: "relative",
          maxWidth: "500px",
          margin: "0 auto"
        }}
      >
        <div className="custom-form-container" style={{ position: "relative" }}>
          <button 
            type="button" 
            className="close-modal-btn" 
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              zIndex: 10
            }}
          >
            ×
          </button>
          
          <div style={{ paddingTop: "0.5rem", paddingBottom: "1.5rem", paddingRight: "2rem" }}>
            <h3 
              className="mb-3 fw-bold text-center text-black"
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem"
              }}
            >
              Select Product Type
            </h3>
            <p 
              className="text-center text-black mb-4"
              style={{
                fontSize: "0.95rem",
                color: "#666",
                marginBottom: "2rem"
              }}
            >
              Choose the type of product you want to add.
            </p>
          </div>
          
          <div className="d-flex flex-column gap-3" style={{ gap: "1rem" }}>
            {(["Rings", "Bracelets", "Necklace", "Earrings"] as const).map((type) => (
              <button
                key={type}
                type="button"
                className="btn w-100 text-white"
                style={{
                  background: "linear-gradient(to right, var(--gold), var(--gold-dark))",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1rem",
                  padding: "0.875rem 1.5rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

