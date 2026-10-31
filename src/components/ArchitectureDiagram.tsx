import React, { useState } from 'react';
import type { Project, ArchitectureNode } from '../types';
import { Layers, ArrowRight, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';

interface ArchitectureDiagramProps {
  project: Project;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ project }) => {
  const [activeNode, setActiveNode] = useState<ArchitectureNode | null>(null);

  const nodes = project.architectureNodes || [];
  const details = project.architectureDetails;

  const getStatusBadge = (status: 'implemented' | 'partially-implemented' | 'planned') => {
    switch (status) {
      case 'implemented':
        return <span className="status-badge badge-implemented font-mono">IMPLEMENTED</span>;
      case 'partially-implemented':
        return <span className="status-badge badge-partial font-mono">PARTIALLY IMPLEMENTED</span>;
      case 'planned':
        return <span className="status-badge badge-planned font-mono">PLANNED HARDWARE / FUTURE</span>;
    }
  };

  return (
    <div className="arch-diagram-card">
      <div className="arch-diagram-header font-mono">
        <div className="header-title-wrap">
          <Layers size={16} className="arch-header-icon" />
          <span className="arch-title">{details?.pipelineTitle || `${project.title} Architecture Pipeline`}</span>
        </div>
        <div className="arch-legend font-mono">
          <span className="legend-item"><span className="legend-dot dot-implemented"></span> Implemented</span>
          <span className="legend-item"><span className="legend-dot dot-partial"></span> Partially Implemented</span>
          <span className="legend-item"><span className="legend-dot dot-planned"></span> Planned</span>
        </div>
      </div>

      <p className="arch-summary">{details?.pipelineSummary || project.architectureFlow}</p>

      {/* Visual Component Pipeline Diagram */}
      <div className="pipeline-track-wrapper">
        <div className="pipeline-nodes-scroll">
          {nodes.map((node, idx) => {
            const isSelected = activeNode?.id === node.id;
            return (
              <React.Fragment key={node.id}>
                <button
                  type="button"
                  className={`pipeline-node-box status-${node.status} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setActiveNode(isSelected ? null : node)}
                  title={`Click to view details: ${node.name}`}
                  aria-pressed={isSelected}
                >
                  <div className="node-index font-mono">0{idx + 1}</div>
                  <div className="node-title font-mono">{node.name}</div>
                  <div className="node-status-badge font-mono">
                    {node.status === 'implemented' && 'VERIFIED'}
                    {node.status === 'partially-implemented' && 'PARTIAL'}
                    {node.status === 'planned' && 'PLANNED'}
                  </div>
                </button>
                {idx < nodes.length - 1 && (
                  <div className="pipeline-arrow font-mono" aria-hidden="true">
                    <ArrowRight size={14} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Interactive Active Node Deep-Dive */}
      {activeNode && (
        <div className="node-detail-panel font-mono">
          <div className="detail-panel-header">
            <div className="panel-title-group">
              <Info size={14} className="panel-icon" />
              <span className="panel-node-name">{activeNode.name}</span>
            </div>
            {getStatusBadge(activeNode.status)}
          </div>
          <p className="panel-node-desc">{activeNode.details}</p>
        </div>
      )}

      {/* Detailed Pipeline Breakdown Table/List */}
      {details?.stageExplanation && details.stageExplanation.length > 0 && (
        <div className="pipeline-stages-list">
          <div className="stages-header font-mono">
            <span>// ARCHITECTURE PROCESSING STAGES</span>
            <span className="stages-count">{details.stageExplanation.length} STAGES</span>
          </div>
          <div className="stages-grid">
            {details.stageExplanation.map((stage, sIdx) => (
              <div key={sIdx} className={`stage-card status-${stage.status}`}>
                <div className="stage-top font-mono">
                  <span className="stage-name">{stage.stage}</span>
                  {stage.status === 'implemented' && (
                    <span className="stage-status-indicator status-green font-mono">
                      <CheckCircle2 size={12} /> Implemented
                    </span>
                  )}
                  {stage.status === 'partially-implemented' && (
                    <span className="stage-status-indicator status-amber font-mono">
                      <AlertCircle size={12} /> Partially Implemented
                    </span>
                  )}
                  {stage.status === 'planned' && (
                    <span className="stage-status-indicator status-muted font-mono">
                      <Clock size={12} /> Planned
                    </span>
                  )}
                </div>
                <p className="stage-desc">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .arch-diagram-card {
          border: 1.5px solid var(--border-color-default);
          background-color: var(--bg-surface-secondary);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .arch-diagram-header {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color-default);
        }

        @media (min-width: 680px) {
          .arch-diagram-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: -0.01em;
        }

        .arch-header-icon {
          color: var(--accent-action);
        }

        [data-theme='cyber-contrast'] .arch-header-icon {
          color: var(--accent-highlight);
        }

        .arch-title {
          color: var(--color-text-primary);
        }

        .arch-legend {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem 0.85rem;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-text-muted);
          min-width: 0;
        }

        .legend-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-implemented {
          background-color: var(--status-online);
          box-shadow: 0 0 4px var(--status-online);
        }

        .dot-partial {
          background-color: #fab005;
        }

        .dot-planned {
          background-color: var(--color-text-muted);
          opacity: 0.6;
        }

        .arch-summary {
          font-size: 0.84rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* Pipeline Visual Track */
        .pipeline-track-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
          width: 100%;
          min-width: 0;
          padding-bottom: 0.5rem;
          box-sizing: border-box;
        }

        .pipeline-nodes-scroll {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: max-content;
          padding: 0.25rem 0;
        }

        .pipeline-node-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.6rem 0.8rem;
          background-color: var(--bg-surface);
          border: 1.5px solid var(--border-color-default);
          min-width: 140px;
          max-width: 170px;
          text-align: left;
          cursor: pointer;
          transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
          position: relative;
        }

        .pipeline-node-box:hover,
        .pipeline-node-box.is-selected {
          transform: translateY(-2px);
          box-shadow: 2px 2px 0px var(--color-ink);
        }

        .pipeline-node-box.status-implemented {
          border-left: 4px solid var(--status-online);
        }

        .pipeline-node-box.status-partially-implemented {
          border-left: 4px solid #fab005;
        }

        .pipeline-node-box.status-planned {
          border-left: 4px dashed var(--color-text-muted);
          background-color: var(--bg-surface-tertiary);
          opacity: 0.85;
        }

        .pipeline-node-box.is-selected {
          border-color: var(--accent-action);
          box-shadow: 3px 3px 0px var(--color-ink);
        }

        [data-theme='cyber-contrast'] .pipeline-node-box.is-selected {
          border-color: var(--accent-highlight);
          box-shadow: 0 0 10px rgba(223, 255, 0, 0.2);
        }

        .node-index {
          font-size: 0.62rem;
          color: var(--color-text-muted);
          font-weight: 700;
        }

        .node-title {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.25;
        }

        .node-status-badge {
          font-size: 0.58rem;
          font-weight: 800;
          margin-top: 0.2rem;
          letter-spacing: 0.05em;
        }

        .status-implemented .node-status-badge {
          color: var(--status-online);
        }

        .status-partially-implemented .node-status-badge {
          color: #fab005;
        }

        .status-planned .node-status-badge {
          color: var(--color-text-muted);
        }

        .pipeline-arrow {
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          padding: 0 0.15rem;
          user-select: none;
        }

        /* Active Node Detail Box */
        .node-detail-panel {
          padding: 0.85rem 1rem;
          background-color: var(--bg-surface);
          border: 1.5px solid var(--border-color-default);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          box-shadow: var(--shadow-hard-xs);
        }

        .detail-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .panel-title-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .panel-icon {
          color: var(--accent-action);
        }

        .panel-node-name {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .status-badge {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border: 1px solid var(--border-color-default);
        }

        .badge-implemented {
          background-color: var(--status-online);
          color: #0b0c0e;
        }

        .badge-partial {
          background-color: #fab005;
          color: #0b0c0e;
        }

        .badge-planned {
          background-color: var(--bg-surface-tertiary);
          color: var(--color-text-muted);
        }

        .panel-node-desc {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* Stages List Grid */
        .pipeline-stages-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-top: 1px solid var(--border-color-default);
          padding-top: 0.85rem;
        }

        .stages-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .stages-count {
          color: var(--color-text-accent);
        }

        .stages-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.65rem;
        }

        @media (min-width: 600px) {
          .stages-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stage-card {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 0.65rem 0.85rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color-default);
        }

        .stage-card.status-planned {
          background-color: var(--bg-surface-tertiary);
          border-style: dashed;
        }

        .stage-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 800;
          min-width: 0;
        }

        .stage-name {
          color: var(--color-text-primary);
          min-width: 0;
          word-break: break-word;
        }

        .stage-status-indicator {
          font-size: 0.62rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .status-green {
          color: var(--status-online);
        }

        .status-amber {
          color: #fab005;
        }

        .status-muted {
          color: var(--color-text-muted);
        }

        .stage-desc {
          font-size: 0.74rem;
          line-height: 1.45;
          color: var(--color-text-secondary);
          margin: 0;
        }

        @media (max-width: 600px) {
          .arch-diagram-card {
            padding: 0.85rem;
            gap: 0.85rem;
          }

          .header-title-wrap {
            font-size: 0.8rem;
          }

          .arch-summary {
            font-size: 0.78rem;
          }

          .pipeline-node-box {
            min-width: 120px;
            max-width: 150px;
            padding: 0.5rem 0.65rem;
          }

          .node-index {
            font-size: 0.62rem;
          }

          .node-title {
            font-size: 0.72rem;
          }

          .node-status-badge {
            font-size: 0.58rem;
          }

          .stage-card {
            padding: 0.55rem 0.65rem;
          }

          .stage-desc {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </div>
  );
};
