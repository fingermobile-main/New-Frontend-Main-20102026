import time
import json
from typing import Dict, List, Any
from backend.security.guardian_nebula_core import GuardianNebulaCore
from backend.security.ai_threat_detection import AIThreatDetection

class PromptsThreatAnalyzer:
    """
    PRO-MPTS (Protocol and Manipulation System) Threat Analyzer
    Advanced threat detection and analysis system that works with the existing Guardian and STERCS systems.
    """
    
    def __init__(self, guardian_core: GuardianNebulaCore):
        self.guardian_core = guardian_core
        self.threat_patterns = {}
        self.analyzed_threats = []
        self.threat_countermeasures = {}
        
    def analyze_prompts_for_threats(self, prompt_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze prompts for potential security threats using AI models
        """
        # Log the analysis start
        self.guardian_core._log_security_event(
            "PROMPTS_ANALYSIS_STARTED", 
            "info", 
            "Starting PROMPTS threat analysis on input data",
            source_module="PromptsThreatAnalyzer"
        )
        
        # Use AI threat detection to analyze the prompt
        ai_detector = AIThreatDetection()
        analysis_result = ai_detector.analyze_data({
            "source": "prompts_input",
            "content": prompt_data
        })
        
        # Process the results
        threats_found = []
        if analysis_result.get("threats_detected"):
            for threat_detail in analysis_result.get("details", []):
                threat_obj = {
                    "id": f"prompt_threat_{int(time.time())}_{len(threats_found)}",
                    "type": threat_detail.get("type", "unknown"),
                    "severity": threat_detail.get("severity", "medium"),
                    "description": threat_detail.get("description", ""),
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "countermeasures": self._suggest_countermeasures(threat_detail.get("type", "unknown"))
                }
                threats_found.append(threat_obj)
                
                # Log each threat detected
                self.guardian_core._log_security_event(
                    "PROMPT_THREAT_DETECTED",
                    threat_obj["severity"],
                    f"Threat detected in prompt: {threat_obj['description']}",
                    source_module="PromptsThreatAnalyzer",
                    details=threat_obj
                )
        
        result = {
            "analysis_id": f"prompts_analysis_{int(time.time())}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "threats_found": threats_found,
            "risk_level": self._calculate_risk_level(threats_found),
            "recommendations": self._generate_recommendations(threats_found)
        }
        
        # Store the analysis result
        self.analyzed_threats.append(result)
        
        # Log completion
        self.guardian_core._log_security_event(
            "PROMPTS_ANALYSIS_COMPLETED",
            "info",
            f"PROMPTS threat analysis completed. Found {len(threats_found)} threats.",
            source_module="PromptsThreatAnalyzer",
            details=result
        )
        
        return result
    
    def _suggest_countermeasures(self, threat_type: str) -> List[str]:
        """
        Suggest countermeasures based on threat type
        """
        countermeasures_map = {
            "prompt_injection": [
                "Sanitize all input prompts",
                "Implement strict input validation",
                "Apply context-aware filtering",
                "Enable multi-layer verification"
            ],
            "data_extraction": [
                "Restrict access to sensitive data",
                "Implement data loss prevention",
                "Add query monitoring",
                "Apply differential privacy techniques"
            ],
            "jailbreaking": [
                "Strengthen access controls",
                "Implement behavior monitoring",
                "Add anomaly detection",
                "Enforce principle of least privilege"
            ],
            "malicious_intent": [
                "Activate enhanced monitoring",
                "Review member permissions",
                "Implement rate limiting",
                "Engage GUARDIAN security protocols"
            ]
        }
        
        return countermeasures_map.get(threat_type, ["Activate general security protocols"])
    
    def _calculate_risk_level(self, threats: List[Dict]) -> str:
        """
        Calculate overall risk level based on detected threats
        """
        if not threats:
            return "low"
            
        # Count severity levels
        severity_scores = {"low": 1, "medium": 2, "high": 3, "critical": 4}
        total_score = sum(severity_scores.get(threat.get("severity", "medium"), 2) for threat in threats)
        avg_score = total_score / len(threats)
        
        if avg_score >= 3.5:
            return "critical"
        elif avg_score >= 2.5:
            return "high"
        elif avg_score >= 1.5:
            return "medium"
        else:
            return "low"
    
    def _generate_recommendations(self, threats: List[Dict]) -> List[str]:
        """
        Generate recommendations based on detected threats
        """
        if not threats:
            return ["No immediate threats detected. Maintain standard security protocols."]
            
        recommendations = []
        high_severity_count = sum(1 for threat in threats if threat.get("severity") in ["high", "critical"])
        
        if high_severity_count > 0:
            recommendations.append("Immediate action required: High-severity threats detected")
            recommendations.append("Activate STERCS emergency protocols")
            recommendations.append("Engage GUARDIAN security lockdown procedures")
            
        # Add threat-specific recommendations
        for threat in threats:
            recommendations.extend(threat.get("countermeasures", []))
            
        # Add general recommendations
        recommendations.append("Update threat intelligence database")
        recommendations.append("Review and enhance access controls")
        recommendations.append("Conduct security audit of affected systems")
        
        return list(set(recommendations))  # Remove duplicates

# Sentinel integration for continuous monitoring
class SentinelBehavioralMonitor:
    """
    AI Sentinel Behavioral Monitoring System
    Continuously monitors system behavior for anomalies and suspicious activities
    """
    
    def __init__(self, guardian_core: GuardianNebulaCore):
        self.guardian_core = guardian_core
        self.baseline_profiles = {}
        self.anomaly_threshold = 0.75
        
    def monitor_system_behavior(self, system_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Monitor system behavior and detect anomalies
        """
        # Log monitoring start
        self.guardian_core._log_security_event(
            "SENTINEL_MONITORING_STARTED",
            "info",
            "AI Sentinel behavioral monitoring initiated",
            source_module="SentinelBehavioralMonitor"
        )
        
        anomalies = []
        for metric_name, current_value in system_metrics.items():
            baseline = self.baseline_profiles.get(metric_name, {})
            if baseline:
                # Calculate deviation from baseline
                expected_value = baseline.get("mean", 0)
                threshold = baseline.get("threshold", self.anomaly_threshold)
                
                if expected_value > 0:
                    deviation = abs(current_value - expected_value) / expected_value
                    if deviation > threshold:
                        anomaly = {
                            "metric": metric_name,
                            "current_value": current_value,
                            "expected_value": expected_value,
                            "deviation": deviation,
                            "severity": "high" if deviation > threshold * 2 else "medium",
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        anomalies.append(anomaly)
                        
                        # Log anomaly detection
                        self.guardian_core._log_security_event(
                            "BEHAVIORAL_ANOMALY_DETECTED",
                            anomaly["severity"],
                            f"Anomaly detected in {metric_name}: {deviation:.2f} deviation from baseline",
                            source_module="SentinelBehavioralMonitor",
                            details=anomaly
                        )
        
        result = {
            "monitoring_session": f"sentinel_monitor_{int(time.time())}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "anomalies_detected": anomalies,
            "risk_assessment": "high" if any(a["severity"] == "high" for a in anomalies) else "medium" if anomalies else "low"
        }
        
        # If high-risk anomalies detected, trigger alerts
        if result["risk_assessment"] == "high":
            self.guardian_core._log_security_event(
                "HIGH_RISK_ANOMALIES_DETECTED",
                "critical",
                "High-risk behavioral anomalies detected by AI Sentinel",
                source_module="SentinelBehavioralMonitor",
                details=result
            )
            
            # Trigger STERCS emergency protocols
            self._trigger_stercs_protocols()
        
        return result
    
    def _trigger_stercs_protocols(self):
        """
        Trigger STERCS emergency protocols when high-risk anomalies are detected
        """
        self.guardian_core._log_security_event(
            "STERCS_PROTOCOL_TRIGGERED",
            "critical",
            "STERCS emergency protocols activated by AI Sentinel",
            source_module="SentinelBehavioralMonitor"
        )
        # In a real implementation, this would communicate with the STERCS system
        # to initiate protective measures