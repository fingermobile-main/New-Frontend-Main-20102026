/* global console, module */
// MarketplaceItem model
class MarketplaceItem {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.seller_id = data.seller_id;
    this.image_url = data.image_url;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // Simulate saving to database
  async save() {
    // In a real implementation, this would save to a database
    console.log(`Saving marketplace,
item: ${this.title}`);
    return this;
  }

  // Simulate finding by ID
  static async findById(id) {
    // In a real implementation, this would query the database
    return new MarketplaceItem({id: id,
  title: "Digital Artwork",
  description: "Beautiful digital artwork",
  price: 50,
  seller_id: 1,
  image_url: "/images/artwork1.jpg"
    });
  }

  // Simulate finding all items
  static async findAll() {
    // In a real implementation, this would query the database
    return [
      new MarketplaceItem({id: 1,
  title: "Digital Artwork",
  description: "Beautiful digital artwork",
  price: 50,
  seller_id: 1,
  image_url: "/images/artwork1.jpg"
      }),
      new MarketplaceItem({id: 2,
  title: "Music Track",
  description: "Original music composition",
  price: 25,
  seller_id: 2,
  image_url: "/images/music1.jpg"
      })
    ];
  }
}

module.exports = MarketplaceItem;
