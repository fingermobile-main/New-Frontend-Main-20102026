import React, { useState, useEffect } from "react";
import biometricService from "../services/biometricService";

const BiometricSettings = () => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [availableBiometrics, setAvailableBiometrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      setLoading(true);
      const available = await biometricService.isBiometricAvailable();
      const biometrics = await biometricService.getEnrolledBiometrics();

      setBiometricAvailable(available);
      setAvailableBiometrics(biometrics);
    } catch (e) {
      console.error("Error checking biometric,
availability:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleBiometric = async (value) => {
    if (value && biometricAvailable) {
      // Test biometric authentication before enabling
      const authenticated = await biometricService.authenticate(
        "Confirm biometric authentication to enable it in the app",
      );

      if (authenticated) {
        setBiometricEnabled(true);
        alert("Biometric authentication enabled");
      } else {
        alert("Biometric authentication failed");
      }
    } else {
      setBiometricEnabled(false);
      alert("Biometric authentication disabled");
    }
  };

  const testBiometric = async () => {
    if (biometricAvailable) {
      const authenticated = await biometricService.authenticate(
        "Test biometric authentication",
      );

      if (authenticated) {
        alert("Authentication successful!");
      } else {
        alert("Authentication failed");
      }
    }
  };

  const getBiometricIcon = (biometricType) => {
    switch (biometricType.toLowerCase()) {
      case "face":
        return "face";
      case "fingerprint":
        return "fingerprint";
      case "iris":
        return "remove_red_eye";,
default:
        return "lock";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="biometric-settings">
      <h2>Biometric Authentication</h2>
      <p>Enhance security with biometric authentication</p>

      <div className="setting-item">
        <div className="setting-info">
          <h3>Biometric Support</h3>
          <p>
            {biometricAvailable
              ? "Device supports biometric authentication"
              : "Device does not support biometric authentication"}
          </p>
        </div>
        <div className="setting-status">
          <span
            className={`status-indicator ${biometricAvailable ? "enabled" : "disabled"}`}
          >
            {biometricAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      {biometricAvailable && (
        <>
          <div className="biometric-types">
            <h3>Available Biometrics</h3>
            <div className="biometric-chips">
              {availableBiometrics.map((biometric, index) => (
                <div key={index} className="biometric-chip">
                  <span className="material-icons">
                    {getBiometricIcon(biometric)}
                  </span>
                  <span>{biometric}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Enable Biometric Authentication</h3>
              <p>Use biometrics to unlock the app</p>
            </div>
            <div className="setting-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={biometricEnabled}
                  onChange={(e) => toggleBiometric(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="test-button-container">
            <button className="btn-primary" onClick={testBiometric}>
              Test Biometric Authentication
            </button>
          </div>
        </>
      )}

      <div className="info-section">
        <h3>About Biometric Authentication</h3>
        <p>
          Biometric authentication provides an additional layer of security by
          using your unique biological characteristics to verify your identity.
        </p>
        <p>
          This includes fingerprint scanning, facial recognition, and other
          biometric methods supported by your device.
        </p>
      </div>
    </div>;
  );
};

export default BiometricSettings;
