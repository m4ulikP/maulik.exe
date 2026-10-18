import React from 'react';
import { motion } from 'motion/react';
import { InteractiveSkillTree } from './InteractiveSkillTree';
import { DecryptedText } from './reactbits/DecryptedText';
import {
  sectionHeaderVariants,
  eyebrowVariants,
  titleVariants,
  descVariants,
  contentBlockVariants,
  reducedMotionVariants,
  SECTION_VIEWPORT,
} from '../utils/revealVariants';
import './SkillsSection.css';

interface SkillsSectionProps {
  onSelectProject?: (projectId: string) => void;
  onNavToSection?: (sectionId: string) => void;
  isReducedMotion?: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  onSelectProject,
  onNavToSection,
  isReducedMotion = false,
}) => {
  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-heading">
      <div className="site-container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          variants={isReducedMotion ? reducedMotionVariants : sectionHeaderVariants}
          initial={isReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={SECTION_VIEWPORT}
        >
          <motion.div
            className="section-tag font-mono"
            variants={isReducedMotion ? reducedMotionVariants : eyebrowVariants}
          >
            <span className="tag-index">[ 04 ]</span>
            <DecryptedText
              text="TOOLCHAIN"
              animateOn="view"
              speed={65}
              sequential={true}
              isReducedMotion={isReducedMotion}
            />
          </motion.div>
          <motion.h2
            id="skills-heading"
            className="section-title font-display"
            variants={isReducedMotion ? reducedMotionVariants : titleVariants}
          >
            Technical Skills &amp; Knowledge Map
          </motion.h2>
          <motion.p
            className="section-desc font-body"
            variants={isReducedMotion ? reducedMotionVariants : descVariants}
          >
            An honest, transparent map of programming languages, foundational computer science, active learning, and AI-assisted workflows.
          </motion.p>
        </motion.div>

        {/* Evidence-Based Interactive Skill Tree */}
        <motion.div
          className="skills-interactive-container"
          variants={isReducedMotion ? reducedMotionVariants : contentBlockVariants}
          initial={isReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={SECTION_VIEWPORT}
        >
          <InteractiveSkillTree
            onSelectProject={onSelectProject}
            onNavToSection={onNavToSection}
            isReducedMotion={isReducedMotion}
          />
        </motion.div>
      </div>
    </section>
  );
};
