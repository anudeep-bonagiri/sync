-- ============================================================================
-- PostgreSQL Schema for Agentic Telecom Analytics Platform
-- ============================================================================
-- This schema defines a clean, scalable data model for future expansion.
-- Currently, the application uses in-memory/mock data and does NOT connect
-- to this database. This schema is for planning and future development.
-- ============================================================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: For vector similarity search in RAG documents, enable pgvector extension:
-- CREATE EXTENSION IF NOT EXISTS vector;
-- This is optional and only needed if using embedding_vector column in rag_documents table.

-- ============================================================================
-- Network Regions Table
-- ============================================================================
-- Stores geographic network regions with their health status and location data.
-- Used for network monitoring, outage tracking, and regional analytics.
-- ============================================================================
CREATE TABLE network_regions (
    region_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('healthy', 'warning', 'critical')),
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast status-based queries (common in dashboards)
CREATE INDEX idx_network_regions_status ON network_regions(status);
-- Index for location-based queries (geospatial searches)
CREATE INDEX idx_network_regions_location ON network_regions(latitude, longitude);
-- Index for time-based queries (recent updates)
CREATE INDEX idx_network_regions_last_updated ON network_regions(last_updated DESC);

-- ============================================================================
-- Churn & Loyalty Metrics Table
-- ============================================================================
-- Tracks customer churn, loyalty, competitor loss, and related business metrics.
-- Supports time-series analysis and trend identification.
-- ============================================================================
CREATE TABLE churn_loyalty_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('churn', 'loyalty', 'competitor_loss', 'retention', 'acquisition')),
    value DECIMAL(15, 4) NOT NULL,
    time_period TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB, -- Flexible storage for additional metric attributes
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for category-based queries (filtering by metric type)
CREATE INDEX idx_churn_loyalty_category ON churn_loyalty_metrics(category);
-- Index for time-series queries (trending over time)
CREATE INDEX idx_churn_loyalty_time_period ON churn_loyalty_metrics(time_period DESC);
-- Composite index for common dashboard queries (category + time)
CREATE INDEX idx_churn_loyalty_category_time ON churn_loyalty_metrics(category, time_period DESC);

-- ============================================================================
-- LLM Analysis History Table
-- ============================================================================
-- Stores all LLM agent analysis runs for auditability, reproducibility,
-- and learning from past agent decisions. Critical for agent improvement.
-- ============================================================================
CREATE TABLE llm_analysis_history (
    analysis_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(100) NOT NULL,
    input_text TEXT NOT NULL,
    output_text TEXT NOT NULL,
    confidence_score DECIMAL(5, 4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    model_used VARCHAR(100),
    tokens_used INTEGER,
    execution_time_ms INTEGER,
    metadata JSONB, -- Store additional context like temperature, top_p, etc.
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for agent-based queries (filtering by agent type)
CREATE INDEX idx_llm_analysis_agent_name ON llm_analysis_history(agent_name);
-- Index for time-based queries (recent analyses)
CREATE INDEX idx_llm_analysis_created_at ON llm_analysis_history(created_at DESC);
-- Index for confidence-based queries (quality filtering)
CREATE INDEX idx_llm_analysis_confidence ON llm_analysis_history(confidence_score DESC);
-- Full-text search index for input/output text (semantic search)
CREATE INDEX idx_llm_analysis_input_text ON llm_analysis_history USING gin(to_tsvector('english', input_text));
CREATE INDEX idx_llm_analysis_output_text ON llm_analysis_history USING gin(to_tsvector('english', output_text));

-- ============================================================================
-- RAG Documents Table
-- ============================================================================
-- Stores documents used in Retrieval-Augmented Generation (RAG) system.
-- Includes customer sentiment logs, device telemetry, network patterns, etc.
-- ============================================================================
CREATE TABLE rag_documents (
    doc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(255) NOT NULL, -- e.g., 'customer_sentiment_logs', 'device_telemetry', 'network_outage_patterns'
    document_type VARCHAR(100), -- e.g., 'log', 'report', 'telemetry', 'pattern'
    embedding_vector VECTOR(1536), -- For vector similarity search (requires pgvector extension)
    metadata JSONB, -- Store chunk info, file path, original source, etc.
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for source-based queries (filtering by document source)
CREATE INDEX idx_rag_documents_source ON rag_documents(source);
-- Index for document type queries
CREATE INDEX idx_rag_documents_type ON rag_documents(document_type);
-- Full-text search index for content (keyword search)
CREATE INDEX idx_rag_documents_content ON rag_documents USING gin(to_tsvector('english', content));
-- Index for time-based queries (recent documents)
CREATE INDEX idx_rag_documents_created_at ON rag_documents(created_at DESC);
-- Note: Vector similarity index would be created separately if pgvector is enabled:
-- CREATE INDEX idx_rag_documents_embedding ON rag_documents USING ivfflat (embedding_vector vector_cosine_ops);

-- ============================================================================
-- Agent Logs Table
-- ============================================================================
-- Comprehensive logging for all agent executions. Enables debugging,
-- performance monitoring, and audit trails. Links to run_id for workflow tracking.
-- ============================================================================
CREATE TABLE agent_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(100) NOT NULL,
    log_message TEXT NOT NULL,
    log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('debug', 'info', 'warn', 'error', 'critical')),
    run_id UUID, -- Links logs to a specific agent run/workflow execution
    execution_context JSONB, -- Store state, metadata, stack traces, etc.
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for agent-based queries (filtering by agent)
CREATE INDEX idx_agent_logs_agent_name ON agent_logs(agent_name);
-- Index for run-based queries (all logs for a workflow)
CREATE INDEX idx_agent_logs_run_id ON agent_logs(run_id);
-- Index for log level queries (error monitoring)
CREATE INDEX idx_agent_logs_level ON agent_logs(log_level);
-- Index for time-based queries (recent logs)
CREATE INDEX idx_agent_logs_created_at ON agent_logs(created_at DESC);
-- Composite index for common queries (agent + time)
CREATE INDEX idx_agent_logs_agent_time ON agent_logs(agent_name, created_at DESC);

-- ============================================================================
-- User Interaction Events Table
-- ============================================================================
-- Tracks user interactions with the dashboard for analytics, UX improvement,
-- and feature usage insights. Supports future A/B testing and personalization.
-- ============================================================================
CREATE TABLE user_interaction_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Nullable for demo/anonymous usage
    event_type VARCHAR(100) NOT NULL, -- e.g., 'dashboard_view', 'agent_trigger', 'filter_applied', 'export_data'
    event_details JSONB NOT NULL, -- Flexible storage for event-specific data
    session_id UUID, -- Track user sessions
    ip_address INET, -- For analytics (anonymized in production)
    user_agent TEXT, -- Browser/client information
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for user-based queries (user activity tracking)
CREATE INDEX idx_user_events_user_id ON user_interaction_events(user_id);
-- Index for event type queries (feature usage analytics)
CREATE INDEX idx_user_events_type ON user_interaction_events(event_type);
-- Index for session-based queries (session analytics)
CREATE INDEX idx_user_events_session_id ON user_interaction_events(session_id);
-- Index for time-based queries (temporal analytics)
CREATE INDEX idx_user_events_created_at ON user_interaction_events(created_at DESC);
-- Composite index for common analytics queries (type + time)
CREATE INDEX idx_user_events_type_time ON user_interaction_events(event_type, created_at DESC);

-- ============================================================================
-- Optional: Agent Run Tracking Table
-- ============================================================================
-- Tracks complete agent workflow runs for performance analysis and debugging.
-- This table can be referenced by agent_logs.run_id for full workflow context.
-- ============================================================================
CREATE TABLE agent_runs (
    run_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_type VARCHAR(100), -- e.g., 'react_workflow', 'single_agent', 'multi_agent'
    agents_involved TEXT[], -- Array of agent names involved
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    input_query TEXT,
    final_result JSONB,
    execution_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Index for status-based queries (monitoring active runs)
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
-- Index for time-based queries (recent runs)
CREATE INDEX idx_agent_runs_created_at ON agent_runs(created_at DESC);
-- Index for workflow type queries
CREATE INDEX idx_agent_runs_workflow_type ON agent_runs(workflow_type);

-- ============================================================================
-- Foreign Key Constraints (if relationships are needed)
-- ============================================================================
-- Note: Currently, tables are designed to be loosely coupled. Add foreign keys
-- as relationships become clear during development.

-- Example: Link agent_logs to agent_runs
-- ALTER TABLE agent_logs ADD CONSTRAINT fk_agent_logs_run_id 
--     FOREIGN KEY (run_id) REFERENCES agent_runs(run_id) ON DELETE SET NULL;

-- ============================================================================
-- Triggers for Automatic Timestamp Updates
-- ============================================================================
-- Automatically update updated_at timestamp on row modification

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_network_regions_updated_at 
    BEFORE UPDATE ON network_regions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rag_documents_updated_at 
    BEFORE UPDATE ON rag_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================
COMMENT ON TABLE network_regions IS 'Geographic network regions with health status and location data for monitoring and analytics';
COMMENT ON TABLE churn_loyalty_metrics IS 'Time-series metrics for customer churn, loyalty, and competitive analysis';
COMMENT ON TABLE llm_analysis_history IS 'Complete audit trail of all LLM agent analyses for reproducibility and improvement';
COMMENT ON TABLE rag_documents IS 'Documents used in RAG system for context-aware agent responses';
COMMENT ON TABLE agent_logs IS 'Comprehensive logging for all agent executions and workflows';
COMMENT ON TABLE user_interaction_events IS 'User interaction tracking for dashboard analytics and UX improvement';
COMMENT ON TABLE agent_runs IS 'Workflow execution tracking linking multiple agent logs to complete runs';

COMMENT ON COLUMN network_regions.status IS 'Network health status: healthy, warning, or critical';
COMMENT ON COLUMN churn_loyalty_metrics.category IS 'Metric category: churn, loyalty, competitor_loss, retention, or acquisition';
COMMENT ON COLUMN llm_analysis_history.confidence_score IS 'Agent confidence in analysis output (0.0 to 1.0)';
COMMENT ON COLUMN rag_documents.embedding_vector IS 'Vector embedding for semantic similarity search (requires pgvector extension)';
COMMENT ON COLUMN agent_logs.run_id IS 'Links to agent_runs table for complete workflow context';
COMMENT ON COLUMN user_interaction_events.user_id IS 'Nullable for demo/anonymous usage tracking';

