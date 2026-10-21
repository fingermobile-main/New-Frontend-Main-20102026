import time
import json
from typing import Dict, List, Any
from backend.security.guardian_nebula_core import GuardianNebulaCore
from backend.security.ai_threat_detection import AIThreatDetection

class SentientBehavioralAnalytics:
    """
    SENTIENT Behavioral Analytics Engine
    Advanced behavioral analysis system that detects anomalous patterns in member and system behavior
    """
    
    def __init__(self, guardian_core: GuardianNebulaCore):
        self.guardian_core = guardian_core
        self.behavioral_baselines = {}
        self.anomaly_detectors = {}
        self.insight_engine = AIThreatDetection()
        
    def analyze_member_behavior(self, member_id: str, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze member behavior patterns for anomalies and potential threats
        """
        # Log the analysis start
        self.guardian_core._log_security_event(
            "SENTIENT_member_BEHAVIOR_ANALYSIS_STARTED", 
            "info", 
            f"Starting behavioral analysis for member {member_id}",
            source_module="SentientBehavioralAnalytics"
        )
        
        # Get baseline for member if exists
        baseline = self.behavioral_baselines.get(member_id, {})
        
        # Detect anomalies in behavior
        anomalies = self._detect_behavioral_anomalies(baseline, behavior_data)
        
        # Generate risk assessment
        risk_level = self._assess_behavioral_risk(anomalies)
        
        # Generate insights using AI
        insights = self._generate_behavioral_insights(member_id, behavior_data, anomalies)
        
        result = {
            "analysis_id": fmember_behavior_analysis_{int(time.time())}",
            member_id": member_id,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "anomalies": anomalies,
            "risk_level": risk_level,
            "insights": insights,
            "recommendations": self._generate_behavioral_recommendations(anomalies, risk_level)
        }
        
        # Log significant findings
        if risk_level in ["high", "critical"]:
            self.guardian_core._log_security_event(
                "HIGH_RISK_member_BEHAVIOR_DETECTED",
                risk_level,
                f"High-risk behavior detected for member {member_id}",
                source_module="SentientBehavioralAnalytics",
                details=result
            )
        
        return result
    
    def analyze_system_behavior(self, system_component: str, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze system component behavior for anomalies
        """
        # Log the analysis start
        self.guardian_core._log_security_event(
            "SENTIENT_SYSTEM_BEHAVIOR_ANALYSIS_STARTED", 
            "info", 
            f"Starting behavioral analysis for system component {system_component}",
            source_module="SentientBehavioralAnalytics"
        )
        
        # Get baseline for system component if exists
        baseline = self.behavioral_baselines.get(system_component, {})
        
        # Detect anomalies in system behavior
        anomalies = self._detect_system_anomalies(baseline, metrics)
        
        # Generate risk assessment
        risk_level = self._assess_system_risk(anomalies)
        
        result = {
            "analysis_id": f"system_behavior_analysis_{int(time.time())}",
            "component": system_component,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "anomalies": anomalies,
            "risk_level": risk_level,
            "recommendations": self._generate_system_recommendations(anomalies, risk_level)
        }
        
        # Log significant findings
        if risk_level in ["high", "critical"]:
            self.guardian_core._log_security_event(
                "HIGH_RISK_SYSTEM_BEHAVIOR_DETECTED",
                risk_level,
                f"High-risk behavior detected in system component {system_component}",
                source_module="SentientBehavioralAnalytics",
                details=result
            )
            
            # If critical, engage Guardian protocols
            if risk_level == "critical":
                self._engage_guardian_protocols(system_component, result)
        
        return result
    
    def _detect_behavioral_anomalies(self, baseline: Dict, current_behavior: Dict[str, Any]) -> List[Dict]:
        """
        Detect anomalies in member behavior compared to baseline
        """
        anomalies = []
        
        for metric, current_value in current_behavior.items():
            if metric in baseline:
                baseline_stats = baseline[metric]
                mean_val = baseline_stats.get("mean", 0)
                std_dev = baseline_stats.get("std_dev", 1)
                
                # Calculate z-score
                if std_dev > 0:
                    z_score = abs(current_value - mean_val) / std_dev
                    
                    # If z-score > 2, it's a significant anomaly
                    if z_score > 2:
                        anomaly = {
                            "type": "behavioral_anomaly",
                            "metric": metric,
                            "current_value": current_value,
                            "baseline_mean": mean_val,
                            "deviation": z_score,
                            "severity": "high" if z_score > 3 else "medium",
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        anomalies.append(anomaly)
        
        return anomalies
    
    def _detect_system_anomalies(self, baseline: Dict, current_metrics: Dict[str, Any]) -> List[Dict]:
        """
        Detect anomalies in system metrics compared to baseline
        """
        anomalies = []
        
        for metric, current_value in current_metrics.items():
            if metric in baseline:
                baseline_stats = baseline[metric]
                mean_val = baseline_stats.get("mean", 0)
                threshold = baseline_stats.get("threshold", mean_val * 0.2)  # 20% threshold
                
                # Calculate percentage deviation
                if mean_val > 0:
                    deviation = abs(current_value - mean_val) / mean_val
                    
                    # If deviation exceeds threshold, it's an anomaly
                    if deviation > threshold:
                        anomaly = {
                            "type": "system_anomaly",
                            "metric": metric,
                            "current_value": current_value,
                            "baseline_mean": mean_val,
                            "deviation": deviation,
                            "severity": "critical" if deviation > threshold * 2 else "high",
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        anomalies.append(anomaly)
        
        return anomalies
    
    def _assess_behavioral_risk(self, anomalies: List[Dict]) -> str:
        """
        Assess overall risk level based on detected behavioral anomalies
        """
        if not anomalies:
            return "low"
            
        # Count severities
        severity_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for anomaly in anomalies:
            severity = anomaly.get("severity", "medium")
            severity_counts[severity] += 1
            
        # Determine risk level
        if severity_counts["critical"] > 0 or severity_counts["high"] > 2:
            return "critical"
        elif severity_counts["high"] > 0 or severity_counts["medium"] > 3:
            return "high"
        elif severity_counts["medium"] > 0:
            return "medium"
        else:
            return "low"
    
    def _assess_system_risk(self, anomalies: List[Dict]) -> str:
        """
        Assess overall risk level based on detected system anomalies
        """
        if not anomalies:
            return "low"
            
        # Count severities
        severity_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for anomaly in anomalies:
            severity = anomaly.get("severity", "medium")
            severity_counts[severity] += 1
            
        # System anomalies are generally more critical
        if severity_counts["critical"] > 0:
            return "critical"
        elif severity_counts["high"] > 0:
            return "high"
        elif severity_counts["medium"] > 0:
            return "medium"
        else:
            return "low"
    
    def _generate_behavioral_insights(self, member_id: str, behavior_data: Dict, anomalies: List[Dict]) -> List[Dict]:
        """
        Generate behavioral insights using AI analysis
        """
        # In a real implementation, this would use the AI threat detection system
        # to generate meaningful insights about member behavior patterns
        
        insights = []
        
        # Simple heuristic-based insights for now
        login_frequency = behavior_data.get("login_frequency", 0)
        if login_frequency > 10:  # More than 10 logins per day is unusual
            insights.append({
                "type": "excessive_login_activity",
                "description": fMember {member_id} has excessive login activity",
                "confidence": 0.8,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            })
        
        data_access_count = behavior_data.get("data_access_count", 0)
        if data_access_count > 50:  # More than 50 data accesses per day is unusual
            insights.append({
                "type": "excessive_data_access",
                "description": fMember {member_id} has excessive data access activity",
                "confidence": 0.75,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            })
        
        return insights
    
    def _generate_behavioral_recommendations(self, anomalies: List[Dict], risk_level: str) -> List[str]:
        """
        Generate recommendations based on behavioral anomalies
        """
        recommendations = []
        
        if risk_level in ["high", "critical"]:
            recommendations.append("Immediately review member account security")
            recommendations.append("Consider temporarily suspending account")
            recommendations.append("Require password reset and MFA verification")
        
        for anomaly in anomalies:
            if anomaly.get("type") == "behavioral_anomaly":
                metric = anomaly.get("metric", "")
                if "login" in metric:
                    recommendations.append("Review login pattern for suspicious activity")
                elif "data_access" in metric:
                    recommendations.append("Audit data access permissions for member")
                elif "transfer" in metric:
                    recommendations.append("Review financial transaction patterns")
        
        if not recommendations:
            recommendations.append("Continue monitoring member behavior")
            recommendations.append("Update behavioral baselines with recent activity")
        
        return list(set(recommendations))  # Remove duplicates
    
    def _generate_system_recommendations(self, anomalies: List[Dict], risk_level: str) -> List[str]:
        """
        Generate recommendations based on system anomalies
        """
        recommendations = []
        
        if risk_level == "critical":
            recommendations.append("Immediately engage Guardian security protocols")
            recommendations.append("Isolate affected system components")
            recommendations.append("Initiate emergency backup procedures")
            recommendations.append("Alert system administrators")
        elif risk_level == "high":
            recommendations.append("Increase monitoring frequency")
            recommendations.append("Review system configurations")
            recommendations.append("Prepare contingency plans")
        
        for anomaly in anomalies:
            metric = anomaly.get("metric", "")
            if "cpu" in metric:
                recommendations.append("Check for resource-intensive processes")
            elif "memory" in metric:
                recommendations.append("Investigate memory leaks or allocation issues")
            elif "network" in metric:
                recommendations.append("Analyze network traffic for unusual patterns")
            elif "disk" in metric:
                recommendations.append("Check disk I/O and storage capacity")
        
        if not recommendations:
            recommendations.append("Continue system monitoring")
            recommendations.append("Update performance baselines with recent metrics")
        
        return list(set(recommendations))  # Remove duplicates
    
    def _engage_guardian_protocols(self, component: str, analysis_result: Dict):
        """
        Engage Guardian security protocols for critical system anomalies
        """
        self.guardian_core._log_security_event(
            "GUARDIAN_PROTOCOLS_ENGAGED",
            "critical",
            f"Guardian protocols engaged for component {component}",
            source_module="SentientBehavioralAnalytics",
            details=analysis_result
        )
        
        # In a real implementation, this would communicate with the Guardian system
        # to initiate protective measures like:
        # 1. Isolating the affected component
        # 2. Increasing logging and monitoring
        # 3. Notifying security personnel
        # 4. Initiating failover procedures if applicable