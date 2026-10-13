import type { AriaAttributes, AriaRole, ComponentType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLMotionProps, Target, Transition, Variants } from 'framer-motion';

/*
 * Scroll reveals for the storefront: one entrance language, played once per element. Only opacity and
 * transform move, so nothing shifts layout. The hidden state exists only as framer-motion's `initial` (never a
 * CSS class), and under prefers-reduced-motion every piece renders as the plain element.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Starts once the element's top edge is a little way into the screen, and never replays when scrolling back.
// It asks for any part of the element, not a share of its height: a list several screens tall (a phone held
// sideways) could never fit that share and would stay hidden.
// The margin leaves a band at the bottom of the screen that does not count, so the last thing on a page
// (within 12% of its end) must not be a reveal
const VIEWPORT = { once: true, amount: 'some', margin: '0px 0px -12% 0px' } as const;

type RevealTag = 'div' | 'li' | 'ul' | 'ol' | 'section' | 'figure' | 'p' | 'span';

// One lookup instead of motion[as] (a union of element types cannot be rendered as JSX), and instead of
// motion.create() in render (a new component type every render would remount the element).
// `satisfies` keeps the check that every RevealTag has an entry; the cast only unifies the props type
const motionTags = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  section: motion.section,
  figure: motion.figure,
  p: motion.p,
  span: motion.span,
} satisfies Record<RevealTag, unknown> as unknown as Record<RevealTag, ComponentType<HTMLMotionProps<'div'>>>;

interface Timing {
  /** Seconds before the element starts. It replaces the slot a group's stagger gives it, so skip it inside groups */
  delay?: number;
  /** Seconds between the items nested inside this element */
  stagger?: number;
  /** Seconds between this element starting and its first nested item starting */
  childDelay?: number;
}

// Only the keys that were asked for: a transition-level delay would replace the offset the parent forwards
const timing = ({ delay, stagger, childDelay }: Timing = {}): Transition => ({
  ...(delay !== undefined && { delay }),
  ...(stagger !== undefined && { staggerChildren: stagger }),
  ...(childDelay !== undefined && { delayChildren: childDelay }),
});

const entrance = (hidden: Target, visible: Target, transition: Transition): Variants => ({
  hidden,
  show: (custom?: Timing) => ({ ...visible, transition: { ...transition, ...timing(custom) } }),
});

const tween = (duration: number): Transition => ({ duration, ease: EASE });

// Every entrance ends at the identity (y/x 0, scale 1, opacity 1), so nothing keeps a transform at rest
const entrances = {
  rise: entrance({ opacity: 0, y: 20 }, { opacity: 1, y: 0 }, tween(0.5)),
  slide: entrance({ opacity: 0, x: 32 }, { opacity: 1, x: 0 }, tween(0.5)),
  pop: entrance({ opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }, { type: 'spring', stiffness: 300, damping: 18 }),
  settle: entrance({ opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1 }, tween(0.7)),
  draw: entrance({ scaleX: 0 }, { scaleX: 1 }, tween(0.4)),
  light: entrance({ opacity: 0.25, scale: 0.6 }, { opacity: 1, scale: 1 }, tween(0.3)),
};

// The group itself never moves; it only hands "show" to its items, a stagger apart
const groupVariants: Variants = {
  hidden: {},
  show: (stagger?: number) => ({ transition: { staggerChildren: stagger } }),
};

interface BoxProps extends AriaAttributes {
  /** Element to render, so the animated element can itself be the grid cell or list item. Defaults to `div` */
  as?: RevealTag;
  id?: string;
  role?: AriaRole;
  className?: string;
  children?: ReactNode;
}

interface MotionBoxProps extends BoxProps {
  variants: Variants;
  custom?: unknown;
  /** The element that watches the viewport and starts "show"; the items inside it only follow */
  trigger?: boolean;
}

function MotionBox({ as = 'div', variants, custom, trigger = false, children, ...rest }: MotionBoxProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  const Tag = motionTags[as];
  const watch = trigger ? { initial: 'hidden', whileInView: 'show', viewport: VIEWPORT } : undefined;

  return (
    <Tag variants={variants} custom={custom} {...watch} {...rest}>
      {children}
    </Tag>
  );
}

interface RevealProps extends BoxProps, Timing {
  /** `bottom` rises 20px; `right` slides in 32px from the right (the caller must clip the x axis) */
  from?: 'bottom' | 'right';
}

/** One element that fades in with a short rise when it scrolls into view. Plays once. */
export function Reveal({ from = 'bottom', delay, stagger, childDelay, ...rest }: RevealProps) {
  return (
    <MotionBox
      trigger
      variants={from === 'right' ? entrances.slide : entrances.rise}
      custom={{ delay, stagger, childDelay }}
      {...rest}
    />
  );
}

interface RevealGroupProps extends BoxProps {
  /** Seconds between one item and the next, in reading order. Defaults to 0.08 */
  stagger?: number;
}

/** Container that starts once when it scrolls into view and brings its `RevealItem`s in one after another. */
export function RevealGroup({ stagger = 0.08, ...rest }: RevealGroupProps) {
  return <MotionBox trigger variants={groupVariants} custom={stagger} {...rest} />;
}

interface RevealItemProps extends BoxProps, Pick<Timing, 'stagger' | 'childDelay'> {
  /**
   * `rise` (default): fade plus 20px rise. `pop`: scale 0.85 to 1 with a soft spring. `settle`: scale 1.04 to 1,
   * slower, for photos. `draw`: scaleX 0 to 1 (add `origin-left`). `light`: opacity 0.25 and scale 0.6 to 1.
   */
  variant?: keyof typeof entrances;
}

/**
 * Child of a `RevealGroup`, `Reveal` or another `RevealItem`: it follows whoever is watching the viewport.
 * Items nested in an item start `childDelay` after it, `stagger` apart.
 *
 * An item has to mount together with the element it follows: one added after that element already played
 * (a list filled by a request, say) is never told to show. Render the group inside the loaded branch.
 */
export function RevealItem({ variant = 'rise', stagger, childDelay, ...rest }: RevealItemProps) {
  return <MotionBox variants={entrances[variant]} custom={{ stagger, childDelay }} {...rest} />;
}
