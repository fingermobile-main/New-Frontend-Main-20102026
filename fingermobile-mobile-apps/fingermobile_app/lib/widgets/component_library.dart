import 'package:flutter/material.dart';

class ComponentLibrary extends StatefulWidget {
  @override
  _ComponentLibraryState createState() => _ComponentLibraryState();
}

class _ComponentLibraryState extends State<ComponentLibrary> {
  final List<_ComponentCategory> _categories = [
    _ComponentCategory(
      name: 'Buttons',
      components: [
        _LibraryComponent(
          name: 'Elevated Button',
          description: 'Standard button with elevation',
          widget: ElevatedButton(
            onPressed: () {},
            child: Text('Elevated Button'),
          ),
        ),
        _LibraryComponent(
          name: 'Outlined Button',
          description: 'Button with outline border',
          widget: OutlinedButton(
            onPressed: () {},
            child: Text('Outlined Button'),
          ),
        ),
        _LibraryComponent(
          name: 'Text Button',
          description: 'Button with no background',
          widget: TextButton(
            onPressed: () {},
            child: Text('Text Button'),
          ),
        ),
        _LibraryComponent(
          name: 'Icon Button',
          description: 'Button with only an icon',
          widget: IconButton(
            onPressed: () {},
            icon: Icon(Icons.thumb_up),
          ),
        ),
      ],
    ),
    _ComponentCategory(
      name: 'Inputs',
      components: [
        _LibraryComponent(
          name: 'Text Field',
          description: 'Standard input field',
          widget: TextField(
            decoration: InputDecoration(
              labelText: 'Input text',
              border: OutlineInputBorder(),
            ),
          ),
        ),
        _LibraryComponent(
          name: 'Dropdown',
          description: 'Dropdown selection menu',
          widget: Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(4),
            ),
            child: DropdownButton<String>(
              isExpanded: true,
              value: 'Option 1',
              items: ['Option 1', 'Option 2', 'Option 3']
                  .map((option) => DropdownMenuItem(
                        value: option,
                        child: Text(option),
                      ))
                  .toList(),
              onChanged: (value) {},
            ),
          ),
        ),
        _LibraryComponent(
          name: 'Checkbox',
          description: 'Multiple selection option',
          widget: Checkbox(
            value: true,
            onChanged: (value) {},
          ),
        ),
        _LibraryComponent(
          name: 'Switch',
          description: 'Toggle between states',
          widget: Switch(
            value: true,
            onChanged: (value) {},
          ),
        ),
      ],
    ),
    _ComponentCategory(
      name: 'Navigation',
      components: [
        _LibraryComponent(
          name: 'Bottom Navigation',
          description: 'Bottom tab navigation',
          widget: BottomNavigationBar(
            items: [
              BottomNavigationBarItem(
                icon: Icon(Icons.home),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.search),
                label: 'Search',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person),
                label: 'Profile',
              ),
            ],
            currentIndex: 0,
            onTap: (index) {},
          ),
        ),
        _LibraryComponent(
          name: 'Tab Bar',
          description: 'Horizontal tab navigation',
          widget: TabBar(
            tabs: [
              Tab(text: 'Tab 1'),
              Tab(text: 'Tab 2'),
              Tab(text: 'Tab 3'),
            ],
          ),
        ),
        _LibraryComponent(
          name: 'Drawer',
          description: 'Side navigation drawer',
          widget: Container(
            width: 200,
            height: 200,
            child: Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  DrawerHeader(
                    child: Text('Navigation'),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                    ),
                  ),
                  ListTile(
                    title: Text('Item 1'),
                    onTap: () {},
                  ),
                  ListTile(
                    title: Text('Item 2'),
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    ),
    _ComponentCategory(
      name: 'Cards & Lists',
      components: [
        _LibraryComponent(
          name: 'Card',
          description: 'Container for related content',
          widget: Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Text('Card Title'),
                  Text('Card content goes here'),
                ],
              ),
            ),
          ),
        ),
        _LibraryComponent(
          name: 'List Tile',
          description: 'Single row in a list',
          widget: ListTile(
            leading: Icon(Icons.info),
            title: Text('List Item'),
            subtitle: Text('Description of the item'),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
        ),
        _LibraryComponent(
          name: 'Data Table',
          description: 'Table with sortable columns',
          widget: DataTable(
            columns: [
              DataColumn(label: Text('Name')),
              DataColumn(label: Text('Value')),
            ],
            rows: [
              DataRow(cells: [
                DataCell(Text('Item 1')),
                DataCell(Text('Value 1')),
              ]),
              DataRow(cells: [
                DataCell(Text('Item 2')),
                DataCell(Text('Value 2')),
              ]),
            ],
          ),
        ),
      ],
    ),
    _ComponentCategory(
      name: 'Feedback',
      components: [
        _LibraryComponent(
          name: 'Progress Indicator',
          description: 'Shows progress of a task',
          widget: LinearProgressIndicator(),
        ),
        _LibraryComponent(
          name: 'Circular Progress',
          description: 'Circular progress indicator',
          widget: CircularProgressIndicator(),
        ),
        _LibraryComponent(
          name: 'Snackbar',
          description: 'Temporary message display',
          widget: Container(
            height: 48,
            child: FittedBox(
              child: Text('This represents a Snackbar'),
            ),
          ),
        ),
        _LibraryComponent(
          name: 'Dialog',
          description: 'Popup modal dialog',
          widget: Container(
            height: 100,
            width: 200,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Center(
              child: Text('Dialog Placeholder'),
            ),
          ),
        ),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Component Library'),
        backgroundColor: Colors.grey[800],
        foregroundColor: Colors.white,
      ),
      body: ListView.builder(
        itemCount: _categories.length,
        itemBuilder: (context, categoryIndex) {
          final category = _categories[categoryIndex];
          return ExpansionTile(
            title: Text(
              category.name,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            children: [
              ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: category.components.length,
                itemBuilder: (context, componentIndex) {
                  final component = category.components[componentIndex];
                  return Card(
                    margin: EdgeInsets.all(8),
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            component.name,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            component.description,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 14,
                            ),
                          ),
                          SizedBox(height: 12),
                          Container(
                            padding: EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey[300]!),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: component.widget,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}

class _ComponentCategory {
  final String name;
  final List<_LibraryComponent> components;

  _ComponentCategory({
    required this.name,
    required this.components,
  });
}

class _LibraryComponent {
  final String name;
  final String description;
  final Widget widget;

  _LibraryComponent({
    required this.name,
    required this.description,
    required this.widget,
  });
}