import 'package:flutter/material.dart';

class FingerWarsPage extends StatefulWidget {
  const FingerWarsPage({super.key});

  @override
  State<FingerWarsPage> createState() => _FingerWarsPageState();
}

class _FingerWarsPageState extends State<FingerWarsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  FingerWarGame? _currentGame;
  List<FingerWarPlayer> _players = [];
  List<FingerWarChallenge> _challenges = [];
  int _memberScore = 0;
  int _opponentScore = 0;
  GameStatus _gameStatus = GameStatus.waiting;
  int _countdown = 3;
  bool _showCountdown = false;

  @override
  void initState() {
    super.initState();
    _loadGameData();
  }

  Future<void> _loadGameData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock game data
      setState(() {
        _currentGame = FingerWarGame(
          id: 1,
          title: 'Ultimate Finger War Championship',
          description: 'Compete in the ultimate finger war battle',
          startTime: DateTime.now().add(const Duration(minutes: 5)),
          endTime: DateTime.now().add(const Duration(minutes: 30)),
        );

        _players = [
          FingerWarPlayer(
            id: 1,
            name: 'You',
            avatarUrl: 'https://via.placeholder.com/50/4ECDC4/FFFFFF?text=Y',
            score: 0,
            isCurrentmember: true,
          ),
          FingerWarPlayer(
            id: 2,
            name: 'Opponent Pro',
            avatarUrl: 'https://via.placeholder.com/50/FF6B6B/FFFFFF?text=OP',
            score: 0,
            isCurrentmember: false,
          ),
        ];

        _challenges = [
          FingerWarChallenge(
            id: 1,
            title: 'Lightning Fast',
            description: 'Win 3 rounds in under 10 seconds each',
            reward: 50,
            isCompleted: false,
          ),
          FingerWarChallenge(
            id: 2,
            title: 'Perfect Streak',
            description: 'Win 5 rounds in a row without losing',
            reward: 100,
            isCompleted: true,
          ),
          FingerWarChallenge(
            id: 3,
            title: 'Comeback King',
            description: 'Win after being behind by 3 points',
            reward: 75,
            isCompleted: false,
          ),
        ];

        _memberScore = 0;
        _opponentScore = 0;
        _gameStatus = GameStatus.waiting;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load game data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _startGame() {
    setState(() {
      _showCountdown = true;
      _gameStatus = GameStatus.countdown;
    });

    // Start countdown
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _countdown = 2;
      });
      
      Future.delayed(const Duration(seconds: 1), () {
        setState(() {
          _countdown = 1;
        });
        
        Future.delayed(const Duration(seconds: 1), () {
          setState(() {
            _showCountdown = false;
            _gameStatus = GameStatus.playing;
            _countdown = 3;
          });
          
          // Simulate opponent moves
          _simulateOpponentMoves();
        });
      });
    });
  }

  void _simulateOpponentMoves() {
    if (_gameStatus != GameStatus.playing) return;

    // Simulate opponent moves every 2-5 seconds
    Future.delayed(Duration(seconds: 2 + (DateTime.now().millisecond % 4)), () {
      if (_gameStatus != GameStatus.playing) return;
      
      setState(() {
        _opponentScore++;
      });
      
      // Check win condition
      if (_opponentScore >= 5) {
        _endGame(false);
        return;
      }
      
      // Continue simulation
      _simulateOpponentMoves();
    });
  }

  void _makeMove() {
    if (_gameStatus != GameStatus.playing) return;
    
    setState(() {
      _memberScore++;
    });
    
    // Check win condition
    if (_memberScore >= 5) {
      _endGame(true);
    }
  }

  void _endGame(bool memberWon) {
    setState(() {
      _gameStatus = memberWon ? GameStatus.won : GameStatus.lost;
    });
    
    // Show result dialog
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(memberWon ? 'Victory!' : 'Defeat'),
            content: Text(
              memberWon 
                ? 'Congratulations! You won the finger war.' 
                : 'Better luck next time! Your opponent won.'
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  _resetGame();
                },
                child: const Text('Play Again'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('Close'),
              ),
            ],
          );
        },
      );
    });
  }

  void _resetGame() {
    setState(() {
      _memberScore = 0;
      _opponentScore = 0;
      _gameStatus = GameStatus.waiting;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Finger Wars'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadGameData,
          ),
          IconButton(
            icon: const Icon(Icons.leaderboard),
            onPressed: () {
              // Show leaderboard
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadGameData,
        child: _isLoading && _currentGame == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _currentGame == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadGameData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Stack(
                    children: [
                      SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Game Info
                              if (_currentGame != null)
                                Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          _currentGame!.title,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 20,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        Text(_currentGame!.description),
                                        const SizedBox(height: 16),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            _buildInfoChip(
                                              Icons.access_time,
                                              'Starts in 5 min',
                                              Colors.blue,
                                            ),
                                            _buildInfoChip(
                                              Icons.group,
                                              '2 Players',
                                              Colors.green,
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              const SizedBox(height: 24),
                              // Players
                              const Text(
                                'Players',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  _buildPlayerCard(_players[0], _memberScore),
                                  const Text(
                                    'VS',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  _buildPlayerCard(_players[1], _opponentScore),
                                ],
                              ),
                              const SizedBox(height: 32),
                              // Game Area
                              if (_gameStatus == GameStatus.waiting)
                                Center(
                                  child: ElevatedButton(
                                    onPressed: _startGame,
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 32,
                                        vertical: 16,
                                      ),
                                    ),
                                    child: const Text(
                                      'Start Battle',
                                      style: TextStyle(fontSize: 18),
                                    ),
                                  ),
                                ),
                              const SizedBox(height: 32),
                              // Challenges
                              const Text(
                                'Challenges',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _challenges.length,
                                itemBuilder: (context, index) {
                                  var challenge = _challenges[index];
                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: challenge.isCompleted
                                                  ? Colors.green.shade100
                                                  : Colors.grey.shade100,
                                              shape: BoxShape.circle,
                                            ),
                                            child: Icon(
                                              challenge.isCompleted
                                                  ? Icons.check
                                                  : Icons.lock,
                                              color: challenge.isCompleted
                                                  ? Colors.green
                                                  : Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(width: 16),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  challenge.title,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  challenge.description,
                                                  style: const TextStyle(
                                                    color: Colors.grey,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.amber.shade100,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Row(
                                              children: [
                                                const Icon(
                                                  Icons.star,
                                                  size: 16,
                                                  color: Colors.amber,
                                                ),
                                                const SizedBox(width: 4),
                                                Text('${challenge.reward}'),
                                              ],
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
                      // Overlay for countdown
                      if (_showCountdown)
                        Container(
                          color: Colors.black54,
                          child: Center(
                            child: Text(
                              '$_countdown',
                              style: const TextStyle(
                                fontSize: 100,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      // Overlay for gameplay
                      if (_gameStatus == GameStatus.playing)
                        Container(
                          color: Colors.black38,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text(
                                  'TAP AS FAST AS YOU CAN!',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 32),
                                GestureDetector(
                                  onTap: _makeMove,
                                  child: Container(
                                    width: 200,
                                    height: 200,
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).primaryColor,
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.3),
                                          blurRadius: 10,
                                          spreadRadius: 5,
                                        ),
                                      ],
                                    ),
                                    child: const Center(
                                      child: Text(
                                        'TAP!',
                                        style: TextStyle(
                                          fontSize: 32,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 32),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                  children: [
                                    _buildScoreDisplay('You', _memberScore),
                                    _buildScoreDisplay('Opponent', _opponentScore),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(color: color, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerCard(FingerWarPlayer player, int score) {
    return Column(
      children: [
        CircleAvatar(
          radius: 40,
          backgroundImage: NetworkImage(player.avatarUrl),
          backgroundColor: Colors.grey.shade300,
        ),
        const SizedBox(height: 8),
        Text(
          player.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          '$score points',
          style: const TextStyle(color: Colors.grey),
        ),
        if (player.isCurrentmember)
          const Text(
            '(You)',
            style: TextStyle(color: Colors.blue),
          ),
      ],
    );
  }

  Widget _buildScoreDisplay(String label, int score) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          '$score',
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }
}

enum GameStatus { waiting, countdown, playing, won, lost }

class FingerWarGame {
  final int id;
  final String title;
  final String description;
  final DateTime startTime;
  final DateTime endTime;

  FingerWarGame({
    required this.id,
    required this.title,
    required this.description,
    required this.startTime,
    required this.endTime,
  });
}

class FingerWarPlayer {
  final int id;
  final String name;
  final String avatarUrl;
  final int score;
  final bool isCurrentmember;

  FingerWarPlayer({
    required this.id,
    required this.name,
    required this.avatarUrl,
    required this.score,
    required this.isCurrentmember,
  });
}

class FingerWarChallenge {
  final int id;
  final String title;
  final String description;
  final int reward;
  final bool isCompleted;

  FingerWarChallenge({
    required this.id,
    required this.title,
    required this.description,
    required this.reward,
    required this.isCompleted,
  });
}