import 'package:flutter/material.dart';

class BusinessOfficesPage extends StatefulWidget {
  const BusinessOfficesPage({super.key});

  @override
  State<BusinessOfficesPage> createState() => _BusinessOfficesPageState();
}

class _BusinessOfficesPageState extends State<BusinessOfficesPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<BusinessOffice> _offices = [];
  List<BusinessOffice> _filteredOffices = [];
  String _searchQuery = '';
  String _selectedRegion = 'All Regions';

  @override
  void initState() {
    super.initState();
    _loadBusinessOffices();
  }

  Future<void> _loadBusinessOffices() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock business offices data
      setState(() {
        _offices = [
          BusinessOffice(
            id: 1,
            name: 'Headquarters',
            address: '123 Main Street, New York, NY 10001',
            phone: '+1 (555) 123-4567',
            email: 'hq@fingermobile.com',
            region: 'North America',
            isOpen: true,
            openingHours: 'Mon-Fri: 9AM-6PM',
            coordinates: const Coordinates(40.7128, -74.0060),
          ),
          BusinessOffice(
            id: 2,
            name: 'European Office',
            address: '456 Market Square, London, UK SW1A 1AA',
            phone: '+44 20 1234 5678',
            email: 'eu@fingermobile.com',
            region: 'Europe',
            isOpen: true,
            openingHours: 'Mon-Fri: 9AM-5PM',
            coordinates: const Coordinates(51.5074, -0.1278),
          ),
          BusinessOffice(
            id: 3,
            name: 'Asia Pacific Office',
            address: '789 Business District, Singapore 018902',
            phone: '+65 1234 5678',
            email: 'apac@fingermobile.com',
            region: 'Asia Pacific',
            isOpen: false,
            openingHours: 'Mon-Fri: 10AM-7PM',
            coordinates: const Coordinates(1.3521, 103.8198),
          ),
          BusinessOffice(
            id: 4,
            name: 'West Coast Office',
            address: '101 Tech Boulevard, San Francisco, CA 94102',
            phone: '+1 (415) 987-6543',
            email: 'westcoast@fingermobile.com',
            region: 'North America',
            isOpen: true,
            openingHours: 'Mon-Fri: 8AM-5PM',
            coordinates: const Coordinates(37.7749, -122.4194),
          ),
        ];
        
        _filteredOffices = List.from(_offices);
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load business offices. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _filterOffices() {
    setState(() {
      _filteredOffices = _offices.where((office) {
        bool matchesSearch = _searchQuery.isEmpty ||
            office.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
            office.address.toLowerCase().contains(_searchQuery.toLowerCase());
        
        bool matchesRegion = _selectedRegion == 'All Regions' ||
            office.region == _selectedRegion;
        
        return matchesSearch && matchesRegion;
      }).toList();
    });
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
    });
    _filterOffices();
  }

  void _onRegionChanged(String? region) {
    setState(() {
      _selectedRegion = region ?? 'All Regions';
    });
    _filterOffices();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Offices'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadBusinessOffices,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              border: Border(bottom: BorderSide(color: Colors.grey.shade300)),
            ),
            child: Column(
              children: [
                TextField(
                  decoration: const InputDecoration(
                    hintText: 'Search offices...',
                    prefixIcon: Icon(Icons.search),
                    border: OutlineInputBorder(),
                  ),
                  onChanged: _onSearchChanged,
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: _selectedRegion,
                  items: const [
                    DropdownMenuItem(value: 'All Regions', child: Text('All Regions')),
                    DropdownMenuItem(value: 'North America', child: Text('North America')),
                    DropdownMenuItem(value: 'Europe', child: Text('Europe')),
                    DropdownMenuItem(value: 'Asia Pacific', child: Text('Asia Pacific')),
                  ],
                  onChanged: _onRegionChanged,
                  decoration: const InputDecoration(
                    labelText: 'Filter by Region',
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          // Office List
          Expanded(
            child: RefreshIndicator(
              onRefresh: _loadBusinessOffices,
              child: _isLoading && _filteredOffices.isEmpty
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null && _filteredOffices.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_errorMessage!),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _loadBusinessOffices,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        )
                      : _filteredOffices.isEmpty
                          ? const Center(
                              child: Text('No offices found matching your criteria'),
                            )
                          : ListView.builder(
                              itemCount: _filteredOffices.length,
                              itemBuilder: (context, index) {
                                var office = _filteredOffices[index];
                                return Card(
                                  margin: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  child: ExpansionTile(
                                    leading: Container(
                                      width: 50,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Theme.of(context).primaryColor,
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        office.isOpen ? Icons.business : Icons.business_outlined,
                                        color: Colors.white,
                                      ),
                                    ),
                                    title: Text(
                                      office.name,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: office.isOpen ? Colors.green : Colors.red,
                                      ),
                                    ),
                                    subtitle: Text(office.region),
                                    children: [
                                      Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                const Icon(Icons.location_on, size: 16),
                                                const SizedBox(width: 8),
                                                Expanded(
                                                  child: Text(office.address),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                const Icon(Icons.phone, size: 16),
                                                const SizedBox(width: 8),
                                                Text(office.phone),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                const Icon(Icons.email, size: 16),
                                                const SizedBox(width: 8),
                                                Text(office.email),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                Icon(
                                                  office.isOpen 
                                                    ? Icons.access_time 
                                                    : Icons.access_time_filled,
                                                  size: 16,
                                                ),
                                                const SizedBox(width: 8),
                                                Text(
                                                  office.isOpen 
                                                    ? 'Open • ${office.openingHours}' 
                                                    : 'Closed • ${office.openingHours}',
                                                  style: TextStyle(
                                                    color: office.isOpen 
                                                      ? Colors.green 
                                                      : Colors.red,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 16),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                              children: [
                                                ElevatedButton.icon(
                                                  onPressed: () {
                                                    // Call office
                                                  },
                                                  icon: const Icon(Icons.call),
                                                  label: const Text('Call'),
                                                ),
                                                ElevatedButton.icon(
                                                  onPressed: () {
                                                    // Email office
                                                  },
                                                  icon: const Icon(Icons.mail),
                                                  label: const Text('Email'),
                                                ),
                                                ElevatedButton.icon(
                                                  onPressed: () {
                                                    // Get directions
                                                  },
                                                  icon: const Icon(Icons.directions),
                                                  label: const Text('Directions'),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
            ),
          ),
        ],
      ),
    );
  }
}

class BusinessOffice {
  final int id;
  final String name;
  final String address;
  final String phone;
  final String email;
  final String region;
  final bool isOpen;
  final String openingHours;
  final Coordinates coordinates;

  BusinessOffice({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    required this.email,
    required this.region,
    required this.isOpen,
    required this.openingHours,
    required this.coordinates,
  });
}

class Coordinates {
  final double latitude;
  final double longitude;

  const Coordinates(this.latitude, this.longitude);
}