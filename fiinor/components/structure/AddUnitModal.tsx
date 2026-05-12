"use client"

import { useState } from "react"
import { Plus, Check, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useStructureStore } from "@/lib/structure/useStructureStore"
import type { UniteStructurelle } from "@/lib/structure/types"

const PRESET_ICONS = ["🌐","🏫","🏛️","📚","🎓","🏢","🏗️","📖","🔬","🎨","⚽","🏥","💼","🌿","🔧","🧪","🎭","🏆","📡","🗂️"]
const PRESET_COLORS = ["#C9A84C","#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444","#EC4899","#06B6D4","#84CC16","#F97316"]

interface AddUnitModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  parentUnit: UniteStructurelle | null
}

const EMPTY_FORM = {
  nom: "", typeId: "", ville: "", pays: "", flag: "", effectif: 0, score: 85, trend: "+0%",
}

const EMPTY_NEW_TYPE = {
  nom: "", icone: "📁", couleur: "#3B82F6", niveau: 0,
}

export function AddUnitModal({ open, onOpenChange, parentUnit }: AddUnitModalProps) {
  const { unitTypes, addUnit, addUnitType } = useStructureStore()

  const [form, setForm] = useState({ ...EMPTY_FORM, typeId: unitTypes[0]?.id ?? "" })
  const [showNewType, setShowNewType] = useState(false)
  const [newType, setNewType] = useState({ ...EMPTY_NEW_TYPE })

  const selectedType = unitTypes.find((t) => t.id === form.typeId)

  const reset = () => {
    setForm({ ...EMPTY_FORM, typeId: unitTypes[0]?.id ?? "" })
    setShowNewType(false)
    setNewType({ ...EMPTY_NEW_TYPE })
  }

  const handleCreateType = () => {
    if (!newType.nom.trim()) return
    const id = newType.nom.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now()
    addUnitType({
      id,
      nom: newType.nom.trim(),
      icone: newType.icone,
      couleur: newType.couleur,
      niveau: newType.niveau,
      enfants_autorises: [],
    })
    setForm((f) => ({ ...f, typeId: id }))
    setShowNewType(false)
    setNewType({ ...EMPTY_NEW_TYPE })
  }

  const handleSubmit = () => {
    if (!form.nom.trim() || !form.typeId) return
    const newUnit: UniteStructurelle = {
      id: crypto.randomUUID(),
      nom: form.nom.trim(),
      typeId: form.typeId,
      ville: form.ville || undefined,
      pays: form.pays || undefined,
      flag: form.flag || undefined,
      effectif: form.effectif,
      score: form.score,
      trend: form.trend,
      children: [],
    }
    addUnit(parentUnit?.id ?? null, newUnit)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une unité</DialogTitle>
          <DialogDescription>
            {parentUnit ? `Sous "${parentUnit.nom}"` : "Créer une unité racine"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">

          {/* ── Type selector ── */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px]">Type d'unité *</Label>
            <Select
              value={form.typeId}
              onValueChange={(v) => { if (v) setForm((f) => ({ ...f, typeId: v })) }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Choisir un type…" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <span>{t.icone}</span>
                      <span>{t.nom}</span>
                      <Badge
                        variant="secondary"
                        className="ml-1 px-1 py-0 text-[9px] border-0"
                        style={{ backgroundColor: `${t.couleur}18`, color: t.couleur }}
                      >
                        Niv. {t.niveau}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Toggle inline create-type */}
            <button
              onClick={() => setShowNewType((v) => !v)}
              className="flex items-center gap-1.5 self-start text-[10px] font-medium text-primary hover:underline"
            >
              <Sparkles className="size-3" />
              {showNewType ? "Annuler la création" : "Créer un nouveau type"}
              {showNewType ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>

            {/* ── Inline new type form ── */}
            <AnimatePresence initial={false}>
              {showNewType && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 mt-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                      <Sparkles className="size-3" /> Nouveau type
                    </p>

                    {/* Nom */}
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px]">Nom du type *</Label>
                      <Input
                        placeholder="ex. Campus, Filière, Section…"
                        value={newType.nom}
                        onChange={(e) => setNewType((t) => ({ ...t, nom: e.target.value }))}
                        className="h-8 text-[12px]"
                        autoFocus
                      />
                    </div>

                    {/* Icone */}
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px]">Icône</Label>
                      <div className="flex flex-wrap gap-1">
                        {PRESET_ICONS.map((ic) => (
                          <button
                            key={ic}
                            onClick={() => setNewType((t) => ({ ...t, icone: ic }))}
                            className={`flex size-7 items-center justify-center rounded-md border text-sm transition-colors ${
                              newType.icone === ic
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                        <Input
                          placeholder="…"
                          value={newType.icone}
                          onChange={(e) => setNewType((t) => ({ ...t, icone: e.target.value }))}
                          className="h-7 w-14 text-center text-sm"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    {/* Couleur */}
                    <div className="flex flex-col gap-1">
                      <Label className="text-[10px]">Couleur</Label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setNewType((t) => ({ ...t, couleur: c }))}
                            className="relative flex size-5 rounded-full border-2 transition-transform hover:scale-110"
                            style={{
                              backgroundColor: c,
                              borderColor: newType.couleur === c ? "white" : "transparent",
                            }}
                          >
                            {newType.couleur === c && (
                              <Check className="absolute inset-0 m-auto size-2.5 text-white drop-shadow" />
                            )}
                          </button>
                        ))}
                        <Input
                          type="color"
                          value={newType.couleur}
                          onChange={(e) => setNewType((t) => ({ ...t, couleur: e.target.value }))}
                          className="size-5 cursor-pointer rounded-full border-0 p-0"
                        />
                      </div>
                    </div>

                    {/* Niveau */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Label className="text-[10px]">Niveau hiérarchique</Label>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={newType.niveau}
                          onChange={(e) => setNewType((t) => ({ ...t, niveau: Number(e.target.value) }))}
                          className="h-8 w-20 text-[12px]"
                        />
                      </div>

                      {/* Mini preview */}
                      {newType.nom && (
                        <div className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 mt-4">
                          <span
                            className="flex size-6 items-center justify-center rounded text-sm"
                            style={{ backgroundColor: `${newType.couleur}20` }}
                          >
                            {newType.icone}
                          </span>
                          <span className="text-[11px] font-semibold text-foreground">{newType.nom}</span>
                          <Badge
                            variant="secondary"
                            className="ml-auto px-1 py-0 text-[9px] border-0"
                            style={{ backgroundColor: `${newType.couleur}18`, color: newType.couleur }}
                          >
                            Niv. {newType.niveau}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="self-end"
                      disabled={!newType.nom.trim()}
                      onClick={handleCreateType}
                    >
                      <Check className="size-3.5" />
                      Créer ce type
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          {/* ── Nom ── */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px]">Nom *</Label>
            <Input
              placeholder={`Nom du ${selectedType?.nom ?? "type"}…`}
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              className="h-9"
            />
          </div>

          {/* ── Localisation ── */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Drapeau</Label>
              <Input
                placeholder="🇬🇳"
                value={form.flag}
                onChange={(e) => setForm((f) => ({ ...f, flag: e.target.value }))}
                className="h-9 text-center text-base"
                maxLength={4}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Ville</Label>
              <Input
                placeholder="Conakry"
                value={form.ville}
                onChange={(e) => setForm((f) => ({ ...f, ville: e.target.value }))}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Pays</Label>
              <Input
                placeholder="Guinée"
                value={form.pays}
                onChange={(e) => setForm((f) => ({ ...f, pays: e.target.value }))}
                className="h-9"
              />
            </div>
          </div>

          {/* ── Stats initiales ── */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Effectif initial</Label>
              <Input
                type="number"
                min={0}
                value={form.effectif}
                onChange={(e) => setForm((f) => ({ ...f, effectif: Number(e.target.value) }))}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Score initial</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={form.score}
                onChange={(e) => setForm((f) => ({ ...f, score: Number(e.target.value) }))}
                className="h-9"
              />
            </div>
          </div>

          {/* ── Prévisualisation ── */}
          {form.nom && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
              <span
                className="flex size-7 items-center justify-center rounded-md text-base"
                style={{ backgroundColor: `${selectedType?.couleur}20` }}
              >
                {selectedType?.icone ?? "📁"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-[12px] font-semibold text-foreground">{form.nom}</div>
                {form.ville && (
                  <div className="text-[10px] text-muted-foreground">{form.flag} {form.ville}, {form.pays}</div>
                )}
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 px-1.5 py-0 text-[9px] border-0"
                style={{ backgroundColor: `${selectedType?.couleur}18`, color: selectedType?.couleur }}
              >
                {form.score}
              </Badge>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { reset(); onOpenChange(false) }}>
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!form.nom.trim() || !form.typeId}
            >
              <Plus className="size-3.5" />
              Ajouter l'unité
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
