"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Button } from "./AdminUI";
import { cn } from "@/lib/utils";

interface FieldSchema {
  key: string;
  label: string;
  type: "text" | "email" | "url" | "textarea" | "number" | "select" | "checkbox" | "color" | "hidden";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  description?: string;
  defaultValue?: unknown;
}

interface AdminFieldArrayProps<T = Record<string, unknown>> {
  label: string;
  description?: string;
  value: T[];
  onChange: (value: T[]) => void;
  fields: FieldSchema[];
  itemLabelKey?: string; // Which field to use as item label in collapsed view
  minItems?: number;
  maxItems?: number;
  reorderable?: boolean;
  collapsible?: boolean;
  renderItemLabel?: (item: T, index: number) => React.ReactNode;
}

type FieldValue = string | number | boolean | undefined;

function FieldInput({
  field,
  value,
  onChange,
  error,
  disabled,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (val: FieldValue) => void;
  error?: string;
  disabled?: boolean;
}) {
  const inputClass = cn(
    "w-full px-3 py-2 rounded-lg text-sm transition-colors",
    "bg-[var(--admin-input-bg)] border border-[var(--admin-border)]",
    "text-[var(--admin-text)] placeholder:text-[var(--admin-text-dim)]",
    "focus:border-[var(--admin-accent)] focus:ring-1 focus:ring-[var(--admin-accent)]",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  switch (field.type) {
    case "textarea":
      return (
        <div className="relative">
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            disabled={disabled}
            className={inputClass}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.key}-error` : undefined}
          />
          {error && (
            <p id={`${field.key}-error`} className="mt-1 text-xs text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );

    case "select":
      return (
        <div className="relative">
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={inputClass}
            aria-invalid={!!error}
          >
            <option value="">{field.placeholder || "Sélectionner..."}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
        </div>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-[var(--admin-border)] bg-[var(--admin-input-bg)] text-[var(--admin-accent)] focus:ring-[var(--admin-accent)]"
          />
          <span className="text-sm text-[var(--admin-text)]">{field.label}</span>
        </label>
      );

    case "number":
      return (
        <div className="relative">
          <input
            type="number"
            value={typeof value === "number" || typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={field.placeholder}
            disabled={disabled}
            className={inputClass}
            aria-invalid={!!error}
          />
          {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
        </div>
      );

    case "color":
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={typeof value === "string" ? value : "#6366f1"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-10 h-10 rounded-lg border border-[var(--admin-border)] cursor-pointer"
          />
          <input
            type="text"
            value={typeof value === "string" ? value : "#6366f1"}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#RRGGBB"
            className={cn(inputClass, "flex-1 font-mono text-xs")}
            disabled={disabled}
          />
        </div>
      );

    case "hidden":
      return null;

    default: // text, email, url
      return (
        <div className="relative">
          <input
            type={field.type}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={inputClass}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.key}-error` : undefined}
          />
          {error && (
            <p id={`${field.key}-error`} className="mt-1 text-xs text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );
  }
}

export function AdminFieldArray<T = Record<string, unknown>>({
  label,
  description,
  value = [],
  onChange,
  fields,
  itemLabelKey = "name",
  minItems = 0,
  maxItems,
  reorderable = true,
  collapsible = true,
  renderItemLabel,
}: AdminFieldArrayProps<T>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const validateItem = useCallback(
    (index: number, item: T) => {
      const itemRecord = item as Record<string, unknown>;
      const itemErrors: Record<string, string> = {};
      fields.forEach((field) => {
        const fieldValue = itemRecord[field.key];
        if (field.required && (!fieldValue || (typeof fieldValue === "string" && !fieldValue.trim()))) {
          itemErrors[field.key] = `${field.label} est requis`;
        }
        if (field.type === "email" && typeof fieldValue === "string" && fieldValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
          itemErrors[field.key] = "Email invalide";
        }
        if (field.type === "url" && typeof fieldValue === "string" && fieldValue && !fieldValue.startsWith("http")) {
          itemErrors[field.key] = "URL invalide";
        }
        if (field.type === "number" && fieldValue !== undefined && fieldValue !== "") {
          const num = Number(fieldValue);
          if (isNaN(num)) itemErrors[field.key] = "Doit être un nombre";
          else if (field.min !== undefined && num < field.min) itemErrors[field.key] = `Minimum ${field.min}`;
          else if (field.max !== undefined && num > field.max) itemErrors[field.key] = `Maximum ${field.max}`;
        }
      });
      setErrors((prev) => {
        if (Object.keys(itemErrors).length > 0) return { ...prev, [index]: itemErrors };
        const n = { ...prev };
        delete n[index];
        return n;
      });
      return Object.keys(itemErrors).length === 0;
    },
    [fields]
  );

  const handleFieldChange = (index: number, fieldKey: string, newValue: FieldValue) => {
    const newValueArray = [...value];
    newValueArray[index] = { ...newValueArray[index], [fieldKey]: newValue };
    onChange(newValueArray);
    // Validate on change
    setTimeout(() => validateItem(index, newValueArray[index]), 0);
  };

  const addItem = () => {
    const newItem = {} as T;
    const newItemRecord = newItem as Record<string, unknown>;
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) newItemRecord[f.key] = f.defaultValue;
      else if (f.type === "checkbox") newItemRecord[f.key] = false;
      else if (f.type === "number") newItemRecord[f.key] = f.min || 0;
      else newItemRecord[f.key] = "";
    });
    onChange([...value, newItem]);
    setExpandedIndex(value.length);
  };

  const removeItem = (index: number) => {
    if (value.length <= minItems) return;
    onChange(value.filter((_, i) => i !== index));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[index];
      return n;
    });
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > index) setExpandedIndex(expandedIndex - 1);
  };

  const duplicateItem = (index: number) => {
    if (maxItems && value.length >= maxItems) return;
    const duplicated = { ...value[index] };
    // Reset ID-like fields if present
    if (typeof duplicated === "object" && duplicated !== null && "id" in duplicated) {
      (duplicated as Record<string, unknown>).id = `${String((duplicated as Record<string, unknown>).id)}-copy-${Date.now()}`;
    }
    onChange([...value.slice(0, index + 1), duplicated, ...value.slice(index + 1)]);
    if (expandedIndex !== null && expandedIndex >= index) setExpandedIndex(expandedIndex + 1);
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getItemLabel = (item: T, index: number) => {
    if (renderItemLabel) return renderItemLabel(item, index);
    const itemRecord = item as Record<string, unknown>;
    const candidate = itemRecord[itemLabelKey] || itemRecord.label || itemRecord.title || itemRecord.name;
    return typeof candidate === "string" || typeof candidate === "number"
      ? String(candidate)
      : `Élément ${index + 1}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--admin-text-dim)] block mb-1">
            {label} <span className="text-[var(--admin-accent)]">({value.length})</span>
          </label>
          {description && <p className="text-xs text-[var(--admin-text-dim)]">{description}</p>}
        </div>
        {value.length < (maxItems || 999) && (
          <Button variant="secondary" size="sm" onClick={addItem} className="gap-1.5">
            <Plus size={14} />
            Ajouter
          </Button>
        )}
      </div>

      <AnimatePresence>
        {value.map((item, index) => {
          const itemKey = ((item as Record<string, unknown>).id ?? (item as Record<string, unknown>)._key ?? index) as React.Key;
          return (
            <motion.div
              key={itemKey}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                "bg-[var(--admin-card-bg)] border-[var(--admin-border)]",
                "hover:border-[var(--admin-accent)]/50",
                expandedIndex === index && "border-[var(--admin-accent)] bg-[var(--admin-accent)]/5"
              )}
              onClick={() => collapsible && toggleExpanded(index)}
              style={{ cursor: collapsible ? "pointer" : "default" }}
            >
              {reorderable && (
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-accent)] transition-colors"
                  aria-label="Déplacer"
                >
                  <GripVertical size={16} />
                </button>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--admin-text)] truncate">{getItemLabel(item, index)}</p>
                {expandedIndex === null && (
                  <p className="text-xs text-[var(--admin-text-dim)] truncate max-w-xs">
                    {Object.entries(item as Record<string, unknown>)
                      .filter(([k, v]) => v && !fields.find((f) => f.key === k && f.type === "hidden"))
                      .slice(0, 3)
                      .map(([k, v]) => `${k}: ${String(v).slice(0, 30)}`)
                      .join(" • ")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                {collapsible && (
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-accent)] transition-colors"
                    aria-label={expandedIndex === index ? "Réduire" : "Développer"}
                  >
                    {expandedIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); duplicateItem(index); }}
                  className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-accent)] transition-colors"
                  aria-label="Dupliquer"
                  disabled={Boolean(maxItems && value.length >= maxItems)}
                >
                  <Copy size={14} />
                </button>
                {value.length > minItems && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 ml-10 mr-2 space-y-3 pb-2 border-l-2 border-[var(--admin-border)] pl-4"
                >
                  {fields
                    .filter((f) => f.type !== "hidden")
                    .map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--admin-text-dim)]">
                          {field.label}
                          {field.required && <span className="text-red-400">*</span>}
                        </label>
                        <FieldInput
                          field={field}
                          value={(item as Record<string, unknown>)[field.key]}
                          onChange={(v) => handleFieldChange(index, field.key, v)}
                          error={errors[index]?.[field.key]}
                        />
                        {field.description && !errors[index]?.[field.key] && (
                          <p className="text-[10px] text-[var(--admin-text-dim)] ml-1">{field.description}</p>
                        )}
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )})}
      </AnimatePresence>

      {value.length === 0 && (
        <div className="text-center py-8 text-[var(--admin-text-dim)] border-2 border-dashed border-[var(--admin-border)] rounded-xl">
          <p className="text-sm">Aucun élément</p>
          <p className="text-xs mt-1">Cliquez sur "Ajouter" pour commencer</p>
        </div>
      )}

      {reorderable && value.length > 1 && (
        <p className="text-[10px] font-mono text-[var(--admin-text-dim)] text-center">
          💡 Glissez-déposez pour réorganiser (à implémenter avec dnd-kit si nécessaire)
        </p>
      )}
    </div>
  );
}
