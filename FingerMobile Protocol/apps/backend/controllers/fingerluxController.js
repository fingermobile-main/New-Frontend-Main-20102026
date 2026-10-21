/**
 * FingerLux Controller
 * Handles premium content and luxury marketplace operations
 */

const FingerLuxContent = require('../models/FingerLuxContent');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const db = require('../db');
const getPool = () => db.pool || db;

class FingerLuxController {
  constructor() {
    this.getAll = (req, res) => res.json({ success: true, data: [] });
    this.getById = (req, res) => res.json({ success: true, data: {} });
    this.create = (req, res) => res.status(201).json({ success: true, data: {} });
    this.update = (req, res) => res.json({ success: true, data: {} });
    this.delete = (req, res) => res.json({ success: true, message: 'Deleted successfully' });

    this.getItems = async (req, res) => {
      try {
        const { category } = req.query;
        let query = 'SELECT * FROM fingerlux_items';
        const params = [];
        if (category) {
          query += ' WHERE category = $1';
          params.push(category);
        }
        const result = await getPool().query(query, params);
        return res.status(200).json({ success: true, data: result.rows || [] });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    };

    this.createItem = async (req, res) => {
      try {
        const userId = req.user?.id || 'default-user';
        const { title, description, price, brand, condition } = req.body;
        const result = await getPool().query(
          'INSERT INTO fingerlux_items (title, description, price, brand, condition, seller_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
          [title, description, price, brand, condition, userId]
        );
        return res.status(201).json({ success: true, data: result.rows?.[0] || { id: 'new-item-id', title } });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    };

    this.addReview = async (req, res) => {
      try {
        const itemId = req.params.id;
        const userId = req.user?.id || 'default-user';
        const { rating, review_text } = req.body;
        await getPool().query(
          'INSERT INTO fingerlux_reviews (item_id, user_id, rating, review_text, created_at) VALUES ($1, $2, $3, $4, NOW())',
          [itemId, userId, rating, review_text]
        );
        return res.status(201).json({ success: true, message: 'Review added successfully' });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    };
  }

  // Get all premium contents with filtering and pagination
  async getAllContents(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        contentType = '',
        accessLevel = '',
        isPublished = 'true',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (isPublished) {
        whereConditions.is_published = isPublished === 'true';
      }

      if (contentType) {
        whereConditions.content_type = contentType;
      }

      if (accessLevel) {
        whereConditions.access_level = accessLevel;
      }

      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const contents = await FingerLuxContent.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(contents.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        contents: contents.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalContents: contents.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching contents:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching contents',
        error: error.message
      });
    }
  }

  // Create a new premium content
  async createContent(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        categoryId,
        title,
        description,
        contentType,
        contentUrl,
        thumbnailUrl,
        durationSeconds,
        fileSizeMb,
        accessLevel,
        price,
        currency,
        isExclusive,
        exclusiveUntil
      } = req.body;

      const creatorId = req.user.id; // Assuming user is authenticated

      const content = await FingerLuxContent.create({
        category_id: categoryId,
        creator_id: creatorId,
        title,
        description,
        content_type: contentType,
        content_url: contentUrl,
        thumbnail_url: thumbnailUrl,
        duration_seconds: durationSeconds,
        file_size_mb: fileSizeMb,
        access_level: accessLevel,
        price,
        currency,
        is_published: true, // Default to published for now
        published_at: new Date(),
        is_exclusive: isExclusive || false,
        exclusive_until: isExclusive ? exclusiveUntil : null
      });

      res.status(201).json({
        success: true,
        message: 'Premium content created successfully',
        content
      });
    } catch (error) {
      logger.error('Error creating content:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating content',
        error: error.message
      });
    }
  }

  // Get a specific premium content by ID
  async getContentById(req, res) {
    try {
      const { id } = req.params;

      const content = await FingerLuxContent.findByPk(id, {
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        }]
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Increment view count
      await content.update({ view_count: content.view_count + 1 });

      res.status(200).json({
        success: true,
        content
      });
    } catch (error) {
      logger.error('Error fetching content:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching content',
        error: error.message
      });
    }
  }

  // Update a premium content
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      const content = await FingerLuxContent.findByPk(id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Check if user is the creator (only creator can update unless admin)
      const userRole = req.user.role;
      if (content.creator_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this content'
        });
      }

      await content.update(updates);

      res.status(200).json({
        success: true,
        message: 'Content updated successfully',
        content
      });
    } catch (error) {
      logger.error('Error updating content:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating content',
        error: error.message
      });
    }
  }

  // Delete a premium content
  async deleteContent(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const content = await FingerLuxContent.findByPk(id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Check if user is the creator (only creator can delete unless admin)
      const userRole = req.user.role;
      if (content.creator_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this content'
        });
      }

      await content.destroy();

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting content:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting content',
        error: error.message
      });
    }
  }

  // Get contents by access level
  async getContentsByAccessLevel(req, res) {
    try {
      const { accessLevel } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const contents = await FingerLuxContent.findAndCountAll({
        where: { access_level: accessLevel, is_published: true },
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(contents.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        contents: contents.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalContents: contents.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching contents by access level:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching contents by access level',
        error: error.message
      });
    }
  }

  // Get contents by creator
  async getContentsByCreator(req, res) {
    try {
      const { creatorId } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const contents = await FingerLuxContent.findAndCountAll({
        where: { creator_id: creatorId, is_published: true },
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(contents.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        contents: contents.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalContents: contents.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching contents by creator:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching contents by creator',
        error: error.message
      });
    }
  }

  // Get trending contents (most viewed)
  async getTrendingContents(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        days = 7
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const daysNum = parseInt(days);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      const contents = await FingerLuxContent.findAndCountAll({
        where: {
          is_published: true,
          created_at: { [Op.gte]: cutoffDate }
        },
        order: [['view_count', 'DESC']],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum
      });

      const totalPages = Math.ceil(contents.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        contents: contents.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalContents: contents.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching trending contents:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching trending contents',
        error: error.message
      });
    }
  }

  // =========================================================================
  // --- FINGERLUX ALL-IN-ONE SCHEDULING, BOOKING, STAFF & POS ENGINE ---
  // =========================================================================

  getServices(req, res) {
    try {
      const { type, locationId } = req.query;
      let list = inMemoryServices;
      if (type) list = list.filter((s) => s.type === type);
      if (locationId) list = list.filter((s) => s.locationId === locationId);
      return res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  createService(req, res) {
    try {
      const newService = {
        id: `srv-${Date.now()}`,
        name: req.body.name || 'Untitled Luxury Service',
        type: req.body.type || 'appointment',
        category: req.body.category || 'Concierge & Advisory',
        description: req.body.description || '',
        price: parseFloat(req.body.price) || 1000,
        durationMinutes: parseInt(req.body.durationMinutes) || 60,
        bufferBeforeMinutes: parseInt(req.body.bufferBeforeMinutes) || 15,
        bufferAfterMinutes: parseInt(req.body.bufferAfterMinutes) || 15,
        capacity: parseInt(req.body.capacity) || 1,
        delivery: req.body.delivery || 'in_person',
        locationId: req.body.locationId || 'loc-dubai',
        resourceIds: req.body.resourceIds || [],
        assignedStaffIds: req.body.assignedStaffIds || [],
        cancellationPolicy: req.body.cancellationPolicy || {
          freeCancelHours: 24,
          lateCancelFeePercent: 50,
          noShowFeePercent: 100
        },
        depositRequired: Boolean(req.body.depositRequired),
        depositPercent: parseFloat(req.body.depositPercent) || 0,
        intakeFormFields: req.body.intakeFormFields || [],
        tags: req.body.tags || ['Custom'],
        imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };
      inMemoryServices.unshift(newService);
      return res.status(201).json({ success: true, message: 'Service created successfully', data: newService });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  getBookings(req, res) {
    try {
      const { staffId, locationId, date, status } = req.query;
      let list = inMemoryBookings;
      if (staffId) list = list.filter((b) => b.staffId === staffId);
      if (locationId) list = list.filter((b) => b.locationId === locationId);
      if (date) list = list.filter((b) => b.date === date);
      if (status) list = list.filter((b) => b.attendanceStatus === status);
      return res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  createBooking(req, res) {
    try {
      const {
        serviceId,
        date,
        startTime,
        staffId,
        locationId,
        client,
        paymentRail,
        intakeResponses,
        depositOnly,
        notes
      } = req.body;

      const service = inMemoryServices.find((s) => s.id === serviceId) || {
        name: 'Custom Luxury Experience',
        price: 1000,
        durationMinutes: 60,
        type: 'appointment',
        delivery: 'in_person',
        depositPercent: 20
      };

      const [h, m] = (startTime || '10:00').split(':').map(Number);
      const totalMinutes = (isNaN(h) ? 10 : h) * 60 + (isNaN(m) ? 0 : m) + (service.durationMinutes || 60);
      const endH = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
      const endM = String(totalMinutes % 60).padStart(2, '0');
      const endTime = `${endH}:${endM}`;

      const totalAmount = service.price || 1000;
      const depositAmount = depositOnly ? Math.round(totalAmount * ((service.depositPercent || 20) / 100)) : totalAmount;

      const newBooking = {
        id: `book-${Date.now()}`,
        bookingCode: `FLX-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: serviceId || 'srv-custom',
        serviceName: service.name,
        serviceType: service.type || 'appointment',
        client: client || {
          id: `cli-${Date.now()}`,
          name: 'Distinguished Client',
          email: 'guest@fingerlux.protocol',
          phone: '+1 800 589 8478',
          vipTier: 'Sovereign'
        },
        staffId: staffId || 'staff-elena',
        staffName: staffId === 'staff-marcus' ? 'Marcus Sterling' : 'Dr. Elena Rostova',
        locationId: locationId || 'loc-dubai',
        locationName: 'Dubai Marina Sovereign Flagship',
        resourceIds: service.resourceIds || [],
        resourceNames: ['Sovereign Suite / Facility'],
        delivery: service.delivery || 'in_person',
        virtualMeetingUrl: service.delivery === 'online' ? 'https://zoom.us/j/flx-room' : undefined,
        date: date || new Date().toISOString().split('T')[0],
        startTime: startTime || '10:00',
        endTime,
        durationMinutes: service.durationMinutes || 60,
        attendanceStatus: 'booked',
        paymentStatus: depositOnly ? 'deposit_paid' : 'paid_full',
        paymentRail: paymentRail || 'fic',
        totalAmount,
        depositAmount,
        feeCharged: 0,
        intakeResponses: intakeResponses || {},
        notes: notes || 'Confirmed via FingerLux Scheduling Engine',
        createdAt: new Date().toISOString()
      };

      inMemoryBookings.unshift(newBooking);
      return res.status(201).json({ success: true, message: 'Reservation confirmed', data: newBooking });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  updateAttendance(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const booking = inMemoryBookings.find((b) => b.id === id || b.bookingCode === id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.attendanceStatus = status;
      if (status === 'checked_in') {
        booking.checkedInAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (status === 'no_show') {
        booking.feeCharged = booking.totalAmount;
        booking.paymentStatus = 'fee_charged';
      } else if (status === 'late_cancelled') {
        booking.feeCharged = Math.round(booking.totalAmount * 0.5);
        booking.paymentStatus = 'fee_charged';
      }

      return res.json({
        success: true,
        message: `Attendance status updated to ${status}`,
        data: booking
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  getStaff(req, res) {
    return res.json({ success: true, count: inMemoryStaff.length, data: inMemoryStaff });
  }

  updateStaffHours(req, res) {
    const { id } = req.params;
    const staff = inMemoryStaff.find((s) => s.id === id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    if (req.body.workingHours) staff.workingHours = req.body.workingHours;
    if (req.body.calendarSync) staff.calendarSync = { ...staff.calendarSync, ...req.body.calendarSync };
    return res.json({ success: true, message: 'Staff availability updated', data: staff });
  }

  getResources(req, res) {
    return res.json({ success: true, count: inMemoryResources.length, data: inMemoryResources });
  }

  getLocations(req, res) {
    return res.json({ success: true, count: inMemoryLocations.length, data: inMemoryLocations });
  }

  getBlockedSlots(req, res) {
    return res.json({ success: true, count: inMemoryBlockedSlots.length, data: inMemoryBlockedSlots });
  }

  createBlockedSlot(req, res) {
    const newSlot = {
      id: `blk-${Date.now()}`,
      date: req.body.date || new Date().toISOString().split('T')[0],
      startTime: req.body.startTime || '12:00',
      endTime: req.body.endTime || '13:00',
      reason: req.body.reason || 'Staff Maintenance & Protocol Buffer',
      locationId: req.body.locationId,
      resourceId: req.body.resourceId
    };
    inMemoryBlockedSlots.push(newSlot);
    return res.status(201).json({ success: true, message: 'Time slot blocked successfully', data: newSlot });
  }

  getWaitlist(req, res) {
    return res.json({ success: true, count: inMemoryWaitlist.length, data: inMemoryWaitlist });
  }

  addToWaitlist(req, res) {
    const newWait = {
      id: `wait-${Date.now()}`,
      serviceId: req.body.serviceId,
      serviceName: req.body.serviceName || 'Luxury Experience',
      clientName: req.body.clientName || 'VIP Guest',
      clientEmail: req.body.clientEmail || 'vip@protocol.com',
      clientPhone: req.body.clientPhone || '+1 800 589 8478',
      date: req.body.date || new Date().toISOString().split('T')[0],
      preferredTime: req.body.preferredTime || 'Afternoon',
      status: 'waiting',
      addedAt: 'Just now'
    };
    inMemoryWaitlist.unshift(newWait);
    return res.status(201).json({ success: true, message: 'Added to waitlist', data: newWait });
  }

  promoteWaitlist(req, res) {
    const { id } = req.params;
    const item = inMemoryWaitlist.find((w) => w.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Waitlist item not found' });
    item.status = 'promoted';
    return res.json({ success: true, message: 'Waitlist candidate promoted to active booking', data: item });
  }

  processPOS(req, res) {
    const { amount, currency = 'FIC', method = 'tap_to_pay', customerRef } = req.body;
    const tx = {
      id: `pos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      amount: parseFloat(amount) || 0,
      currency,
      method,
      terminalId: 'FLX-NFC-TERMINAL-01',
      authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptNumber: `RCP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerRef: customerRef || 'Walk-in VIP Client',
      status: 'approved'
    };
    return res.json({ success: true, message: 'Payment authorized and settled', data: tx });
  }

  createInvoice(req, res) {
    const { clientName, clientEmail, amount, currency = 'FIC', bookingCode } = req.body;
    const inv = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-FLX-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingCode: bookingCode || `FLX-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: clientName || 'Sovereign Client',
      clientEmail: clientEmail || 'client@fingerlux.protocol',
      amount: parseFloat(amount) || 1000,
      currency,
      status: 'unpaid',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      paymentLink: `https://fingerlux.protocol/pay/inv-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString()
    };
    return res.status(201).json({ success: true, message: 'Invoice issued', data: inv });
  }

  generateAISetup(req, res) {
    const { goal } = req.body;
    const suggestions = {
      suggestedServiceName: goal && goal.includes('wellness')
        ? 'Signature Sovereign Cellular Rejuvenation'
        : 'Executive Sovereign Advisory & Lifestyle Masterplan',
      suggestedType: 'appointment',
      suggestedDurationMinutes: 90,
      suggestedBufferMinutes: 20,
      suggestedPriceFic: 1850,
      depositRecommendation: '30% upfront deposit recommended to minimize no-show exposure',
      cancellationPolicy: {
        freeCancelHours: 24,
        lateCancelFeePercent: 50,
        noShowFeePercent: 100,
        rationale: 'Protects therapist and facility allocation time while accommodating high-tier clients.'
      },
      recommendedIntakeQuestions: [
        'Specific security clearance or diplomatic handling required?',
        'Preferred catering & beverage hospitality preferences upon arrival'
      ]
    };
    return res.json({ success: true, data: suggestions });
  }

  getPrograms(req, res) {
    return res.json({ success: true, count: inMemoryPrograms.length, data: inMemoryPrograms });
  }
}

// In-Memory Data Stores for FingerLux
const inMemoryLocations = [
  { id: 'loc-dubai', name: 'Dubai Marina Sovereign Flagship', city: 'Dubai, UAE', address: 'Level 54, Sovereign Tower, Dubai Marina Walk', timezone: 'Asia/Dubai (UTC+4)', contactEmail: 'dubai@fingerlux.protocol', contactPhone: '+971 4 800 5899', isVirtual: false, badge: 'Middle East HQ' },
  { id: 'loc-london', name: 'London Mayfair Protocol Club', city: 'London, UK', address: '34 Berkeley Square, Mayfair, London W1J 5AW', timezone: 'Europe/London (UTC+1)', contactEmail: 'london@fingerlux.protocol', contactPhone: '+44 20 7946 0912', isVirtual: false, badge: 'European HQ' },
  { id: 'loc-lagos', name: 'Lagos Victoria Island Haven', city: 'Lagos, Nigeria', address: 'Plot 12 Ozumba Mbadiwe Avenue, Victoria Island', timezone: 'Africa/Lagos (UTC+1)', contactEmail: 'lagos@fingerlux.protocol', contactPhone: '+234 1 800 3464', isVirtual: false, badge: 'West Africa Hub' },
  { id: 'loc-nyc', name: 'New York 5th Avenue Sovereign Salon', city: 'New York, USA', address: '740 5th Avenue, Penthouse Level, Manhattan, NY 10019', timezone: 'America/New_York (UTC-4)', contactEmail: 'nyc@fingerlux.protocol', contactPhone: '+1 212 555 0198', isVirtual: false, badge: 'Americas Hub' },
  { id: 'loc-virtual', name: 'Virtual Global Metaverse & Video Bridge', city: 'Global Encrypted Hub', address: 'Encrypted Ka-Band Zoom / Google Meet Sovereign Tunnel', timezone: 'Universal (UTC)', contactEmail: 'virtual@fingerlux.protocol', contactPhone: '+1 800 589 8478', isVirtual: true, badge: 'Worldwide 24/7' }
];

const inMemoryResources = [
  { id: 'res-penthouse-salon', name: 'Sovereign Penthouse Salon A', type: 'room', locationId: 'loc-dubai', capacity: 10, isAvailable: true, description: 'Private 360° panoramic skyline lounge', icon: '🏙️' },
  { id: 'res-ocean-spa', name: 'Oceanfront Hydro-Spa Pavilion', type: 'room', locationId: 'loc-lagos', capacity: 4, isAvailable: true, description: 'Private hydrotherapy pool and cedarwood sauna', icon: '🌊' },
  { id: 'res-mayfair-boardroom', name: 'High Council Sovereign Boardroom', type: 'room', locationId: 'loc-london', capacity: 20, isAvailable: true, description: 'Bespoke walnut table and 8K telepresence suite', icon: '🏛️' },
  { id: 'res-maybach-escort', name: 'Armored Mercedes-Maybach S680 Escort Unit', type: 'vehicle', locationId: 'loc-dubai', capacity: 3, isAvailable: true, description: 'VR9 ballistic rated chassis with protocol chauffeur', icon: '🚘' },
  { id: 'res-studio-rig', name: 'Ka-Band 4K Broadcast & Streaming Rig', type: 'equipment', locationId: 'loc-virtual', capacity: 8, isAvailable: true, description: 'Cinema cameras and zero-latency satellite link', icon: '🎥' }
];

const inMemoryStaff = [
  { id: 'staff-elena', name: 'Dr. Elena Rostova', role: 'Master Concierge', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', email: 'elena.rostova@fingerlux.protocol', phone: '+971 50 123 4567', assignedServiceIds: ['srv-concierge-consult', 'srv-rejuvenation-therapy'], locationIds: ['loc-dubai', 'loc-virtual'], workingHours: { Monday: { start: '09:00', end: '19:00', isWorking: true }, Tuesday: { start: '09:00', end: '19:00', isWorking: true }, Wednesday: { start: '09:00', end: '19:00', isWorking: true }, Thursday: { start: '09:00', end: '19:00', isWorking: true }, Friday: { start: '09:00', end: '20:00', isWorking: true }, Saturday: { start: '10:00', end: '18:00', isWorking: true }, Sunday: { start: '11:00', end: '16:00', isWorking: false } }, calendarSync: { googleCalendar: true, outlookCalendar: true, appleCalendar: false, lastSyncedAt: 'Just now' }, permissions: { canViewFinances: true, canEditSchedule: true, canIssueRefunds: true, canManageClients: true } },
  { id: 'staff-marcus', name: 'Marcus Sterling', role: 'Senior Specialist', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', email: 'marcus.sterling@fingerlux.protocol', phone: '+44 7700 900123', assignedServiceIds: ['srv-horology-fitting', 'srv-gemology-appraisal'], locationIds: ['loc-london', 'loc-nyc'], workingHours: { Monday: { start: '09:00', end: '19:00', isWorking: true }, Tuesday: { start: '09:00', end: '19:00', isWorking: true }, Wednesday: { start: '09:00', end: '19:00', isWorking: true }, Thursday: { start: '09:00', end: '19:00', isWorking: true }, Friday: { start: '09:00', end: '20:00', isWorking: true }, Saturday: { start: '10:00', end: '18:00', isWorking: true }, Sunday: { start: '11:00', end: '16:00', isWorking: false } }, calendarSync: { googleCalendar: true, outlookCalendar: false, appleCalendar: true, lastSyncedAt: '3 mins ago' }, permissions: { canViewFinances: false, canEditSchedule: true, canIssueRefunds: false, canManageClients: true } },
  { id: 'staff-aisha', name: 'Aisha Al-Mansoor', role: 'Lead Instructor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', email: 'aisha.almansoor@fingerlux.protocol', phone: '+971 52 987 6543', assignedServiceIds: ['srv-yacht-masterclass', 'srv-aviation-residency', 'srv-protocol-wealth'], locationIds: ['loc-dubai', 'loc-virtual'], workingHours: { Monday: { start: '09:00', end: '19:00', isWorking: true }, Tuesday: { start: '09:00', end: '19:00', isWorking: true }, Wednesday: { start: '09:00', end: '19:00', isWorking: true }, Thursday: { start: '09:00', end: '19:00', isWorking: true }, Friday: { start: '09:00', end: '20:00', isWorking: true }, Saturday: { start: '10:00', end: '18:00', isWorking: true }, Sunday: { start: '11:00', end: '16:00', isWorking: false } }, calendarSync: { googleCalendar: true, outlookCalendar: true, appleCalendar: true, lastSyncedAt: '5 mins ago' }, permissions: { canViewFinances: true, canEditSchedule: true, canIssueRefunds: false, canManageClients: true } }
];

const inMemoryServices = [
  { id: 'srv-concierge-consult', name: 'Private Sovereign Concierge & Lifestyle Consultation', type: 'appointment', category: 'Concierge & Advisory', description: '1-on-1 private confidential session to map global mobility and vaulting.', price: 1200, durationMinutes: 60, bufferBeforeMinutes: 15, bufferAfterMinutes: 15, capacity: 1, delivery: 'hybrid', locationId: 'loc-dubai', resourceIds: ['res-penthouse-salon'], assignedStaffIds: ['staff-elena'], cancellationPolicy: { freeCancelHours: 24, lateCancelFeePercent: 50, noShowFeePercent: 100 }, depositRequired: true, depositPercent: 20, intakeFormFields: [{ id: 'f1', label: 'Primary Consultation Objective', type: 'select', required: true, options: ['Global Mobility & Visas', 'Ultra-Luxury Rental', 'Private Aviation & Yachting', 'Vault & High Horology'] }], tags: ['Private', 'VIP 1-on-1'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', virtualMeetingUrl: 'https://meet.google.com/flx-sovereign-consult' },
  { id: 'srv-horology-fitting', name: 'Haute Horology & Master Vault Fitting', type: 'appointment', category: 'Luxury Goods & Fitting', description: 'Bespoke micro-calibration of celestial tourbillons in secure clean room.', price: 2500, durationMinutes: 90, bufferBeforeMinutes: 30, bufferAfterMinutes: 30, capacity: 1, delivery: 'in_person', locationId: 'loc-london', resourceIds: ['res-mayfair-boardroom'], assignedStaffIds: ['staff-marcus'], cancellationPolicy: { freeCancelHours: 48, lateCancelFeePercent: 60, noShowFeePercent: 100 }, depositRequired: true, depositPercent: 30, intakeFormFields: [], tags: ['Horology', 'White Glove'], imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { id: 'srv-yacht-masterclass', name: 'Elite Superyacht Coastal Command & Protocol Class', type: 'class', category: 'Maritime & Aviation', description: 'Cohort seminar covering Mediterranean anchorages and satellite comms.', price: 1500, durationMinutes: 120, bufferBeforeMinutes: 20, bufferAfterMinutes: 20, capacity: 12, delivery: 'hybrid', locationId: 'loc-dubai', resourceIds: ['res-penthouse-salon'], assignedStaffIds: ['staff-aisha'], cancellationPolicy: { freeCancelHours: 48, lateCancelFeePercent: 50, noShowFeePercent: 100 }, depositRequired: true, depositPercent: 50, intakeFormFields: [], tags: ['Group Class', 'Superyacht'], imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?w=800&auto=format&fit=crop&q=80', virtualMeetingUrl: 'https://meet.google.com/flx-yacht-masterclass' },
  { id: 'srv-aviation-residency', name: '4-Week Private Aviation Command & Protocol Fleet Mastery', type: 'course', category: 'Maritime & Aviation', description: 'Multi-session executive certification on fractional ownership and security.', price: 8500, durationMinutes: 180, bufferBeforeMinutes: 30, bufferAfterMinutes: 30, capacity: 8, delivery: 'hybrid', locationId: 'loc-dubai', resourceIds: ['res-penthouse-salon', 'res-studio-rig'], assignedStaffIds: ['staff-aisha'], cancellationPolicy: { freeCancelHours: 72, lateCancelFeePercent: 50, noShowFeePercent: 100 }, depositRequired: true, depositPercent: 40, intakeFormFields: [], tags: ['4-Week Course', 'Multi-Session'], imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80', virtualMeetingUrl: 'https://meet.google.com/flx-aviation-course' }
];

const inMemoryBookings = [
  { id: 'book-001', bookingCode: 'FLX-8041', serviceId: 'srv-concierge-consult', serviceName: 'Private Sovereign Concierge & Lifestyle Consultation', serviceType: 'appointment', client: { id: 'cli-01', name: 'Sir Reginald Vance', email: 'reginald.vance@sovereign.co.uk', phone: '+44 7911 123456', vipTier: 'Sovereign' }, staffId: 'staff-elena', staffName: 'Dr. Elena Rostova', locationId: 'loc-dubai', locationName: 'Dubai Marina Sovereign Flagship', resourceIds: ['res-penthouse-salon'], resourceNames: ['Sovereign Penthouse Salon A'], delivery: 'in_person', date: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:00', durationMinutes: 60, attendanceStatus: 'checked_in', checkedInAt: '09:54 AM', paymentStatus: 'paid_full', paymentRail: 'fic', totalAmount: 1200, depositAmount: 1200, feeCharged: 0, intakeResponses: {}, notes: 'Escort arriving via Maybach', createdAt: new Date().toISOString() },
  { id: 'book-002', bookingCode: 'FLX-8042', serviceId: 'srv-horology-fitting', serviceName: 'Haute Horology & Master Vault Fitting', serviceType: 'appointment', client: { id: 'cli-02', name: 'Countess Vivian Chen', email: 'vivian.chen@chenholdings.sg', phone: '+65 9123 4567', vipTier: 'Black Diamond' }, staffId: 'staff-marcus', staffName: 'Marcus Sterling', locationId: 'loc-london', locationName: 'London Mayfair Protocol Club', resourceIds: ['res-mayfair-boardroom'], resourceNames: ['High Council Sovereign Boardroom'], delivery: 'in_person', date: new Date().toISOString().split('T')[0], startTime: '14:00', endTime: '15:30', durationMinutes: 90, attendanceStatus: 'booked', paymentStatus: 'deposit_paid', paymentRail: 'card', totalAmount: 2500, depositAmount: 750, feeCharged: 0, intakeResponses: {}, notes: 'Deposit received', createdAt: new Date().toISOString() }
];

const inMemoryBlockedSlots = [
  { id: 'blk-001', date: new Date().toISOString().split('T')[0], startTime: '12:00', endTime: '13:00', reason: 'Sovereign Penthouse Sanitization Buffer', locationId: 'loc-dubai' }
];

const inMemoryWaitlist = [
  { id: 'wait-01', serviceId: 'srv-horology-fitting', serviceName: 'Haute Horology & Master Vault Fitting', clientName: 'Alexander Von Berg', clientEmail: 'alex@vonberg-estate.de', clientPhone: '+49 171 2345678', date: new Date().toISOString().split('T')[0], preferredTime: '14:00 - 16:00', status: 'waiting', addedAt: '1 hour ago' }
];

const inMemoryPrograms = [
  { id: 'prog-01', name: 'FingerLux Black Card Sovereign VIP Membership', type: 'membership', description: 'All-inclusive monthly protocol privileges: guaranteed zero-wait bookings.', price: 5000, interval: 'monthly', perks: ['Guaranteed VIP Clearance', 'Unlimited 24/7 Butler Detail'], thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80', activeSubscribers: 142 }
];

module.exports = new FingerLuxController();

