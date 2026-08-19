import 'package:flutter/material.dart';

class DataImportPage extends StatefulWidget {
  const DataImportPage({super.key});

  @override
  State<DataImportPage> createState() => _DataImportPageState();
}

class _DataImportPageState extends State<DataImportPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<ImportSource> _sources = [];
  ImportSource? _selectedSource;
  List<ImportHistoryItem> _importHistory = [];
  bool _isImporting = false;
  double _importProgress = 0.0;
  String _importStatus = '';

  @override
  void initState() {
    super.initState();
    _loadImportData();
  }

  Future<void> _loadImportData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock import data
      setState(() {
        _sources = [
          ImportSource(
            id: 1,
            name: 'CSV File',
            icon: Icons.insert_drive_file,
            description: 'Import data from CSV files',
          ),
          ImportSource(
            id: 2,
            name: 'Excel File',
            icon: Icons.table_chart,
            description: 'Import data from Excel spreadsheets',
          ),
          ImportSource(
            id: 3,
            name: 'Database',
            icon: Icons.storage,
            description: 'Import data from external databases',
          ),
          ImportSource(
            id: 4,
            name: 'API Endpoint',
            icon: Icons.api,
            description: 'Import data from REST APIs',
          ),
        ];

        _importHistory = [
          ImportHistoryItem(
            id: 1,
            source: 'CSV File',
            fileName: 'members_data.csv',
            records: 1250,
            status: ImportStatus.completed,
            timestamp: DateTime.now().subtract(const Duration(days: 1)),
          ),
          ImportHistoryItem(
            id: 2,
            source: 'Database',
            fileName: 'customer_db',
            records: 8920,
            status: ImportStatus.completed,
            timestamp: DateTime.now().subtract(const Duration(days: 3)),
          ),
          ImportHistoryItem(
            id: 3,
            source: 'API Endpoint',
            fileName: 'products_api',
            records: 450,
            status: ImportStatus.failed,
            timestamp: DateTime.now().subtract(const Duration(days: 5)),
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load import data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _startImport() async {
    if (_selectedSource == null) {
      setState(() {
        _errorMessage = 'Please select an import source';
      });
      return;
    }

    setState(() {
      _isImporting = true;
      _importProgress = 0.0;
      _importStatus = 'Starting import...';
      _errorMessage = null;
    });

    try {
      // Simulate import process
      for (int i = 0; i <= 100; i += 10) {
        await Future.delayed(const Duration(milliseconds: 500));
        setState(() {
          _importProgress = i / 100;
          _importStatus = 'Importing data... ${i}%';
        });
      }

      // Add to history
      setState(() {
        _importHistory.insert(
          0,
          ImportHistoryItem(
            id: _importHistory.length + 1,
            source: _selectedSource!.name,
            fileName: 'import_${DateTime.now().millisecondsSinceEpoch}.data',
            records: 1500,
            status: ImportStatus.completed,
            timestamp: DateTime.now(),
          ),
        );
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Data import completed successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Import failed. Please try again.';
      });

      // Add failed import to history
      setState(() {
        _importHistory.insert(
          0,
          ImportHistoryItem(
            id: _importHistory.length + 1,
            source: _selectedSource!.name,
            fileName: 'import_${DateTime.now().millisecondsSinceEpoch}.data',
            records: 0,
            status: ImportStatus.failed,
            timestamp: DateTime.now(),
          ),
        );
      });
    } finally {
      setState(() {
        _isImporting = false;
        _importProgress = 0.0;
        _importStatus = '';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Data Import'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadImportData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadImportData,
        child: _isLoading && _sources.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _sources.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadImportData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header
                          const Text(
                            'Import Data',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Import data from various sources into the system',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Import Source Selection
                          const Text(
                            'Select Import Source',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          GridView.builder(
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 1.2,
                            ),
                            itemCount: _sources.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              var source = _sources[index];
                              bool isSelected = _selectedSource?.id == source.id;

                              return Card(
                                elevation: isSelected ? 4 : 2,
                                child: InkWell(
                                  onTap: () {
                                    setState(() {
                                      _selectedSource = source;
                                    });
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          source.icon,
                                          size: 40,
                                          color: isSelected
                                              ? Theme.of(context).primaryColor
                                              : Colors.grey,
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          source.name,
                                          style: TextStyle(
                                            fontWeight: isSelected
                                                ? FontWeight.bold
                                                : FontWeight.normal,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          source.description,
                                          textAlign: TextAlign.center,
                                          style: const TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 24),
                          // Import Options
                          if (_selectedSource != null) ...[
                            const Text(
                              'Import Options',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  children: [
                                    const ListTile(
                                      leading: Icon(Icons.file_upload),
                                      title: Text('Upload File'),
                                      subtitle: Text('Select file to import'),
                                      trailing: Icon(Icons.arrow_forward_ios),
                                    ),
                                    const Divider(),
                                    const ListTile(
                                      leading: Icon(Icons.settings),
                                      title: Text('Mapping Configuration'),
                                      subtitle:
                                          Text('Configure field mappings'),
                                      trailing: Icon(Icons.arrow_forward_ios),
                                    ),
                                    const Divider(),
                                    const ListTile(
                                      leading: Icon(Icons.schedule),
                                      title: Text('Schedule Import'),
                                      subtitle: Text('Set up recurring imports'),
                                      trailing: Icon(Icons.arrow_forward_ios),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                          // Import Progress
                          if (_isImporting) ...[
                            const Text(
                              'Import Progress',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  children: [
                                    Text(_importStatus),
                                    const SizedBox(height: 16),
                                    LinearProgressIndicator(
                                      value: _importProgress,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                          // Error Message
                          if (_errorMessage != null && !_isImporting) ...[
                            Card(
                              color: Colors.red.shade100,
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(
                                    color: Colors.red,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                          // Import Button
                          if (_selectedSource != null && !_isImporting)
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _startImport,
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                ),
                                child: const Text(
                                  'Start Import',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          const SizedBox(height: 32),
                          // Import History
                          const Text(
                            'Import History',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _importHistory.length,
                            itemBuilder: (context, index) {
                              var historyItem = _importHistory[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            historyItem.fileName,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getStatusColor(
                                                  historyItem.status),
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              _getStatusText(historyItem.status),
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '${historyItem.source} • ${historyItem.records} records',
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        _formatDateTime(historyItem.timestamp),
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Color _getStatusColor(ImportStatus status) {
    switch (status) {
      case ImportStatus.completed:
        return Colors.green;
      case ImportStatus.failed:
        return Colors.red;
      case ImportStatus.inProgress:
        return Colors.orange;
    }
  }

  String _getStatusText(ImportStatus status) {
    switch (status) {
      case ImportStatus.completed:
        return 'Completed';
      case ImportStatus.failed:
        return 'Failed';
      case ImportStatus.inProgress:
        return 'In Progress';
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.month}/${dateTime.day}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}

enum ImportStatus { completed, failed, inProgress }

class ImportSource {
  final int id;
  final String name;
  final IconData icon;
  final String description;

  ImportSource({
    required this.id,
    required this.name,
    required this.icon,
    required this.description,
  });
}

class ImportHistoryItem {
  final int id;
  final String source;
  final String fileName;
  final int records;
  final ImportStatus status;
  final DateTime timestamp;

  ImportHistoryItem({
    required this.id,
    required this.source,
    required this.fileName,
    required this.records,
    required this.status,
    required this.timestamp,
  });
}