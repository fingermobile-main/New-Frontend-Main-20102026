import 'package:flutter/material.dart';

class ShareModal extends StatelessWidget {
  final String title;
  final String description;
  final String url;
  final String? imageUrl;

  const ShareModal({
    Key? key,
    required this.title,
    required this.description,
    required this.url,
    this.imageUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Share',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            
            SizedBox(height: 16),
            
            // Content preview
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  if (imageUrl != null)
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        color: Colors.grey[300],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          imageUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Icon(
                              Icons.image_not_supported,
                              color: Colors.grey[400],
                            );
                          },
                        ),
                      ),
                    ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 4),
                        Text(
                          description,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 4),
                        Text(
                          Uri.parse(url).host,
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.blue,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Share options
            Text(
              'Share to',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            
            SizedBox(height: 16),
            
            // Share options grid
            GridView.count(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              crossAxisCount: 4,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildShareOption(
                  Icons.sms,
                  'Message',
                  Colors.green,
                  () => _shareTo('message'),
                ),
                _buildShareOption(
                  Icons.mail,
                  'Email',
                  Colors.red[400]!,
                  () => _shareTo('email'),
                ),
                _buildShareOption(
                  Icons.facebook,
                  'Facebook',
                  Colors.blue[800]!,
                  () => _shareTo('facebook'),
                ),
                _buildShareOption(
                  Icons.cached,
                  'Copy Link',
                  Colors.grey,
                  () => _copyLink(context),
                ),
                _buildShareOption(
                  Icons.telegram,
                  'Telegram',
                  Colors.blue[300]!,
                  () => _shareTo('telegram'),
                ),
                _buildShareOption(
                  Icons.share,
                  'More',
                  Colors.grey[600]!,
                  () => _shareTo('more'),
                ),
                _buildShareOption(
                  Icons.whatsapp,
                  'WhatsApp',
                  Colors.green[600]!,
                  () => _shareTo('whatsapp'),
                ),
                _buildShareOption(
                  Icons.twitter,
                  'Twitter',
                  Colors.blue,
                  () => _shareTo('twitter'),
                ),
              ],
            ),
            
            SizedBox(height: 16),
            
            // Share via link
            Container(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => _copyLink(context),
                style: OutlinedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  side: BorderSide(color: Colors.blue),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Copy Link',
                  style: TextStyle(
                    color: Colors.blue,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareOption(
    IconData icon,
    String label,
    Color color,
    VoidCallback onTap,
  ) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: IconButton(
            icon: Icon(icon, color: color),
            onPressed: onTap,
          ),
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  void _shareTo(String platform) {
    // In a real app, this would initiate sharing to the specific platform
    print('Sharing to $platform');
    // Close the modal after sharing
    // Navigator.of(context).pop();
  }

  void _copyLink(BuildContext context) {
    // In a real app, this would copy the link to clipboard
    print('Copying link: $url');
    
    // Show snackbar to confirm
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Link copied to clipboard'),
        duration: Duration(seconds: 1),
      ),
    );
  }
}