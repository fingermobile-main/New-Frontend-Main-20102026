const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { Op } = require('sequelize');

// Require models inside the functions to avoid circular dependencies
let User, Post;

class CsvImportService {
  constructor() {
    // Fixed path construction
    this.csvDirectory = path.join(__dirname, '../../../../dev files 13042026/Development Documents 17122025/csv docs 17122025');
  }

  /**
   * Import all CSV files into respective database tables
   */
  async importAllCsvData() {
    try {
      logger.info('Starting CSV data import process...');
      
      // Import members data first (since posts depend on users)
      await this.importMembersData();
      
      // Import blog posts data after users are created
      await this.importBlogPostsData();
      
      // Import forum categories data
      await this.importForumCategoriesData();
      
      // Import other data files
      await this.importOtherData();
      
      logger.info('CSV data import process completed successfully!');
      return true;
    } catch (error) {
      logger.error('Error during CSV import:', error);
      throw error;
    }
  }

  /**
   * Import members data from CSV
   */
  async importMembersData() {
    // Load the User model when needed
    if (!User) {
      User = require('../models/user');
    }
    
    try {
      logger.info('Importing members data...');
      
      // Find the members CSV file
      const membersFile = path.join(this.csvDirectory, 'FingerMobile FullData Members.csv');
      
      if (!fs.existsSync(membersFile)) {
        logger.info(`Members CSV file not found: ${membersFile}`);
        // Try alternative file name
        membersFile = path.join(this.csvDirectory, 'FingerMobile FullData Members (1).csv');
        if (!fs.existsSync(membersFile)) {
          throw new Error(`Members CSV file not found: ${membersFile}`);
        }
      }
      
      const csvContent = fs.readFileSync(membersFile, 'utf8');
      const parsedData = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true
      });
      
      logger.info(`Found ${parsedData.data.length} member records to process`);
      
      let importedCount = 0;
      let skippedCount = 0;
      
      for (const row of parsedData.data) {
        try {
          // Transform CSV row to User model format
          const userData = this.transformMemberRow(row);
          
          // Skip rows with invalid data (empty firstName and lastName)
          if (!userData.firstName && !userData.lastName) {
            logger.info(`Skipping user with no name: ${userData.email}`);
            skippedCount++;
            continue;
          }
          
          // Check if user already exists by email
          const existingUser = await User.findOne({
            where: { email: userData.email }
          });
          
          if (existingUser) {
            // Update existing user
            await User.update(userData, {
              where: { email: userData.email }
            });
            logger.info(`Updated existing user: ${userData.email}`);
          } else {
            // Create new user
            await User.create(userData);
            logger.info(`Created new user: ${userData.email}`);
          }
          
          importedCount++;
        } catch (rowError) {
          logger.error(`Error processing member row:`, rowError);
          skippedCount++;
        }
      }
      
      logger.info(`Members import completed. Imported: ${importedCount} Skipped: ${skippedCount}`);
      return { imported: importedCount, skipped: skippedCount };
    } catch (error) {
      logger.error('Error importing members data:', error);
      throw error;
    }
  }

  /**
   * Transform a CSV row to match the User model
   */
  transformMemberRow(row) {
    // Generate a default password for all users from CSV using environment variable
    const defaultPassword = process.env.DEFAULT_CSV_USER_PASSWORD || 'DefaultPass123!';
    
    // Validate that we have a password
    if (!defaultPassword) {
      logger.warn('No default password set. Using fallback password.');
    }
    
    // Ensure first and last names are valid
    let firstName = row['First Name'] || row.firstName || '';
    let lastName = row['Last Name'] || row.lastName || '';
    
    // If both are empty, use a default value
    if (!firstName && !lastName) {
      firstName = 'User';
      lastName = 'Unknown';
    } else if (!firstName) {
      firstName = 'User';
    } else if (!lastName) {
      lastName = 'Unknown';
    }
    
    return {
      email: row['Login Email'] || row.email || '',
      username: row['Slug'] || row.slug || this.generateUsernameFromEmail(row['Login Email'] || row.email || ''),
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: row['Birthdate'] || row.dateOfBirth || null,
      phoneNumber: row['Phone'] || row.phone || '',
      bio: row['About (Plain Text)'] || row.aboutPlainText || '',
      profilePicture: row['Profile Photo'] || row.profilePhoto || '',
      coverPhoto: row['Cover Photo'] || row.coverPhoto || '',
      password: defaultPassword, // Set a default password from environment variable
      isActive: (row['Activity Status'] || row.activityStatus || 'INACTIVE').toLowerCase() === 'active',
      isVerified: (row['Status'] || row.status || 'PENDING').toLowerCase() === 'approved',
      createdAt: new Date(row['Creation Date'] || row.creationDate || Date.now()),
      lastLogin: new Date(row['Last Login Date'] || row.lastLoginDate || Date.now()),
      privacySettings: {
        profileVisibility: (row['Privacy Status'] || row.privacyStatus || 'PUBLIC').toLowerCase()
      },
      reputationScore: 50, // Default reputation score
      totalGems: 0 // Default gems
    };
  }

  /**
   * Import blog posts data from CSV
   */
  async importBlogPostsData() {
    // Load the Post model when needed
    if (!Post) {
      Post = require('../models/post');
    }
    
    try {
      logger.info('Importing blog posts data...');
      
      // Find the blog posts CSV file
      const postsFile = path.join(this.csvDirectory, 'FingerMobile Blog Posts.csv');
      
      if (!fs.existsSync(postsFile)) {
        logger.info('Blog posts CSV file not found, skipping...');
        return { imported: 0, skipped: 0 };
      }
      
      const csvContent = fs.readFileSync(postsFile, 'utf8');
      const parsedData = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true
      });
      
      logger.info(`Found ${parsedData.data.length} blog post records to process`);
      
      let importedCount = 0;
      let skippedCount = 0;
      
      // Get all existing users to link posts to valid authors
      const allUsers = await User.findAll({
        attributes: ['id', 'email']
      });
      
      for (const row of parsedData.data) {
        try {
          // Transform CSV row to Post model format
          const postData = this.transformBlogPostRow(row, allUsers);
          
          // Check if post already exists by slug or URL
          const existingPost = await Post.findOne({
            where: {
              [Op.or]: [
                { slug: postData.slug },
                { url: postData.url }
              ]
            }
          });
          
          if (existingPost) {
            // Update existing post
            await Post.update(postData, {
              where: { id: existingPost.id }
            });
            logger.info(`Updated existing post: ${postData.title}`);
          } else {
            // Create new post
            await Post.create(postData);
            logger.info(`Created new post: ${postData.title}`);
          }
          
          importedCount++;
        } catch (rowError) {
          logger.error(`Error processing blog post row:`, rowError);
          skippedCount++;
        }
      }
      
      logger.info(`Blog posts import completed. Imported: ${importedCount} Skipped: ${skippedCount}`);
      return { imported: importedCount, skipped: skippedCount };
    } catch (error) {
      logger.error('Error importing blog posts data:', error);
      throw error;
    }
  }

  /**
   * Transform a blog post CSV row
   */
  transformBlogPostRow(row, allUsers) {
    // If we have users, pick the first one as the author, otherwise use a default ID
    let authorId = '16770c18-8547-4eac-ad5f-3e144f6e570c'; // Default fallback
    
    if (allUsers && allUsers.length > 0) {
      // Use the first user as the author for now
      authorId = allUsers[0].id;
    }
    
    return {
      title: row.Title || row.title || 'Untitled Post',
      content: row['Rich Content'] || row['Plain Content'] || row.content || '',
      excerpt: row.Excerpt || row.excerpt || '',
      authorId: authorId,
      slug: row.Slug || row.slug || this.generateSlugFromTitle(row.Title || row.title || 'untitled'),
      viewCount: parseInt(row['View Count']) || 0,
      commentCount: parseInt(row['Comment Count']) || 0,
      likeCount: parseInt(row['Like Count']) || 0,
      publishedDate: new Date(row['Published Date'] || Date.now()),
      isFeatured: row.Featured || false,
      isPinned: row.Pinned || false,
      tags: Array.isArray(row.Tags) ? row.Tags : (typeof row.Tags === 'string' ? JSON.parse(row.Tags || '[]') : []),
      categories: Array.isArray(row.Categories) ? row.Categories : (typeof row.Categories === 'string' ? JSON.parse(row.Categories || '[]') : []),
      coverImage: row['Cover Image'] || row.coverImage || '',
      language: row.Language || 'en',
      url: row['Post Page URL'] || row.url || '',
      isApproved: true, // Assuming imported posts are approved
      moderationStatus: 'approved'
    };
  }

  /**
   * Import forum categories data from CSV
   */
  async importForumCategoriesData() {
    try {
      logger.info('Importing forum categories data...');
      
      // Find the forum categories CSV file
      const categoriesFile = path.join(this.csvDirectory, 'FingerMobile Forum Categories (1).csv');
      
      if (!fs.existsSync(categoriesFile)) {
        logger.info('Forum categories CSV file not found, skipping...');
        return { imported: 0, skipped: 0 };
      }
      
      const csvContent = fs.readFileSync(categoriesFile, 'utf8');
      const parsedData = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true
      });
      
      logger.info(`Found ${parsedData.data.length} forum category records to process`);
      
      let importedCount = 0;
      let skippedCount = 0;
      
      for (const row of parsedData.data) {
        try {
          // Transform CSV row to category format
          const categoryData = this.transformForumCategoryRow(row);
          
          // For now, we'll just log the category data since we don't have a specific model
          logger.info(`Processed forum category: ${categoryData.name}`);
          
          importedCount++;
        } catch (rowError) {
          logger.error(`Error processing forum category row:`, rowError);
          skippedCount++;
        }
      }
      
      logger.info(`Forum categories import completed. Processed: ${importedCount} Skipped: ${skippedCount}`);
      return { imported: importedCount, skipped: skippedCount };
    } catch (error) {
      logger.error('Error importing forum categories data:', error);
      throw error;
    }
  }

  /**
   * Transform a forum category CSV row
   */
  transformForumCategoryRow(row) {
    return {
      name: row.Name || row.name || 'Unnamed Category',
      description: row.Description || row.description || '',
      slug: row.Slug || row.slug || this.generateSlugFromTitle(row.Name || row.name || 'unnamed-category'),
      postCount: parseInt(row['Post Count']) || 0,
      viewCount: parseInt(row['Post View Count']) || 0,
      rank: parseInt(row.Rank) || 0,
      url: row['Page URL'] || row.url || '',
      parentId: row['Parent ID'] || row.parentId || null,
      headerTitle: row['Header Title'] || row.headerTitle || '',
      headerType: row['Header Type'] || row.headerType || 'TEXT',
      headerTextColor: row['Header Text Color'] || row.headerTextColor || '#FFFFFF',
      headerBackgroundColor: row['Header Background Color'] || row.headerBackgroundColor || '#FFFFFF',
      headerImageOverlayColor: row['Header Image Overlay Color'] || row.headerImageOverlayColor || '#000000',
      headerImage: row['Header Image'] || row.headerImage || '',
      isWriteProtected: row['Write Protected'] || row.isWriteProtected || false
    };
  }

  /**
   * Import other CSV data files
   */
  async importOtherData() {
    try {
      logger.info('Importing other CSV data files...');
      
      const otherFiles = [
        'Comments.csv',
        'FingerMobile Blog Categories.csv',
        'FingerMobile Blog Tags.csv',
        'Posts.csv'
      ];
      
      let totalImported = 0;
      let totalSkipped = 0;
      
      // This is a placeholder for future implementation
      // Currently just logs the files that would be processed
      for (const fileName of otherFiles) {
        const filePath = path.join(this.csvDirectory, fileName);
        
        if (!fs.existsSync(filePath)) {
          logger.info(`File does not exist, skipping: ${fileName}`);
          continue;
        }
        
        try {
          // In a real implementation, you would read and process the CSV
          // and insert/update PostgreSQL records accordingly
          logger.info(`Would process file: ${fileName}`);
          totalImported++;
        } catch (fileError) {
          logger.error(`Error processing ${fileName}:`, fileError);
          totalSkipped++;
        }
      }
      
      logger.info(`Other data import completed. Processed: ${totalImported} Skipped: ${totalSkipped}`);
      return { imported: totalImported, skipped: totalSkipped };
    } catch (error) {
      logger.error('Error importing other data:', error);
      throw error;
    }
  }

  /**
   * Helper function to generate username from email
   */
  generateUsernameFromEmail(email) {
    if (!email) return 'user_' + Date.now();
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * Helper function to generate slug from title
   */
  generateSlugFromTitle(title) {
    if (!title) return 'untitled-' + Date.now();
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  /**
   * Close PostgreSQL connection
   */
  async close() {
    await this.pgClient.end();
    logger.info('PostgreSQL connection closed');
  }
}

module.exports = CsvImportService;