-- ============================================================================
-- Seed Data for Agentic Telecom Analytics Platform
-- ============================================================================
-- This file contains commented-out placeholder INSERT statements for
-- demonstrating how real carrier data would populate the database.
-- Uncomment and modify these statements when ready to seed the database.
-- ============================================================================

-- ============================================================================
-- Network Regions Seed Data
-- ============================================================================
-- Example: Populating network regions with real carrier geographic data

/*
INSERT INTO network_regions (name, latitude, longitude, status, explanation, last_updated) VALUES
    ('Northeast Corridor', 40.7128, -74.0060, 'healthy', 'Primary fiber backbone region with 99.9% uptime. All nodes operational.', NOW() - INTERVAL '5 minutes'),
    ('Pacific Northwest', 47.6062, -122.3321, 'warning', 'Elevated latency detected in Seattle metro. Investigating routing issues.', NOW() - INTERVAL '12 minutes'),
    ('Texas Triangle', 29.7604, -95.3698, 'critical', 'Major outage affecting Houston-Dallas-Austin corridor. Emergency response team deployed.', NOW() - INTERVAL '2 minutes'),
    ('California Coast', 34.0522, -118.2437, 'healthy', 'All systems normal. Peak traffic handled efficiently.', NOW() - INTERVAL '8 minutes'),
    ('Great Lakes', 41.8781, -87.6298, 'healthy', 'Stable performance across all metrics. No issues detected.', NOW() - INTERVAL '15 minutes'),
    ('Southeast Hub', 33.7490, -84.3880, 'warning', 'Intermittent packet loss in Atlanta region. Monitoring closely.', NOW() - INTERVAL '3 minutes');
*/

-- ============================================================================
-- Churn & Loyalty Metrics Seed Data
-- ============================================================================
-- Example: Historical churn and loyalty metrics for trend analysis

/*
INSERT INTO churn_loyalty_metrics (category, value, time_period, metadata) VALUES
    -- Churn metrics
    ('churn', 2.3, NOW() - INTERVAL '1 month', '{"segment": "premium", "reason": "price_sensitivity"}'),
    ('churn', 1.8, NOW() - INTERVAL '2 months', '{"segment": "premium", "reason": "price_sensitivity"}'),
    ('churn', 3.1, NOW() - INTERVAL '3 months', '{"segment": "premium", "reason": "price_sensitivity"}'),
    ('churn', 4.2, NOW() - INTERVAL '1 month', '{"segment": "standard", "reason": "service_quality"}'),
    
    -- Loyalty metrics
    ('loyalty', 87.5, NOW() - INTERVAL '1 month', '{"nps_score": 72, "retention_rate": 0.94}'),
    ('loyalty', 89.2, NOW() - INTERVAL '2 months', '{"nps_score": 75, "retention_rate": 0.95}'),
    ('loyalty', 85.8, NOW() - INTERVAL '3 months', '{"nps_score": 68, "retention_rate": 0.92}'),
    
    -- Competitor loss metrics
    ('competitor_loss', 12.3, NOW() - INTERVAL '1 month', '{"primary_competitor": "Verizon", "loss_reason": "coverage"}'),
    ('competitor_loss', 15.1, NOW() - INTERVAL '2 months', '{"primary_competitor": "AT&T", "loss_reason": "pricing"}'),
    ('competitor_loss', 10.8, NOW() - INTERVAL '3 months', '{"primary_competitor": "T-Mobile", "loss_reason": "promotions"}'),
    
    -- Retention metrics
    ('retention', 94.2, NOW() - INTERVAL '1 month', '{"cohort": "2023-Q1", "retention_type": "annual"}'),
    ('retention', 91.7, NOW() - INTERVAL '2 months', '{"cohort": "2023-Q2", "retention_type": "annual"}'),
    
    -- Acquisition metrics
    ('acquisition', 125000, NOW() - INTERVAL '1 month', '{"channel": "retail", "campaign": "summer_promo"}'),
    ('acquisition', 142000, NOW() - INTERVAL '2 months', '{"channel": "online", "campaign": "device_upgrade"}');
*/

-- ============================================================================
-- LLM Analysis History Seed Data
-- ============================================================================
-- Example: Historical agent analyses for learning and pattern recognition

/*
INSERT INTO llm_analysis_history (agent_name, input_text, output_text, confidence_score, model_used, tokens_used, execution_time_ms, metadata) VALUES
    ('NetworkAnalysisAgent', 
     'Analyze network health across all regions and identify critical issues.',
     'Network analysis complete. 3 critical issues detected in Texas Triangle region. Recommended immediate routing adjustments and capacity scaling.',
     0.92,
     'gemini-2.0-flash-exp',
     2450,
     1250,
     '{"temperature": 0.3, "top_p": 0.9, "regions_analyzed": 6}'),
    
    ('CustomerAnalyticsAgent',
     'Identify top customer pain points from sentiment data.',
     'Top pain points: 1) Billing confusion (23% mentions), 2) Coverage gaps (18% mentions), 3) Slow customer service (15% mentions).',
     0.88,
     'gemini-2.0-flash-exp',
     1890,
     980,
     '{"temperature": 0.4, "data_sources": ["twitter", "support_tickets"], "sentiment_threshold": 0.3}'),
    
    ('SentimentAgent',
     'Analyze customer sentiment trends for Q4 2024.',
     'Overall sentiment: 68% positive, 22% neutral, 10% negative. Positive trend observed in network reliability mentions. Negative trend in pricing discussions.',
     0.85,
     'nvidia-llama-3.1-70b',
     3200,
     2100,
     '{"temperature": 0.2, "time_period": "2024-Q4", "sources_analyzed": 50000}'),
    
    ('SelfHealingAgent',
     'Generate repair recommendations for critical network issues.',
     'Recommended actions: 1) Reroute traffic via backup paths (cost: $500, downtime: 0min), 2) Deploy emergency capacity (cost: $2000, downtime: 15min). Action 1 recommended.',
     0.91,
     'gemini-2.0-flash-exp',
     1650,
     890,
     '{"temperature": 0.3, "issue_severity": "critical", "affected_customers": 45000}');
*/

-- ============================================================================
-- RAG Documents Seed Data
-- ============================================================================
-- Example: Populating RAG system with carrier knowledge base documents

/*
INSERT INTO rag_documents (title, content, source, document_type, metadata) VALUES
    ('Customer Sentiment Logs - Q4 2024',
     'Aggregated customer sentiment data from social media, support tickets, and surveys. Key themes: network reliability improvements noted, pricing concerns persist, customer service satisfaction increasing.',
     'customer_sentiment_logs',
     'log',
     '{"time_period": "2024-Q4", "total_mentions": 50000, "chunk_index": 1, "total_chunks": 5}'),
    
    ('Device Telemetry - Network Performance',
     'Real-time device telemetry showing network performance metrics. Average latency: 45ms, packet loss: 0.02%, throughput: 850 Mbps. All metrics within acceptable ranges.',
     'device_telemetry',
     'telemetry',
     '{"collection_date": "2024-12-15", "devices_sampled": 100000, "chunk_index": 1, "total_chunks": 3}'),
    
    ('Network Outage Patterns - Historical Analysis',
     'Analysis of historical network outages reveals patterns: 1) Weather-related outages peak in Q2, 2) Equipment failures most common in aging infrastructure regions, 3) Planned maintenance causes 60% of scheduled downtime.',
     'network_outage_patterns',
     'pattern',
     '{"analysis_period": "2020-2024", "total_outages": 1247, "chunk_index": 1, "total_chunks": 8}'),
    
    ('Repair Outcomes - Success Metrics',
     'Repair action outcomes: Automated rerouting success rate: 94%, Manual intervention required: 6%, Average resolution time: 12 minutes, Customer impact minimized in 98% of cases.',
     'repair_outcomes',
     'report',
     '{"report_date": "2024-12-15", "repairs_analyzed": 500, "chunk_index": 1, "total_chunks": 2}');
*/

-- ============================================================================
-- Agent Logs Seed Data
-- ============================================================================
-- Example: Agent execution logs for debugging and monitoring

/*
INSERT INTO agent_logs (agent_name, log_message, log_level, run_id, execution_context) VALUES
    ('NetworkAnalysisAgent',
     'Starting network health analysis across 6 regions',
     'info',
     '550e8400-e29b-41d4-a716-446655440000',
     '{"workflow": "network_monitoring", "regions_count": 6}'),
    
    ('NetworkAnalysisAgent',
     'Critical issue detected in Texas Triangle region: latency spike to 450ms',
     'warn',
     '550e8400-e29b-41d4-a716-446655440000',
     '{"region": "Texas Triangle", "latency": 450, "threshold": 200}'),
    
    ('SelfHealingAgent',
     'Generated 3 repair recommendations with cost-benefit analysis',
     'info',
     '550e8400-e29b-41d4-a716-446655440001',
     '{"recommendations_count": 3, "analysis_time_ms": 890}'),
    
    ('CustomerAnalyticsAgent',
     'Error: Failed to fetch sentiment data from external API',
     'error',
     '550e8400-e29b-41d4-a716-446655440002',
     '{"error": "API timeout", "retry_count": 3, "fallback": "using_cached_data"}'),
    
    ('SentimentAgent',
     'Analysis complete: 68% positive sentiment, trending upward',
     'info',
     '550e8400-e29b-41d4-a716-446655440003',
     '{"sentiment_score": 0.68, "trend": "up", "sources_analyzed": 50000}');
*/

-- ============================================================================
-- User Interaction Events Seed Data
-- ============================================================================
-- Example: User interaction tracking for dashboard analytics

/*
INSERT INTO user_interaction_events (user_id, event_type, event_details, session_id, ip_address, user_agent) VALUES
    (NULL, -- Anonymous user for demo
     'dashboard_view',
     '{"page": "network_map", "duration_seconds": 45, "filters_applied": ["status:critical"]}',
     '660e8400-e29b-41d4-a716-446655440000',
     '192.168.1.100',
     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
    
    (NULL,
     'agent_trigger',
     '{"agent": "NetworkAnalysisAgent", "input": "Analyze all regions", "trigger_source": "button_click"}',
     '660e8400-e29b-41d4-a716-446655440000',
     '192.168.1.100',
     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
    
    (NULL,
     'filter_applied',
     '{"component": "churn_insights", "filter_type": "time_range", "value": "last_3_months"}',
     '660e8400-e29b-41d4-a716-446655440001',
     '192.168.1.101',
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
    
    (NULL,
     'export_data',
     '{"export_type": "network_analysis", "format": "csv", "rows_exported": 150}',
     '660e8400-e29b-41d4-a716-446655440001',
     '192.168.1.101',
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
*/

-- ============================================================================
-- Agent Runs Seed Data
-- ============================================================================
-- Example: Complete workflow execution tracking

/*
INSERT INTO agent_runs (workflow_type, agents_involved, status, input_query, final_result, execution_time_ms, completed_at) VALUES
    ('react_workflow',
     ARRAY['NetworkAnalysisAgent', 'SelfHealingAgent', 'CustomerAnalyticsAgent'],
     'completed',
     'Analyze network issues and recommend repairs',
     '{"issues_found": 3, "recommendations_generated": 5, "confidence": 0.89}',
     3450,
     NOW() - INTERVAL '10 minutes'),
    
    ('single_agent',
     ARRAY['SentimentAgent'],
     'completed',
     'Analyze customer sentiment for Q4',
     '{"sentiment_score": 0.68, "trend": "up", "insights_count": 12}',
     2100,
     NOW() - INTERVAL '25 minutes'),
    
    ('multi_agent',
     ARRAY['ResearchAgent', 'WriterAgent', 'EditorAgent'],
     'running',
     'Generate comprehensive network health report',
     NULL,
     NULL,
     NULL);
*/

-- ============================================================================
-- Notes for Production Seeding
-- ============================================================================
-- When ready to seed production data:
-- 1. Replace placeholder UUIDs with actual generated UUIDs or use DEFAULT
-- 2. Adjust timestamps to reflect actual data collection periods
-- 3. Populate embedding_vector column if using pgvector for semantic search
-- 4. Ensure JSONB metadata fields match your application's expected structure
-- 5. Consider using COPY commands for bulk data loading from CSV files
-- 6. Use transactions to ensure data consistency during seeding
-- 7. Validate foreign key relationships before inserting related records
-- 8. For time-series data (churn_loyalty_metrics), generate realistic sequences
-- 9. For agent_logs, ensure run_id values match existing agent_runs records
-- 10. Anonymize or remove sensitive data (IP addresses, user agents) in production

