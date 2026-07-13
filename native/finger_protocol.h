#ifndef FINGER_PROTOCOL_H
#define FINGER_PROTOCOL_H

#include <string>

/**
 * @brief Class that handles finger protocol communication
 */
class FingerProtocol {
public:
    /**
     * @brief Construct a new Finger Protocol object
     */
    FingerProtocol();

    /**
     * @brief Destroy the Finger Protocol object
     */
    ~FingerProtocol();

    /**
     * @brief Initialize the finger protocol communication
     * @return true if initialization successful, false otherwise
     */
    bool initialize();

    /**
     * @brief Send data using finger protocol
     * @param data The data to send
     * @return true if data sent successfully, false otherwise
     */
    bool sendData(const std::string& data);

    /**
     * @brief Receive data using finger protocol
     * @return The received data as string
     */
    std::string receiveData();

    /**
     * @brief Connect to a device using finger protocol
     * @param deviceId The ID of the device to connect to
     * @return true if connection successful, false otherwise
     */
    bool connectToDevice(const std::string& deviceId);

    /**
     * @brief Disconnect from the current device
     * @return true if disconnection successful, false otherwise
     */
    bool disconnect();

    /**
     * @brief Check if currently connected to a device
     * @return true if connected, false otherwise
     */
    bool getIsConnected() const;

    /**
     * @brief Get the ID of the currently connected device
     * @return The device ID as string, empty if not connected
     */
    std::string getCurrentDeviceId() const;

private:
    bool isConnected;
    std::string currentDeviceId;
};

#endif // FINGER_PROTOCOL_H