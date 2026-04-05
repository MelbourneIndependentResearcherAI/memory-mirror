import React, { useState } from "react";

export default function ShowerCompanion() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "We’ll go nice and slow. There’s no rush.",
    "First, make sure the floor is clear and safe.",
    "Check the water with your hand. Warm, not too hot.",
    "If you like, you can sit on a shower chair or stool.",
    "Take your time washing your face, arms, and body.",
    "Rinse gently. You’re doing really well.",
    "When you’re ready, turn the water off and step out slowly.",
    "Pat yourself dry with a towel. No need to rush.",
    "All done. You did a great job taking care of yourself.",
  ];

  const nextStep = () => {
    setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f7f3ef",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ marginBottom: "12px", color: "#5a4636" }}>
        Shower Companion
      </h1>

      <p style={{ marginBottom: "16px", color: "#5a4636" }}>
        Gentle, step-by-step support for shower time. No rush, no pressure.
      </p>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "18px",
              color: "#5a4636",
              marginBottom: "8px",
            }}
          >
            Step {stepIndex + 1} of {steps.length}
          </p>
          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.6",
              color: "#5a4636",
            }}
          >
            {steps[stepIndex]}
          </p>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={prevStep}
            disabled={stepIndex === 0}
            style={{
              flex: 1,
              padding: "14px",
              background: stepIndex === 0 ? "#ddd2c8" : "#e8d8c8",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              color: "#5a4636",
              cursor: stepIndex === 0 ? "default" : "pointer",
              fontWeight: "bold",
            }}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={stepIndex === steps.length - 1}
            style={{
              flex: 1,
              padding: "14px",
              background:
                stepIndex === steps.length - 1 ? "#ddd2c8" : "#e8d8c8",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              color: "#5a4636",
              cursor:
                stepIndex === steps.length - 1 ? "default" : "pointer",
              fontWeight: "bold",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
