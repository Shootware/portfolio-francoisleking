// ============================================================
// SECTION — Contact (UI/UX Premium & Cohérence Graphique)
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { contactSchema, type ContactFormData } from "@/lib/validation";
import { loadAdminData } from "@/lib/admin-data";
import { personal } from "@/content";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface AdminContactData {
  formTitle?: string;
  formDescription?: string;
  formFields?: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "textarea";
    required: boolean;
    placeholder?: string;
  }>;
  submitEndpoint?: string;
  directLinks?: Array<{
    label: string;
    url: string;
    icon: string;
    primary: boolean;
  }>;
  availabilityStatus?: "available" | "busy" | "unavailable";
  availabilityMessage?: string;
  responseTime?: string;
}

function FormField({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--hero-text-main)] opacity-80 flex items-center gap-1">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-500 font-sans">
            *
          </span>
        )}
      </label>
      <div className="relative">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1.5 font-mono pt-1"
          >
            <AlertCircle size={12} aria-hidden="true" className="shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = cn(
  "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none",
  "bg-[var(--window-bg)] border border-[var(--window-border)]",
  "text-[var(--hero-text-main)] placeholder:text-[var(--hero-text-muted)] placeholder:opacity-60",
  "focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
);

export function ContactSection() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [adminData, setAdminData] = useState<AdminContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load admin data on mount
  useEffect(() => {
    const data = loadAdminData();
    const contactData = data.contact || {};
    setAdminData(contactData as AdminContactData);
    setIsLoading(false);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const endpoint = adminData?.submitEndpoint || "/api/contact";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  // Default form fields (fallback)
  const defaultFields = [
    { name: "name", label: "Nom complet", type: "text" as const, required: true, placeholder: "Ex: François Leking" },
    { name: "email", label: "Adresse email", type: "email" as const, required: true, placeholder: "Ex: nom@domaine.com" },
    { name: "subject", label: "Objet du build", type: "text" as const, required: true, placeholder: "Ex: Architecture d'une plateforme e-commerce" },
    { name: "message", label: "Spécifications du projet", type: "textarea" as const, required: true, placeholder: "Décris tes charges techniques, l'état actuel, les technos ou les délais prévus..." },
  ];

  const fields = adminData?.formFields && adminData.formFields.length > 0
    ? adminData.formFields
    : defaultFields;

  // Type-safe error accessor
  const getError = (name: string) => errors[name as keyof typeof errors]?.message;

  // Map icon names to Lucide icons
  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Mail,
    MapPin,
    ExternalLink,
    Send,
  };

  if (isLoading) {
    return (
      <section
        id="contact"
        aria-label="Contact"
        className="skills-section-unified relative overflow-hidden py-24 sm:py-32"
      >
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--window-border)] rounded w-1/4" />
            <div className="h-4 bg-[var(--window-border)] rounded w-1/2" />
            <div className="h-64 bg-[var(--window-border)] rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="skills-section-unified py-24 sm:py-32"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">

        {/* En-tête de section */}
        <div className="mb-16">
          <span className="font-mono text-[10px] tracking-widest uppercase opacity-40 block mb-2">
            // Prêt pour le build ?
          </span>
          <h2 className="skills-main-title text-4xl sm:text-5xl font-normal tracking-wide italic">
            {adminData?.formTitle || "Travaillons ensemble"}
          </h2>
          <p className="skills-subtitle mt-4 text-sm sm:text-base opacity-65 leading-relaxed max-w-xl">
            {adminData?.formDescription || "Un projet complexe à exécuter ou une infrastructure à consolider ? Écris-moi, je réponds sous 24h."}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Bloc d'informations de gauche */}
          <aside
            className="lg:col-span-2 flex flex-col gap-4"
            aria-label="Informations de contact de l'ingénieur"
          >
            {/* Carte Coordonnées Principales */}
            <div className="about-value-card rounded-2xl p-6 bg-[var(--window-bg)] border border-[var(--window-border)]">
              <h3 className="text-[10px] font-mono tracking-widest uppercase opacity-40 mb-4">
                Canal direct
              </h3>

              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-3 text-xs sm:text-sm font-mono text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)] transition-colors group"
                  aria-label={`Envoyer un e-mail à ${personal.email}`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[var(--hero-bg)] border border-[var(--window-border)] transition-colors group-hover:border-zinc-500">
                    <Mail size={14} className="text-[var(--hero-text-main)]" aria-hidden="true" />
                  </div>
                  <span className="truncate">{personal.email}</span>
                </a>

                <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-[var(--hero-text-muted)]">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[var(--hero-bg)] border border-[var(--window-border)]">
                    <MapPin size={14} className="text-[var(--hero-text-main)]" aria-hidden="true" />
                  </div>
                  <span>{personal.location}</span>
                </div>
              </div>

              {/* Direct Links from admin */}
              {adminData?.directLinks && adminData.directLinks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--window-border)]">
                  <h4 className="text-[10px] font-mono tracking-widest uppercase opacity-40 mb-3">
                    Liens directs
                  </h4>
                  <div className="flex flex-col gap-2">
                    {adminData.directLinks.map((link, index) => {
                      const Icon = iconMap[link.icon] || ExternalLink;
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target={link.url.startsWith("mailto:") ? "_self" : "_blank"}
                          rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                          className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[var(--hero-text-muted)] hover:text-[var(--hero-text-main)] transition-colors group"
                          aria-label={`Visiter ${link.label}`}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--hero-bg)] border border-[var(--window-border)] transition-colors group-hover:border-zinc-500">
                            <Icon size={12} className="text-[var(--hero-text-main)]" aria-hidden="true" />
                          </div>
                          <span className="truncate">{link.label}</span>
                          {link.primary && <span className="text-[9px] font-mono bg-[var(--hero-text-main)] text-[var(--hero-bg)] px-1.5 rounded">Principal</span>}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Carte de Disponibilité */}
            <div className="about-value-card rounded-2xl p-5 bg-[var(--window-bg)] border border-[var(--window-border)] relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#1D9E75]" />
              <div className="flex items-center gap-2.5 mb-1.5 pl-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D9E75]"></span>
                </span>
                <p className="text-xs font-mono font-bold tracking-wide uppercase text-[#1D9E75]">
                  {adminData?.availabilityStatus === "busy" ? "Pipeline Occupé" : adminData?.availabilityStatus === "unavailable" ? "Pipeline Fermé" : "Pipeline Ouvert"}
                </p>
              </div>
              <p className="text-xs text-[var(--hero-text-muted)] leading-relaxed pl-1">
                {adminData?.availabilityMessage || (personal.availableForWork ? "Disponible pour des missions techniques ou architectures complexes en freelance." : "Actuellement non disponible pour de nouveaux projets.")}
              </p>
              {adminData?.responseTime && (
                <p className="text-[10px] font-mono text-[var(--hero-text-muted)] mt-2 pl-1">
                  Temps de réponse : {adminData.responseTime}
                </p>
              )}
            </div>
          </aside>

          {/* Formulaire interactif / Zone de droite */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="about-value-card rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4 border border-[var(--window-border)] bg-[var(--window-bg)] min-h-[400px]"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="w-12 h-12 rounded-full bg-[rgba(29,158,117,0.08)] border border-[#1D9E75]/30 flex items-center justify-center mb-2">
                    <CheckCircle size={24} className="text-[#1D9E75]" aria-hidden="true" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-[var(--hero-text-main)]">
                    Transmission réussie
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--hero-text-muted)] max-w-xs mx-auto leading-relaxed">
                    Les données ont été poussées avec succès. Je prends connaissance de tes besoins et te réponds sous 24h.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--hero-text-main)] opacity-60 hover:opacity-100 transition-opacity cursor-pointer underline underline-offset-4"
                  >
                    Envoyer une autre requête
                    <ArrowRight size={12} />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="about-value-card rounded-2xl p-6 sm:p-8 flex flex-col gap-5 border border-[var(--window-border)] bg-[var(--window-bg)]"
                  aria-label="Formulaire d'envoi réseau"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    {fields.slice(0, 2).map((field) => (
                      <FormField key={field.name} label={field.label} error={getError(field.name)} required={field.required}>
                        <input
                          {...register(field.name as keyof ContactFormData)}
                          type={field.type}
                          placeholder={field.placeholder}
                          autoComplete={field.name === "name" ? "name" : field.name === "email" ? "email" : undefined}
                          aria-required={field.required}
                          aria-invalid={!!getError(field.name)}
                          className={cn(inputClass, getError(field.name) && "border-red-500 focus:border-red-500 focus:ring-red-500")}
                        />
                      </FormField>
                    ))}
                  </div>

                  {fields.slice(2).map((field) => (
                    <FormField key={field.name} label={field.label} error={getError(field.name)} required={field.required}>
                      {field.type === "textarea" ? (
                        <textarea
                          {...register(field.name as keyof ContactFormData)}
                          rows={5}
                          placeholder={field.placeholder}
                          aria-required={field.required}
                          aria-invalid={!!getError(field.name)}
                          className={cn(inputClass, "resize-none", getError(field.name) && "border-red-500 focus:border-red-500 focus:ring-red-500")}
                        />
                      ) : (
                        <input
                          {...register(field.name as keyof ContactFormData)}
                          type={field.type}
                          placeholder={field.placeholder}
                          aria-required={field.required}
                          aria-invalid={!!getError(field.name)}
                          className={cn(inputClass, getError(field.name) && "border-red-500 focus:border-red-500 focus:ring-red-500")}
                        />
                      )}
                    </FormField>
                  ))}

                  {status === "error" && (
                    <div
                      role="alert"
                      className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-400 flex items-center gap-2 font-mono"
                    >
                      <AlertCircle size={14} aria-hidden="true" className="shrink-0" />
                      Échec de la transmission. Relance le bouton ou écris-moi directement par mail.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl cursor-pointer",
                      "bg-[var(--hero-text-main)] text-[var(--hero-bg)] font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200",
                      "hover:opacity-90 active:scale-[0.99]",
                      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                    )}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                        Exécution en cours...
                      </>
                    ) : (
                      <>
                        <Send size={13} aria-hidden="true" />
                        Exécuter l'envoi
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Ligne de coupure basse décorative */}
        <div className="skills-footer-line mt-20 h-px w-full opacity-20" />
      </div>
    </section>
  );
}