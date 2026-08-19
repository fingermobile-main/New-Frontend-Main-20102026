import 'package:flutter/material.dart';

class PulsatingBalance extends StatefulWidget {
  final double balance;
  final String currencySymbol;
  final bool showBalance;
  final VoidCallback? onTap;
  final Color primaryColor;
  final Color secondaryColor;

  const PulsatingBalance({
    Key? key,
    required this.balance,
    this.currencySymbol = '\$',
    this.showBalance = true,
    this.onTap,
    this.primaryColor = Colors.blue,
    this.secondaryColor = Colors.purple,
  }) : super(key: key);

  @override
  _PulsatingBalanceState createState() => _PulsatingBalanceState();
}

class _PulsatingBalanceState extends State<PulsatingBalance>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  late Animation<Color?> _colorAnimation;

  bool _isVisible = true;

  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    
    _scaleAnimation = TweenSequence([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 1.05),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.05, end: 1.0),
        weight: 50,
      ),
    ]).animate(_animationController);
    
    _opacityAnimation = TweenSequence([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 0.7),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.7, end: 1.0),
        weight: 50,
      ),
    ]).animate(_animationController);
    
    _colorAnimation = ColorTween(
      begin: widget.primaryColor,
      end: widget.secondaryColor,
    ).animate(_animationController);
    
    _animationController.repeat(reverse: true);
  }

  @override
  void didUpdateWidget(PulsatingBalance oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.balance != widget.balance) {
      _triggerPulse();
    }
  }

  void _triggerPulse() {
    _animationController.forward(from: 0.0);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([_animationController]),
      builder: (context, child) {
        return GestureDetector(
          onTap: widget.onTap,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  _colorAnimation.value ?? widget.primaryColor,
                  widget.secondaryColor,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _colorAnimation.value?.withOpacity(0.4) ?? 
                         widget.primaryColor.withOpacity(0.4),
                  spreadRadius: 2,
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Current Balance',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 4),
                ScaleTransition(
                  scale: _scaleAnimation,
                  child: Opacity(
                    opacity: _opacityAnimation.value,
                    child: Text(
                      widget.showBalance
                          ? '${widget.currencySymbol}${widget.balance.toStringAsFixed(2)}'
                          : '••••••',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 4),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.visibility,
                      color: Colors.white54,
                      size: 16,
                    ),
                    SizedBox(width: 4),
                    Text(
                      widget.showBalance ? 'Hide' : 'Show',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class PulsatingBalanceExample extends StatefulWidget {
  @override
  _PulsatingBalanceExampleState createState() => _PulsatingBalanceExampleState();
}

class _PulsatingBalanceExampleState extends State<PulsatingBalanceExample> {
  double _balance = 1245.67;
  bool _showBalance = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pulsating Balance Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            PulsatingBalance(
              balance: _balance,
              showBalance: _showBalance,
              onTap: () {
                setState(() {
                  _showBalance = !_showBalance;
                });
              },
              primaryColor: Colors.blue,
              secondaryColor: Colors.green,
            ),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _balance += 100.0;
                });
              },
              child: Text('Increase Balance'),
            ),
          ],
        ),
      ),
    );
  }
}