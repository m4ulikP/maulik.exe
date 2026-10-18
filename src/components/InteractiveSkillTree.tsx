import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SKILL_NODES,
  SKILL_CATEGORIES,
  type SkillNode,
  type SkillCategory,
} from '../data/skillsData';
import './InteractiveSkillTree.css';

interface InteractiveSkillTreeProps {
  onSelectProject?: (projectId: string) => void;
  onNavToSection?: (sectionId: string) => void;
  isReducedMotion?: boolean;
}

interface ConnectionLine {
  id: string;
  source: SkillNode;
  target: SkillNode;
  d: string;
}

export const InteractiveSkillTree: React.FC<InteractiveSkillTreeProps> = ({
  onSelectProject,
  onNavToSection,
  isReducedMotion = false,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<SkillCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'tree' | 'matrix'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 'matrix';
    }
    return 'tree';
  });

  const detailPanelRef = useRef<HTMLDivElement | null>(null);

  // Fast map lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, SkillNode>();
    SKILL_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Compute unique non-directional connection lines
  const connectionLines = useMemo<ConnectionLine[]>(() => {
    const seen = new Set<string>();
    const lines: ConnectionLine[] = [];

    SKILL_NODES.forEach((source) => {
      source.connectedSkillIds.forEach((targetId) => {
        const target = nodeMap.get(targetId);
        if (!target) return;

        const key = [source.id, target.id].sort().join('--');
        if (seen.has(key)) return;
        seen.add(key);

        const midX = (source.x + target.x) / 2;
        const d = `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;

        lines.push({
          id: key,
          source,
          target,
          d,
        });
      });
    });

    return lines;
  }, [nodeMap]);

  // Selected skill node (persistent detail panel)
  const selectedNode = selectedSkillId ? nodeMap.get(selectedSkillId) || null : null;

  // Active hover/focus node (temporary relationship preview only)
  const previewSkillId = hoveredSkillId || focusedSkillId;

  // Connected IDs for persistent selected node
  const selectedConnectedIds = useMemo(() => {
    if (!selectedSkillId) return new Set<string>();
    const active = nodeMap.get(selectedSkillId);
    if (!active) return new Set<string>();
    const set = new Set<string>(active.connectedSkillIds);
    set.add(active.id);
    return set;
  }, [selectedSkillId, nodeMap]);

  // Connected IDs for temporary hover/focus preview node
  const previewConnectedIds = useMemo(() => {
    if (!previewSkillId) return new Set<string>();
    const active = nodeMap.get(previewSkillId);
    if (!active) return new Set<string>();
    const set = new Set<string>(active.connectedSkillIds);
    set.add(active.id);
    return set;
  }, [previewSkillId, nodeMap]);

  // Handle ESC key to clear selection & hover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSkillId(null);
        setHoveredSkillId(null);
        setFocusedSkillId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click to clear selection predictably
  useEffect(() => {
    if (!selectedSkillId) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do not clear if clicking a node (it handles its own toggle)
      if (target.closest('.tree-node-group') || target.closest('.matrix-skill-btn')) {
        return;
      }

      // Do not clear if clicking interactive controls inside the detail panel
      if (detailPanelRef.current && detailPanelRef.current.contains(target)) {
        return;
      }

      // Do not clear if clicking filter chips or view toggle (they have explicit handlers)
      if (target.closest('.skill-tree-controls-bar')) {
        return;
      }

      // Outside click: clear selection
      setSelectedSkillId(null);
      setHoveredSkillId(null);
      setFocusedSkillId(null);
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [selectedSkillId]);

  // Auto-scroll detail panel on mobile when selected
  useEffect(() => {
    if (selectedSkillId && detailPanelRef.current && window.innerWidth < 1024) {
      detailPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSkillId]);

  const handleNodeClick = (id: string) => {
    // Clicking selected node again deselects it
    setSelectedSkillId((prev) => (prev === id ? null : id));
  };

  const handleFilterChange = (cat: SkillCategory | 'all') => {
    setActiveCategoryFilter(cat);
    setSelectedSkillId(null);
    setHoveredSkillId(null);
    setFocusedSkillId(null);
  };

  const handleViewModeChange = (mode: 'tree' | 'matrix') => {
    setViewMode(mode);
    setSelectedSkillId(null);
    setHoveredSkillId(null);
    setFocusedSkillId(null);
  };

  const handleActionClick = (link: NonNullable<SkillNode['projectLink']>) => {
    if (link.type === 'case-study' && onSelectProject) {
      onSelectProject(link.targetId);
    } else if (link.type === 'section' && onNavToSection) {
      onNavToSection(link.targetId);
    } else {
      const el = document.getElementById(link.targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`skill-tree-root ${isReducedMotion ? 'reduced-motion' : ''}`}>
      {/* View & Category Filter Bar */}
      <div className="skill-tree-controls-bar">
        {/* Desktop & Tablet: Wrapping Category Filter Chips */}
        <div className="category-filter-wrap" role="tablist" aria-label="Filter skills by domain">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategoryFilter === 'all'}
            className={`filter-chip font-mono ${activeCategoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span>All Domains</span>
            <span className="chip-count">({SKILL_NODES.length})</span>
          </button>

          {SKILL_CATEGORIES.map((cat) => {
            const count = SKILL_NODES.filter((n) => n.category === cat.id).length;
            const isSelected = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`filter-chip font-mono ${isSelected ? 'active' : ''}`}
                onClick={() => handleFilterChange(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="chip-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Mobile: Compact Accessible Category Dropdown */}
        <div className="category-filter-mobile">
          <label htmlFor="category-select" className="sr-only" data-liquid-ignore="true">
            Filter skills by domain
          </label>
          <div className="category-select-wrapper">
            <select
              id="category-select"
              className="category-select font-mono"
              value={activeCategoryFilter}
              onChange={(e) => handleFilterChange(e.target.value as SkillCategory | 'all')}
              aria-label="Filter skills by domain"
            >
              <option value="all">All Domains ({SKILL_NODES.length})</option>
              {SKILL_CATEGORIES.map((cat) => {
                const count = SKILL_NODES.filter((n) => n.category === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    [{cat.badge}] {cat.label} ({count})
                  </option>
                );
              })}
            </select>
            <span className="category-select-arrow font-mono" aria-hidden="true">▾</span>
          </div>
        </div>

        {/* View Layout Toggle */}
        <div className="view-mode-toggle font-mono" role="group" aria-label="Layout view mode">
          <button
            type="button"
            className={`mode-btn ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('tree')}
            aria-pressed={viewMode === 'tree'}
            title="Interactive Visual Network View"
          >
            <span>Graph View</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === 'matrix' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('matrix')}
            aria-pressed={viewMode === 'matrix'}
            title="Categorized Matrix View"
          >
            <span>Matrix View</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="skill-tree-main-layout">
        {/* Graph Workspace View */}
        {viewMode === 'tree' ? (
          <div
            className="tree-graph-canvas-wrap"
            onClick={() => {
              setSelectedSkillId(null);
              setHoveredSkillId(null);
            }}
          >
            <svg
              className="tree-svg-canvas"
              viewBox="0 0 1000 600"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                {/* Background grid pattern */}
                <pattern id="tree-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                </pattern>
                {/* Active link linear gradients */}
                <linearGradient id="selected-link-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="hover-link-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              <rect
                width="1000"
                height="600"
                fill="url(#tree-grid)"
                className="tree-canvas-bg"
                onClick={() => {
                  setSelectedSkillId(null);
                  setHoveredSkillId(null);
                }}
              />

              {/* Connection Lines Layer */}
              <g className="tree-links-layer">
                {connectionLines.map((link) => {
                  // Check hover connection
                  const isHoverSource = previewSkillId === link.source.id;
                  const isHoverTarget = previewSkillId === link.target.id;
                  const isHoverConnection = isHoverSource || isHoverTarget;

                  // Check persistent selection connection
                  const isSelectSource = selectedSkillId === link.source.id;
                  const isSelectTarget = selectedSkillId === link.target.id;
                  const isSelectConnection = isSelectSource || isSelectTarget;

                  // Dimming logic
                  const hasActiveSelectionOrPreview = Boolean(previewSkillId || selectedSkillId);
                  const isDimmed =
                    hasActiveSelectionOrPreview && !isHoverConnection && !isSelectConnection;

                  let lineModifier = '';
                  if (isSelectConnection) {
                    lineModifier = 'link-selected';
                  } else if (isHoverConnection) {
                    lineModifier = 'link-hovered';
                  } else if (isDimmed) {
                    lineModifier = 'link-dimmed';
                  }

                  return (
                    <path
                      key={link.id}
                      d={link.d}
                      className={`tree-link-path ${lineModifier}`}
                    />
                  );
                })}
              </g>

              {/* Node anchors (SVG coordinates) */}
              <g className="tree-nodes-layer">
                {SKILL_NODES.map((node) => {
                  const isSelected = selectedSkillId === node.id;
                  const isHovered = previewSkillId === node.id;
                  const isConnectedToSelect = !isSelected && selectedConnectedIds.has(node.id);
                  const isConnectedToPreview = !isHovered && previewConnectedIds.has(node.id);

                  // Dimming logic: only dim if a node is focused/selected and this node is not part of either
                  const hasFocus = Boolean(previewSkillId || selectedSkillId);
                  const isRelevant =
                    isSelected || isHovered || isConnectedToSelect || isConnectedToPreview;
                  const isDimmed = hasFocus && !isRelevant;
                  const matchesFilter =
                    activeCategoryFilter === 'all' || activeCategoryFilter === node.category;

                  const nodeClass = [
                    'tree-node-group',
                    isSelected && 'node-selected',
                    isHovered && 'node-hovered',
                    isConnectedToSelect && 'node-connected-selected',
                    isConnectedToPreview && 'node-connected-preview',
                    isDimmed && 'node-dimmed',
                    !matchesFilter && 'node-filtered-out',
                    node.isPlanned && 'node-planned',
                    node.category === 'ai-assisted' && 'node-ai-assisted',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const capsuleWidth = Math.max(node.name.length * 8.2 + 28, 100);
                  const capsuleHeight = 28;

                  return (
                    <g
                      key={node.id}
                      className={nodeClass}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeClick(node.id);
                      }}
                      onMouseEnter={() => setHoveredSkillId(node.id)}
                      onMouseLeave={() => setHoveredSkillId(null)}
                      onFocus={() => setFocusedSkillId(node.id)}
                      onBlur={() => setFocusedSkillId(null)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`${node.name} (${node.categoryLabel} — ${node.proficiency}) - Click to inspect relationships and evidence`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNodeClick(node.id);
                        }
                      }}
                    >
                      {/* Nested inner group for scaling without affecting parent translate */}
                      <g className="node-inner">
                        {/* Interactive Capsule Shape */}
                        <rect
                          x={-capsuleWidth / 2}
                          y={-capsuleHeight / 2}
                          width={capsuleWidth}
                          height={capsuleHeight}
                          rx="14"
                          className="node-capsule"
                        />

                        {/* Category Accent Pip */}
                        <circle
                          cx={-capsuleWidth / 2 + 12}
                          cy="0"
                          r="3.5"
                          className={`node-pip pip-${node.category}`}
                        />

                        {/* Skill Name Label */}
                        <text
                          x={-capsuleWidth / 2 + 22}
                          y="4"
                          className="node-label font-mono"
                        >
                          {node.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        ) : (
          /* Clustered Matrix View (Accessible, mobile-friendly list) */
          <div className="skills-matrix-view">
            {SKILL_CATEGORIES.filter(
              (cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat.id
            ).map((cat) => {
              const nodesInCat = SKILL_NODES.filter((n) => n.category === cat.id);
              return (
                <div key={cat.id} className="matrix-category-group">
                  <div className="matrix-group-header font-mono">
                    <span className="cat-badge">[ {cat.badge} ]</span>
                    <span className="cat-title">{cat.label}</span>
                  </div>

                  <div className="matrix-tags-wrap">
                    {nodesInCat.map((node) => {
                      const isSelected = selectedSkillId === node.id;
                      const isHovered = previewSkillId === node.id;
                      const isConnectedToSelect = !isSelected && selectedConnectedIds.has(node.id);
                      const isConnectedToPreview = !isHovered && previewConnectedIds.has(node.id);
                      const hasFocus = Boolean(previewSkillId || selectedSkillId);
                      const isConnected = isConnectedToSelect || isConnectedToPreview;
                      const isDimmed = hasFocus && !isSelected && !isHovered && !isConnected;

                      return (
                        <button
                          key={node.id}
                          type="button"
                          className={`matrix-skill-btn font-mono ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isConnected ? 'connected' : ''} ${isDimmed ? 'dimmed' : ''} ${node.isPlanned ? 'is-planned' : ''} ${node.category === 'ai-assisted' ? 'is-ai-assisted' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNodeClick(node.id);
                          }}
                          onMouseEnter={() => setHoveredSkillId(node.id)}
                          onMouseLeave={() => setHoveredSkillId(null)}
                          onFocus={() => setFocusedSkillId(node.id)}
                          onBlur={() => setFocusedSkillId(null)}
                          aria-pressed={isSelected}
                          aria-label={`${node.name} (${node.proficiency}) - View details`}
                        >
                          <span className={`pill-pip pip-${node.category}`} aria-hidden="true" />
                          <span className="matrix-skill-name">{node.name}</span>
                          <span className="matrix-proficiency-tag font-mono">{node.proficiency}</span>
                          {node.projectLink && <span className="pill-link-icon" aria-hidden="true">↗</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Persistent Detail Panel: Evidence & Relationships */}
        <aside
          ref={detailPanelRef}
          className={`skill-detail-panel ${selectedNode ? 'has-selection' : 'is-default'}`}
          aria-live="polite"
        >
          {selectedNode ? (
            <div key={selectedNode.id} className="detail-card detail-card-enter">
              {/* Header with Title & Evidence Badge */}
              <div className="detail-header">
                <div className="detail-meta-top font-mono">
                  <span className="detail-category">{selectedNode.categoryLabel}</span>
                  <button
                    type="button"
                    className="detail-close-btn font-mono"
                    onClick={() => setSelectedSkillId(null)}
                    aria-label="Clear skill selection (Escape)"
                    title="Deselect (Esc)"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>

                <div className="detail-badges-row font-mono">
                  <span className="proficiency-pill font-mono">
                    {selectedNode.proficiency}
                  </span>
                  <span className={`evidence-badge badge-${selectedNode.category}`}>
                    {selectedNode.evidenceCategory}
                  </span>
                </div>

                <div className="detail-title-row">
                  <h3 className="detail-title font-display">{selectedNode.name}</h3>
                </div>

                <p className="detail-desc font-body">{selectedNode.description}</p>
              </div>

              <div className="detail-divider" aria-hidden="true" />

              {/* Factual Evidence Callout */}
              <div className="detail-evidence-box">
                <div className="evidence-header font-mono">
                  <span className="evidence-icon" aria-hidden="true">■</span>
                  <span>EVALUATION &amp; EVIDENCE</span>
                </div>
                <div className="evidence-summary font-body">
                  <strong>{selectedNode.evidenceSummary}</strong>
                </div>
                <p className="evidence-details font-mono">
                  {selectedNode.verifiableDetails}
                </p>
              </div>

              {/* Connected Technologies Cluster */}
              {selectedNode.connectedSkillIds.length > 0 && (
                <div className="detail-connections">
                  <span className="connections-label font-mono">
                    CONNECTED ECOSYSTEM ({selectedNode.connectedSkillIds.length}):
                  </span>
                  <div className="connected-chips-row">
                    {selectedNode.connectedSkillIds.map((connId) => {
                      const connNode = nodeMap.get(connId);
                      if (!connNode) return null;
                      return (
                        <button
                          key={connId}
                          type="button"
                          className="conn-chip font-mono"
                          onClick={() => handleNodeClick(connId)}
                          title={`Switch selection to ${connNode.name}`}
                        >
                          <span className={`chip-pip pip-${connNode.category}`} aria-hidden="true" />
                          <span>{connNode.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Verified Project Navigation Link */}
              {selectedNode.projectLink && (
                <div className="detail-project-action">
                  <button
                    type="button"
                    className="btn-project-link font-mono"
                    onClick={() => handleActionClick(selectedNode.projectLink!)}
                  >
                    <span>{selectedNode.projectLink.label}</span>
                    <span className="link-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Concise Intentional Default Panel */
            <div className="detail-default-card">
              <div className="default-header font-mono">
                <span className="default-eyebrow">TRANSPARENT MAP</span>
                <span className="default-badge">CLICK NODE TO INSPECT</span>
              </div>

              <div className="default-title-group">
                <h3 className="default-title font-display">Technical Knowledge Map</h3>
                <p className="default-desc font-body">
                  Click any skill node in the graph or matrix entry to inspect verifiable evidence, academic coursework, and active learning context. Click the selected node again or press <kbd className="esc-key font-mono">Esc</kbd> to deselect.
                </p>
              </div>

              {/* Compact Legend: Status & Visual Conventions */}
              <div className="default-legend-section font-mono">
                <span className="legend-heading">STATUS &amp; VISUAL CONVENTIONS:</span>
                <div className="legend-items-grid">
                  <div className="legend-item">
                    <span className="legend-indicator solid-node" aria-hidden="true">
                      <span className="legend-dot pip-languages" />
                    </span>
                    <div className="legend-text">
                      <span className="legend-term">Solid Capsule</span>
                      <span className="legend-sub">Current / Active Learning</span>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-indicator dashed-node" aria-hidden="true">
                      <span className="legend-dot pip-languages" />
                    </span>
                    <div className="legend-text">
                      <span className="legend-term">Dashed Capsule</span>
                      <span className="legend-sub">Planned Roadmap</span>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-indicator ai-node" aria-hidden="true">
                      <span className="legend-dot pip-ai-assisted" />
                    </span>
                    <div className="legend-text">
                      <span className="legend-term">Violet Accent</span>
                      <span className="legend-sub">AI Workflow (Antigravity)</span>
                    </div>
                  </div>

                  <div className="legend-item">
                    <span className="legend-indicator line-node" aria-hidden="true">
                      <span className="legend-line" />
                    </span>
                    <div className="legend-text">
                      <span className="legend-term">Curved Lines</span>
                      <span className="legend-sub">Conceptual Ecosystem</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
