import 'package:flutter/material.dart';
import 'dart:js' as js;

class AdvancedFingerWarPage extends StatefulWidget {
  const AdvancedFingerWarPage({super.key});

  @override
  State<AdvancedFingerWarPage> createState() => _AdvancedFingerWarPageState();
}

class _AdvancedFingerWarPageState extends State<AdvancedFingerWarPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Map<String, dynamic>> _warData = [];
  int _playerScore = 0;
  int _opponentScore = 0;
  int _round = 1;
  bool _gameActive = false;
  int _consecutiveWins = 0; // Track consecutive player wins for combos

  @override
  void initState() {
    super.initState();
    _initializeGame();
  }

  Future<void> _initializeGame() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Initialize game data
      setState(() {
        _warData = [
          {'id': 1, 'name': 'Fireball', 'power': 85, 'element': 'Fire'},
          {'id': 2, 'name': 'Ice Shard', 'power': 75, 'element': 'Water'},
          {'id': 3, 'name': 'Lightning Bolt', 'power': 90, 'element': 'Electric'},
          {'id': 4, 'name': 'Earthquake', 'power': 80, 'element': 'Earth'},
          {'id': 5, 'name': 'Wind Slash', 'power': 70, 'element': 'Air'},
        ];
        _gameActive = true;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to initialize game. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _playRound(int playerMoveId) {
    if (!_gameActive) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate opponent move
      int opponentMoveId = (playerMoveId % 5) + 1;
      
      // Get moves
      Map<String, dynamic> playerMove = _warData.firstWhere((move) => move['id'] == playerMoveId);
      Map<String, dynamic> opponentMove = _warData.firstWhere((move) => move['id'] == opponentMoveId);
      
      // Calculate round winner (simplified)
      bool playerWins = playerMove['power'] > opponentMove['power'];
      
      // Update scores
      if (playerWins) {
        _playerScore += 1;
        _consecutiveWins += 1;
        if (_consecutiveWins == 2) {
          print('Small Combo!');
          _sendComboEvent('smallCombo');
        } else if (_consecutiveWins == 3) {
          print('Large Combo!');
          _sendComboEvent('largeCombo');
        } else if (_consecutiveWins >= 4) {
          print('Colossal Combo!');
          _sendComboEvent('colossalCombo');
        }
      } else {
        _opponentScore += 1;
        _consecutiveWins = 0; // Reset consecutive wins on loss or draw
      }
      
      _round++;
      
      // Check if game ended
      if (_round > 5) {
        _gameActive = false;
      }
      
      // Show round result
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text(playerWins ? 'You Win Round $_round' : 
                         playerMove['power'] == opponentMove['power'] ? 'Draw Round $_round' : 'Opponent Wins Round $_round'),
              content: Text('You used ${playerMove['name']} (${playerMove['power']} power)\n'
                           'Opponent used ${opponentMove['name']} (${opponentMove['power']} power)'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error playing round. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _resetGame() {
    setState(() {
      _playerScore = 0;
      _opponentScore = 0;
      _round = 1;
      _gameActive = true;
      _consecutiveWins = 0;
    });
  }

  void _sendComboEvent(String comboType) {
    js.context.callMethod('parent.postMessage', [
      js.JsObject.jsify({
        'type': 'comboEvent',
        'detail': comboType,
      }),
      '*'
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Advanced Finger War'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _resetGame,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _initializeGame,
        child: Column(
          children: [
            // Game Status Bar
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    spreadRadius: 2,
                    blurRadius: 5,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    children: [
                      const Text(
                        'YOU',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _playerScore.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      const Text(
                        'ROUND',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _round.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      const Text(
                        'OPP',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _opponentScore.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Game Content
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_errorMessage!),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _initializeGame,
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
                                // Game Instructions
                                Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'How to Play',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        const Text(
                                          'Select a move each round. Power determines the winner. '
                                          'Win 3 rounds to win the game!',
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 24),
                                // Player Moves
                                const Text(
                                  'Your Moves',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                if (_gameActive)
                                  GridView.builder(
                                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                      crossAxisCount: 2,
                                      crossAxisSpacing: 16,
                                      mainAxisSpacing: 16,
                                      childAspectRatio: 1.5,
                                    ),
                                    itemCount: _warData.length,
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemBuilder: (context, index) {
                                      var move = _warData[index];
                                      return Card(
                                        elevation: 4,
                                        child: InkWell(
                                          onTap: () => _playRound(move['id']),
                                          child: Padding(
                                            padding: const EdgeInsets.all(16.0),
                                            child: Column(
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                Text(
                                                  move['name'],
                                                  style: const TextStyle(
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 8),
                                                Text(
                                                  '${move['power']} Power',
                                                  style: const TextStyle(
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(
                                                      horizontal: 8, vertical: 4),
                                                  decoration: BoxDecoration(
                                                    color: _getElementColor(move['element']),
                                                    borderRadius: BorderRadius.circular(12),
                                                  ),
                                                  child: Text(
                                                    move['element'],
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      );
                                    },
                                  )
                                else
                                  Center(
                                    child: Column(
                                      children: [
                                        Text(
                                          _playerScore > _opponentScore
                                              ? 'Congratulations! You Won!'
                                              : _playerScore < _opponentScore
                                                  ? 'Game Over! Try Again!'
                                                  : 'It\'s a Draw!',
                                          style: const TextStyle(
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(height: 24),
                                        ElevatedButton(
                                          onPressed: _resetGame,
                                          child: const Text('Play Again'),
                                        ),
                                      ],
                                    ),
                                  ),
                                const SizedBox(height: 24),
                                // Game History
                                const Text(
                                  'Game History',
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
                                        _buildHistoryItem('Round 1', 'Fireball vs Ice Shard', 'Win'),
                                        const Divider(),
                                        _buildHistoryItem('Round 2', 'Lightning Bolt vs Wind Slash', 'Win'),
                                        const Divider(),
                                        _buildHistoryItem('Round 3', 'Earthquake vs Fireball', 'Loss'),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryItem(String round, String battle, String result) {
    Color resultColor = result == 'Win'
        ? Colors.green
        : result == 'Loss'
            ? Colors.red
            : Colors.grey;

    return Row(
      children: [
        Expanded(
          flex: 1,
          child: Text(round),
        ),
        Expanded(
          flex: 2,
          child: Text(battle),
        ),
        Expanded(
          flex: 1,
          child: Text(
            result,
            textAlign: TextAlign.right,
            style: TextStyle(color: resultColor),
          ),
        ),
      ],
    );
  }

  Color _getElementColor(String element) {
    switch (element) {
      case 'Fire':
        return Colors.red;
      case 'Water':
        return Colors.blue;
      case 'Electric':
        return Colors.yellow.shade700;
      case 'Earth':
        return Colors.brown;
      case 'Air':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }
}