const logger = require('../utils/logger');
const { Pool } = require('pg');
require('dotenv').config();

// Database connection pool for TMS
const tmsPool = new Pool({
  member: process.env.TMS_DB_MEMBER || 'tms_member',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.TMS_DB_NAME || 'tms_db',
  password: process.env.TMS_DB_PASSWORD || 'tms_password',
  port: process.env.TMS_DB_PORT || 5432
});

class TMSService {
  // Create a new shipment
  static async createShipment(shipmentData) {
    const {
      tracking_number,
      booking_number,
      bill_of_lading,
      carrier_id,
      sender_id,
      receiver_id,
      origin_location,
      destination_location,
      weight,
      dimensions,
      notes
    } = shipmentData;

    const query = `
      INSERT INTO tms_shipments 
      (tracking_number, booking_number, bill_of_lading, carrier_id, sender_id, 
       receiver_id, origin_location, destination_location, weight, dimensions, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    try {
      const result = await tmsPool.query(query, [
        tracking_number,
        booking_number,
        bill_of_lading,
        carrier_id,
        sender_id,
        receiver_id,
        origin_location,
        destination_location,
        weight,
        dimensions,
        notes
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating shipment:', error);
      throw error;
    }
  }

  // Get shipment by tracking number
  static async getShipmentByTrackingNumber(trackingNumber) {
    const query = 'SELECT * FROM tms_shipments WHERE tracking_number = $1';

    try {
      const result = await tmsPool.query(query, [trackingNumber]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting shipment:', error);
      throw error;
    }
  }

  // Update shipment status
  static async updateShipmentStatus(trackingNumber, status, description = '') {
    const query = `
      UPDATE tms_shipments 
      SET status = $1, updated_at = NOW()
      WHERE tracking_number = $2
      RETURNING *
    `;

    try {
      const result = await tmsPool.query(query, [status, trackingNumber]);

      // Add status update record
      await this.addStatusUpdate(result.rows[0].id, status, description);

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating shipment status:', error);
      throw error;
    }
  }

  // Add status update record
  static async addStatusUpdate(
    shipmentId,
    status,
    description = '',
    alertLevel = 'info',
  ) {
    const query = `
      INSERT INTO tms_status_updates 
      (shipment_id, status, description, alert_level)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    try {
      const result = await tmsPool.query(query, [
        shipmentId,
        status,
        description,
        alertLevel
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error adding status update:', error);
      throw error;
    }
  }

  // Update shipment position (GPS/IP/MAC)
  static async updateShipmentPosition(trackingNumber, positionData) {
    const {
      latitude,
      longitude,
      location_details,
      gps_accuracy,
      ip_address,
      mac_address
    } = positionData;

    // First get the shipment to get its ID
    const shipment = await this.getShipmentByTrackingNumber(trackingNumber);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Update current location in shipments table
    const updateShipmentQuery = `
      UPDATE tms_shipments 
      SET current_location = $1, updated_at = NOW()
      WHERE tracking_number = $2
      RETURNING *
    `;

    try {
      await tmsPool.query(updateShipmentQuery, [
        location_details,
        trackingNumber
      ]);

      // Add to location history
      const historyQuery = `
        INSERT INTO tms_location_history 
        (shipment_id, latitude, longitude, location_details, gps_accuracy, ip_address, mac_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const result = await tmsPool.query(historyQuery, [
        shipment.id,
        latitude,
        longitude,
        location_details,
        gps_accuracy,
        ip_address,
        mac_address
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating shipment position:', error);
      throw error;
    }
  }

  // Get shipment tracking history
  static async getShipmentTrackingHistory(trackingNumber) {
    const query = `
      SELECT 
        slh.*, 
        ssu.status, 
        ssu.description as status_description, 
        ssu.alert_level,
        ssu.created_at as status_created_at
      FROM tms_location_history slh
      LEFT JOIN tms_status_updates ssu ON slh.shipment_id = ssu.shipment_id 
        AND DATE(slh.timestamp) = DATE(ssu.created_at)
      JOIN tms_shipments s ON slh.shipment_id = s.id
      WHERE s.tracking_number = $1
      ORDER BY slh.timestamp DESC
    `;

    try {
      const result = await tmsPool.query(query, [trackingNumber]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting tracking history:', error);
      throw error;
    }
  }

  // Get all status updates for a shipment
  static async getStatusUpdates(trackingNumber) {
    const query = `
      SELECT * FROM tms_status_updates 
      WHERE shipment_id = (SELECT id FROM tms_shipments WHERE tracking_number = $1)
      ORDER BY created_at DESC
    `;

    try {
      const result = await tmsPool.query(query, [trackingNumber]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting status updates:', error);
      throw error;
    }
  }

  // Create integration log
  static async createIntegrationLog(
    shipmentId,
    integrationType,
    externalReference,
    payload,
    response,
    status,
  ) {
    const query = `
      INSERT INTO tms_integration_logs 
      (shipment_id, integration_type, external_reference, payload, response, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    try {
      const result = await tmsPool.query(query, [
        shipmentId,
        integrationType,
        externalReference,
        payload,
        response,
        status
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating integration log:', error);
      throw error;
    }
  }

  // Get shipment status by tracking number
  static async getShipmentStatus(trackingNumber) {
    const query = `
      SELECT 
        s.*,
        json_agg(DISTINCT json_build_object(
          'id', ssu.id,
          'status', ssu.status,
          'description', ssu.description,
          'alert_level', ssu.alert_level,
          'created_at', ssu.created_at
        )) FILTER (WHERE ssu.id IS NOT NULL) as status_updates
      FROM tms_shipments s
      LEFT JOIN tms_status_updates ssu ON s.id = ssu.shipment_id
      WHERE s.tracking_number = $1
      GROUP BY s.id
    `;

    try {
      const result = await tmsPool.query(query, [trackingNumber]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting shipment status:', error);
      throw error;
    }
  }

  // Get shipments by member ID
  static async getShipmentsByMemberId(memberId, memberType = 'sender') {
    let column = 'sender_id';
    if (memberType === 'receiver') {
      column = 'receiver_id';
    }

    const query = `
      SELECT 
        s.*,
        json_agg(DISTINCT json_build_object(
          'id', ssu.id,
          'status', ssu.status,
          'description', ssu.description,
          'alert_level', ssu.alert_level,
          'created_at', ssu.created_at
        )) FILTER (WHERE ssu.id IS NOT NULL) as status_updates
      FROM tms_shipments s
      LEFT JOIN tms_status_updates ssu ON s.id = ssu.shipment_id
      WHERE s.${column} = $1
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `;

    try {
      const result = await tmsPool.query(query, [memberId]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting member shipments:', error);
      throw error;
    }
  }

  // Update shipment ETA
  static async updateShipmentETA(trackingNumber, newETA) {
    const query = `
      UPDATE tms_shipments 
      SET estimated_arrival = $1, updated_at = NOW()
      WHERE tracking_number = $2
      RETURNING *
    `;

    try {
      const result = await tmsPool.query(query, [newETA, trackingNumber]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating shipment ETA:', error);
      throw error;
    }
  }

  // Update shipment ETD
  static async updateShipmentETD(trackingNumber, newETD) {
    const query = `
      UPDATE tms_shipments 
      SET estimated_departure = $1, updated_at = NOW()
      WHERE tracking_number = $2
      RETURNING *
    `;

    try {
      const result = await tmsPool.query(query, [newETD, trackingNumber]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating shipment ETD:', error);
      throw error;
    }
  }
}

module.exports = TMSService;
