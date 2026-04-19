import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'profile_screen.dart';
import 'my_bets_screen.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  // Track which tab is currently selected (0 = Matches, 1 = Profile)
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const MyBetsScreen(),  // Now shows real bet history
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The body displays the screen from the list based on the current index
      body: _screens[_selectedIndex],
      
      // The bottom navigation bar
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.red, // Using your Reds theme
        onTap: (index) {
          // setState tells Flutter the index changed and the UI needs to rebuild
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.sports_soccer),
            label: 'Matches',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'My Bets',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
