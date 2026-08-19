import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/api_service.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';

class AdvancedVoicePage extends StatefulWidget {
  const AdvancedVoicePage({super.key});

  @override
  State<AdvancedVoicePage> createState() => _AdvancedVoicePageState();
}

class _AdvancedVoicePageState extends State<AdvancedVoicePage> {
  final ApiService _ApiService = ApiService();
  final SpeechToText _speechToText = SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  
  bool _isListening = false;
  bool _isProcessing = false;
  String _transcript = '';
  String _selectedVoice = 'default';
  double _speechRate = 0.5;
  double _speechPitch = 1.0;
  double _volume = 1.0;
  List<Map<String, dynamic>> _voiceLines = [];
  List<Map<String, dynamic>> _availableVoices = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initSpeech();
    _loadVoiceLines();
    _loadAvailableVoices();
  }

  Future<void> _initSpeech() async {
    try {
      bool available = await _speechToText.initialize();
      if (available) {
        setState(() {
          _isListening = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Speech recognition not available';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to initialize speech: $e';
      });
    }
  }

  Future<void> _loadVoiceLines() async {
    try {
      final response = await _ApiService.get('/api/voice-lines');
      if (response.isSuccess) {
        setState(() {
          _voiceLines = (response.data as List).cast<Map<String, dynamic>>();
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load voice lines: $e';
      });
    }
  }

  Future<void> _loadAvailableVoices() async {
    try {
      // Load available voices from API
      final response = await _ApiService.get('/api/voices');
      if (response.isSuccess) {
        setState(() {
          _availableVoices = (response.data as List).cast<Map<String, dynamic>>();
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load available voices: $e';
      });
    }
  }

  Future<void> _startListening() async {
    if (!_isListening) {
      bool available = await _speechToText.initialize();
      if (available) {
        setState(() {
          _isListening = true;
        });
        _speechToText.listen(
          onResult: (result) {
            setState(() {
              _transcript = result.recognizedWords;
            });
          },
        );
      }
    } else {
      setState(() {
        _isListening = false;
      });
      _speechToText.stop();
    }
  }

  Future<void> _speakText(String text) async {
    setState(() {
      _isProcessing = true;
    });
    
    try {
      await _flutterTts.setSpeechRate(_speechRate);
      await _flutterTts.setPitch(_speechPitch);
      await _flutterTts.setVolume(_volume);
      
      if (_selectedVoice != 'default') {
        await _flutterTts.setVoice({"name": _selectedVoice, "locale": "en-US"});
      }
      
      await _flutterTts.speak(text);
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to speak text: $e';
      });
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  Future<void> _playVoiceLine(String text) async {
    await _speakText(text);
  }

  @override
  void dispose() {
    _speechToText.stop();
    _flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Advanced Voice Controls'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: _errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(_errorMessage!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _errorMessage = null;
                      });
                      _loadVoiceLines();
                      _loadAvailableVoices();
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Voice Controls Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Voice Recognition',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: _startListening,
                                  icon: Icon(
                                    _isListening ? Icons.mic : Icons.mic_none,
                                    color: _isListening ? Colors.red : null,
                                  ),
                                  label: Text(_isListening ? 'Stop Listening' : 'Start Listening'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: _isListening ? Colors.red : null,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: _transcript.isNotEmpty ? () => _speakText(_transcript) : null,
                                  child: const Text('Speak Transcript'),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              _transcript.isNotEmpty ? _transcript : 'Listening for speech...',
                              style: const TextStyle(fontSize: 16),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Text-to-Speech Controls
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Text-to-Speech',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          
                          // Voice Selection
                          const Text('Select Voice:'),
                          DropdownButton<String>(
                            value: _selectedVoice,
                            isExpanded: true,
                            onChanged: (String? newValue) {
                              if (newValue != null) {
                                setState(() {
                                  _selectedVoice = newValue;
                                });
                              }
                            },
                            items: [
                              const DropdownMenuItem(
                                value: 'default',
                                child: Text('Default Voice'),
                              ),
                              ..._availableVoices.map<DropdownMenuItem<String>>((voice) {
                                return DropdownMenuItem(
                                  value: voice['name'],
                                  child: Text(voice['displayName'] ?? voice['name']),
                                );
                              }).toList(),
                            ],
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Speech Rate Control
                          const Text('Speech Rate:'),
                          Slider(
                            value: _speechRate,
                            min: 0.1,
                            max: 1.0,
                            divisions: 10,
                            label: _speechRate.toStringAsFixed(1),
                            onChanged: (double value) {
                              setState(() {
                                _speechRate = value;
                              });
                            },
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Pitch Control
                          const Text('Pitch:'),
                          Slider(
                            value: _speechPitch,
                            min: 0.5,
                            max: 2.0,
                            divisions: 15,
                            label: _speechPitch.toStringAsFixed(1),
                            onChanged: (double value) {
                              setState(() {
                                _speechPitch = value;
                              });
                            },
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Volume Control
                          const Text('Volume:'),
                          Slider(
                            value: _volume,
                            min: 0.0,
                            max: 1.0,
                            divisions: 10,
                            label: _volume.toStringAsFixed(1),
                            onChanged: (double value) {
                              setState(() {
                                _volume = value;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Voice Lines Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Voice Lines',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_voiceLines.isEmpty)
                            const Center(child: Text('Loading voice lines...'))
                          else
                            Expanded(
                              child: ListView.builder(
                                shrinkWrap: true,
                                itemCount: _voiceLines.length,
                                itemBuilder: (context, index) {
                                  final voiceLine = _voiceLines[index];
                                  return Card(
                                    child: ListTile(
                                      title: Text(voiceLine['text'] ?? ''),
                                      subtitle: Text(voiceLine['category'] ?? ''),
                                      trailing: IconButton(
                                        icon: const Icon(Icons.play_arrow),
                                        onPressed: () => _playVoiceLine(voiceLine['text']),
                                      ),
                                    ),
                                  );
                                },
                              ),
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
}