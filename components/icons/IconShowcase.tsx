"use client";

/**
 * Icon System Showcase
 * Demonstrates how to use Iconsax, LottieFiles, and Motion Design in the portfolio
 *
 * Resources:
 * - Iconsax: https://app.iconsax.io/
 * - LottieFiles: https://lottiefiles.com/
 * - Motion Design: https://motionin.design/dashboard
 */

import { motion } from "framer-motion";
import {
  Iconsax,
  Lottie,
  LordIcon,
  getLordIcon,
  motionVariants,
  motionDesignTokens,
  PORTFOLIO_LOTTIE_ANIMATIONS,
} from "./index";

export function IconShowcase() {
  return (
    <section className="icon-showcase py-24 px-6 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionDesignTokens.easing.springGentle}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-serif italic">
            Système d'Icônes & Animations
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Intégration unifiée d'Iconsax, LottieFiles, LordIcon et Motion Design
            pour une expérience visuelle cohérente et expressive.
          </p>
        </motion.div>

        {/* Iconsax Section */}
        <motion.div
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold">Iconsax Icons</h3>
          <p className="opacity-60">
            Icônes modernes avec 5 variantes : outline, fill, linear, bulk, two-tone
            <br />
            Source : <a href="https://app.iconsax.io/" target="_blank" rel="noopener noreferrer" className="underline text-[var(--color-accent)]">
              iconsax.io
            </a>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Home", variant: "outline", label: "Home Outline" },
              { name: "Home", variant: "fill", label: "Home Fill" },
              { name: "Home", variant: "linear", label: "Home Linear" },
              { name: "Home", variant: "bulk", label: "Home Bulk" },
              { name: "Home", variant: "two-tone", label: "Home Two-tone" },
              { name: "Code", variant: "outline", label: "Code Outline" },
            ].map((icon) => (
              <motion.div
                key={icon.name + icon.variant}
                variants={motionVariants.staggerItem}
                className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)] text-center transition-all hover:border-[var(--color-accent)]"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Iconsax
                  name={icon.name}
                  variant={icon.variant as "outline" | "fill" | "linear" | "bulk" | "two-tone"}
                  size={32}
                  color="var(--color-accent)"
                  className="mx-auto mb-2"
                />
                <p className="text-xs font-mono opacity-60">{icon.label}</p>
                <p className="text-[10px] font-mono opacity-40">{icon.variant}</p>
              </motion.div>
            ))}
          </div>

          {/* Iconsax by Category */}
          <div className="space-y-6">
            {[
              { category: "Navigation", icons: ["Menu", "Close", "ArrowLeft", "ArrowRight", "Search", "Filter"] },
              { category: "Actions", icons: ["Download", "Upload", "Send", "Copy", "Link", "Share", "Edit", "Save"] },
              { category: "Tech/Code", icons: ["Code", "Terminal", "Database", "Server", "Cpu", "Monitor", "Smartphone", "Layout"] },
              { category: "Social", icons: ["Github", "Linkedin", "Twitter", "Mail", "Phone", "Message"] },
              { category: "Design", icons: ["Palette", "Pen", "Eye", "Move", "Rotate", "ZoomIn", "ZoomOut"] },
              { category: "Status", icons: ["Tick", "TickCircle", "Close", "CloseCircle", "Warning", "Info", "Loading"] },
            ].map((cat) => (
              <motion.div key={cat.category} variants={motionVariants.staggerItem} className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wide opacity-50">{cat.category}</h4>
                <div className="flex flex-wrap gap-3">
                  {cat.icons.map((iconName) => (
                    <motion.button
                      key={iconName}
                      whileHover={{ scale: 1.2, rotate: 6 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--window-border)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                      aria-label={iconName}
                    >
                      <Iconsax name={iconName} variant="outline" size={20} color="var(--color-text)" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* LottieFiles Section */}
        <motion.div
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold">LottieFiles Animations</h3>
          <p className="opacity-60">
            Animations vectorielles légères depuis <a href="https://lottiefiles.com/" target="_blank" rel="noopener noreferrer" className="underline text-[var(--color-accent)]">
              lottiefiles.com
            </a> - Idéales pour les états de chargement, succès, erreurs, et illustrations interactives.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: "hero-code", label: "Code Typing", size: 120 },
              { key: "skill-server", label: "Server Cloud", size: 100 },
              { key: "skill-database", label: "Database Sync", size: 100 },
              { key: "skill-ai", label: "AI Brain", size: 100 },
              { key: "global-loading", label: "Loading Spinner", size: 80 },
              { key: "global-success", label: "Success Check", size: 80 },
              { key: "contact-email", label: "Email Send", size: 80 },
              { key: "project-deploy", label: "Deploy Rocket", size: 100 },
            ].map((anim) => (
              <motion.div
                key={anim.key}
                variants={motionVariants.staggerItem}
                className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)] text-center"
              >
                <Lottie
                  name={anim.key}
                  animationData={PORTFOLIO_LOTTIE_ANIMATIONS[anim.key]?.animationData}
                  width={anim.size}
                  height={anim.size}
                  loop={true}
                  autoplay={true}
                  speed={PORTFOLIO_LOTTIE_ANIMATIONS[anim.key]?.defaultOptions?.speed || 1}
                  renderer="svg"
                  className="mx-auto mb-3"
                  aria-label={anim.label}
                />
                <p className="text-sm font-medium">{anim.label}</p>
                <p className="text-[10px] font-mono opacity-40 mt-1">{anim.key}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* LordIcon Section */}
        <motion.div
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold">LordIcon (Animated)</h3>
          <p className="opacity-60">
            Icônes animées avec déclencheurs : hover, click, loop, morph, auto
            <br />
            Idéales pour les interactions micro-animées.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "heart-like", trigger: "hover", label: "Heart - Hover" },
              { name: "star-rate", trigger: "click", label: "Star - Click" },
              { name: "settings-gear", trigger: "loop", label: "Settings - Loop" },
              { name: "alert-warning", trigger: "morph", label: "Bell - Morph" },
              { name: "deploy-rocket", trigger: "hover", label: "Rocket - Hover" },
              { name: "magic-wand", trigger: "click", label: "Magic - Click" },
            ].map((icon) => {
              const lordIcon = getLordIcon(icon.name);
              return (
                <motion.div
                  key={icon.name}
                  variants={motionVariants.staggerItem}
                  className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)] text-center"
                >
                  <LordIcon
                    src={lordIcon?.src || ""}
                    trigger={icon.trigger as "hover" | "click" | "loop" | "morph" | "auto"}
                    width={48}
                    height={48}
                    colors="var(--color-accent),var(--color-accent-secondary)"
                    className="mx-auto mb-2"
                  />
                  <p className="text-xs font-mono opacity-60">{icon.label}</p>
                  <p className="text-[10px] font-mono opacity-40">trigger: {icon.trigger}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Motion Design Section */}
        <motion.div
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold">Motion Design Tokens</h3>
          <p className="opacity-60">
            Inspiré de <a href="https://motionin.design/dashboard" target="_blank" rel="noopener noreferrer" className="underline text-[var(--color-accent)]">
              motionin.design
            </a> - Tokens d'animation cohérents : easing, duration, distance, stagger.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Easing Demo */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">Easing Curves</h4>
              <div className="space-y-3">
                {[
                  { name: "easeOutExpo", easing: motionDesignTokens.easing.easeOutExpo },
                  { name: "easeOutCubic", easing: motionDesignTokens.easing.easeOutCubic },
                  { name: "easeOutQuart", easing: motionDesignTokens.easing.easeOutQuart },
                  { name: "easeOutBack", easing: motionDesignTokens.easing.easeOutBack },
                ].map((e) => (
                  <motion.div
                    key={e.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)]"
                    whileHover={{ x: 8 }}
                  >
                    <motion.div
                      animate={{ x: [0, 60, 0] }}
                      transition={{ duration: 1.5, ease: e.easing, repeat: Infinity }}
                      className="w-4 h-4 rounded bg-[var(--color-accent)]"
                    />
                    <code className="text-xs font-mono">{e.name}</code>
                    <code className="text-[10px] font-mono opacity-50">
                      [{e.easing.join(", ")}]
                    </code>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Spring Demo */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">Spring Presets</h4>
              <div className="space-y-3">
                {[
                  { name: "Gentle", ...motionDesignTokens.easing.springGentle },
                  { name: "Bouncy", ...motionDesignTokens.easing.springBouncy },
                  { name: "Snappy", ...motionDesignTokens.easing.springSnappy },
                  { name: "Wobbly", ...motionDesignTokens.easing.springWobbly },
                ].map((s) => (
                  <motion.div
                    key={s.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)]"
                    whileHover={{ x: 8 }}
                  >
                    <motion.div
                      animate={{ x: [0, 60, 0] }}
                      transition={{
                        type: "spring",
                        stiffness: s.stiffness,
                        damping: s.damping,
                      }}
                      className="w-4 h-4 rounded bg-[var(--color-accent)]"
                    />
                    <code className="text-xs font-mono">{s.name}</code>
                    <code className="text-[10px] font-mono opacity-50">
                      stiffness: {s.stiffness}, damping: {s.damping}
                    </code>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Duration/Distance/Stagger */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">Tokens</h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(motionDesignTokens.duration).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-[var(--color-surface)]">
                      <code className="font-mono">{k}</code>
                      <span className="ml-2 opacity-60">{v}s</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {Object.entries(motionDesignTokens.distance).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-[var(--color-surface)]">
                      <code className="font-mono">{k}</code>
                      <span className="ml-2 opacity-60">{v}px</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {Object.entries(motionDesignTokens.stagger).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-[var(--color-surface)]">
                      <code className="font-mono">{k}</code>
                      <span className="ml-2 opacity-60">{v}s</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Usage Examples */}
        <motion.div
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold">Exemples d'Utilisation</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Button with Iconsax + Motion */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">Bouton avec Iconsax + Motion</h4>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium"
              >
                <Iconsax name="ArrowRight" variant="outline" size={18} color="white" />
                <span>Continuer</span>
              </motion.button>
            </motion.div>

            {/* Card with Lottie + Hover */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">Card avec Lottie + Hover</h4>
              <motion.div
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--window-border)]"
              >
                <Lottie
                  name="skill-server"
                  animationData={PORTFOLIO_LOTTIE_ANIMATIONS["skill-server"]?.animationData}
                  width={60}
                  height={60}
                  loop={true}
                  autoplay={true}
                  speed={0.5}
                  className="mx-auto mb-3"
                />
                <h5 className="font-bold mb-1">Backend Architecture</h5>
                <p className="text-sm opacity-60">Systèmes distribués & APIs</p>
              </motion.div>
            </motion.div>

            {/* Loading State with Lottie */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">État de Chargement</h4>
              <div className="flex items-center justify-center gap-4 p-8">
                <Lottie
                  name="global-loading"
                  animationData={PORTFOLIO_LOTTIE_ANIMATIONS["global-loading"]?.animationData}
                  width={48}
                  height={48}
                  loop={true}
                  autoplay={true}
                />
                <span className="font-medium">Chargement des projets...</span>
              </div>
            </motion.div>

            {/* Success State */}
            <motion.div
              variants={motionVariants.staggerItem}
              className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--window-border)]"
            >
              <h4 className="font-bold mb-4">État de Succès</h4>
              <div className="flex items-center justify-center gap-4 p-8">
                <Lottie
                  name="global-success"
                  animationData={PORTFOLIO_LOTTIE_ANIMATIONS["global-success"]?.animationData}
                  width={48}
                  height={48}
                  loop={false}
                  autoplay={true}
                />
                <span className="font-medium text-green-500">Message envoyé !</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Quick reference for common icon usage patterns
 */
export const ICON_USAGE_EXAMPLES = {
  // Navigation icons
  nav: {
    menu: { source: "iconsax" as const, name: "Menu", variant: "outline" as const },
    close: { source: "iconsax" as const, name: "Close", variant: "outline" as const },
    chevronRight: { source: "iconsax" as const, name: "ArrowRight", variant: "outline" as const },
    chevronDown: { source: "iconsax" as const, name: "ArrowDown", variant: "outline" as const },
    search: { source: "iconsax" as const, name: "Search", variant: "outline" as const },
  },

  // Action icons
  actions: {
    download: { source: "iconsax" as const, name: "Download", variant: "outline" as const },
    upload: { source: "iconsax" as const, name: "Upload", variant: "outline" as const },
    send: { source: "iconsax" as const, name: "Send", variant: "outline" as const },
    copy: { source: "iconsax" as const, name: "Copy", variant: "outline" as const },
    link: { source: "iconsax" as const, name: "Link", variant: "outline" as const },
    share: { source: "iconsax" as const, name: "Share", variant: "outline" as const },
    edit: { source: "iconsax" as const, name: "Edit", variant: "outline" as const },
    delete: { source: "iconsax" as const, name: "Trash", variant: "outline" as const },
    save: { source: "iconsax" as const, name: "Save", variant: "outline" as const },
  },

  // Tech/Code icons
  tech: {
    code: { source: "iconsax" as const, name: "Code", variant: "outline" as const },
    terminal: { source: "iconsax" as const, name: "Terminal", variant: "outline" as const },
    database: { source: "iconsax" as const, name: "Database", variant: "outline" as const },
    server: { source: "iconsax" as const, name: "Server", variant: "outline" as const },
    cpu: { source: "iconsax" as const, name: "Cpu", variant: "outline" as const },
    monitor: { source: "iconsax" as const, name: "Monitor", variant: "outline" as const },
    smartphone: { source: "iconsax" as const, name: "Phone", variant: "outline" as const },
    layout: { source: "iconsax" as const, name: "Layout", variant: "outline" as const },
  },

  // Social icons
  social: {
    github: { source: "iconsax" as const, name: "Github", variant: "outline" as const },
    linkedin: { source: "iconsax" as const, name: "Linkedin", variant: "outline" as const },
    twitter: { source: "iconsax" as const, name: "Twitter", variant: "outline" as const },
    mail: { source: "iconsax" as const, name: "Mail", variant: "outline" as const },
  },

  // Status icons
  status: {
    success: { source: "lottie" as const, name: "success-check" },
    loading: { source: "lottie" as const, name: "loading-spinner" },
    error: { source: "lottie" as const, name: "error-glitch" },
    warning: { source: "iconsax" as const, name: "Warning", variant: "outline" as const },
    info: { source: "iconsax" as const, name: "Info", variant: "outline" as const },
  },

  // Lottie animations for sections
  sections: {
    hero: { source: "lottie" as const, name: "hero-code" },
    skills: { source: "lottie" as const, name: "skill-code" },
    projects: { source: "lottie" as const, name: "project-preview" },
    experience: { source: "lottie" as const, name: "experience-work" },
    contact: { source: "lottie" as const, name: "contact-email" },
  },
} as const;
