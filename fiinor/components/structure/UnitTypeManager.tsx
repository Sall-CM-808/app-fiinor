"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, GripVertical, Check, X } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStructureStore } from "@/lib/structure/useStructureStore"
import type { UnitType } from "@/lib/structure/types"

const PRESET_ICONS = ["🌐", "🏫", "🏛️", "📚", "🎓", "🏢", "🏗️", "📖", "🔬", "🎨", "⚽", "🏥", "💼", "🌿", "🔧"]
const PRESET_COLORS = [
  "#C9A84C", "#3B82F6", "#8B5CF6", "#10B981",
  "#F59E0B", "#EF4444", "#EC4899", "#06B6D4",
  "#84CC16", "#F97316",
]

interface EditingType extends Partial<UnitType> {
  isNew?: boolean
}

interface UnitTypeManagerProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function UnitTypeManager({ open, onOpenChange }: UnitTypeManagerProps) {
  const { unitTypes, addUnitType, updateUnitType, deleteUnitType } = useStructureStore()
  const [editing, setEditing] = useState<EditingType | null>(null)

  const startNew = () =>
    setEditing({
      isNew: true,
      id: crypto.randomUUID(),
      nom: "",
      icone: "📁",
      couleur: PRESET_COLORS[0],
      niveau: unitTypes.length,
      enfants_autorises: [],
    })

  const startEdit = (t: UnitType) => setEditing({ ...t })

  const save = () => {
    if (!editing?.id || !editing.nom?.trim()) return
    const full = editing as UnitType
    if (editing.isNew) {
      addUnitType(full)
    } else {
      updateUnitType(full.id, full)
    }
    setEditing(null)
  }

  const cancel = () => setEditing(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gérer les types d'unités</DialogTitle>
          <DialogDescription>
            Créez vos propres types d'unités structurelles avec icône, couleur et niveau hiérarchique.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* List */}
          <ScrollArea className="max-h-[340px] pr-1">
            <div className="flex flex-col gap-1.5">
              {unitTypes.map((t) => (
                <div
                  key={t.id}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <GripVertical className="size-3.5 shrink-0 text-muted-foreground/40" />

                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-base"
                    style={{ backgroundColor: `${t.couleur}20` }}
                  >
                    {t.icone}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-foreground">{t.nom}</span>
                      <Badge
                        variant="secondary"
                        className="px-1.5 py-0 text-[9px] border-0"
                        style={{ backgroundColor: `${t.couleur}18`, color: t.couleur }}
                      >
                        Niveau {t.niveau}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Enfants : {t.enfants_autorises.length > 0
                        ? t.enfants_autorises.map((id) => unitTypes.find((u) => u.id === id)?.nom ?? id).join(", ")
                        : "aucun"}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(t)}
                    >
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteUnitType(t.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Edit / Create form */}
          {editing ? (
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {editing.isNew ? "Nouveau type" : `Modifier — ${editing.nom}`}
              </p>

              {/* Nom */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px]">Nom du type</Label>
                <Input
                  placeholder="ex. Campus, Filière, Section…"
                  value={editing.nom ?? ""}
                  onChange={(e) => setEditing((v) => ({ ...v, nom: e.target.value }))}
                  className="h-8 text-[12px]"
                  autoFocus
                />
              </div>

              {/* Icone picker */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px]">Icône</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ICONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setEditing((v) => ({ ...v, icone: ic }))}
                      className={`flex size-8 items-center justify-center rounded-md border text-base transition-colors ${
                        editing.icone === ic
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                  <Input
                    placeholder="ou emoji…"
                    value={editing.icone ?? ""}
                    onChange={(e) => setEditing((v) => ({ ...v, icone: e.target.value }))}
                    className="h-8 w-20 text-center text-base"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Couleur picker */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px]">Couleur</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditing((v) => ({ ...v, couleur: c }))}
                      className="relative flex size-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: editing.couleur === c ? "white" : "transparent",
                      }}
                    >
                      {editing.couleur === c && (
                        <Check className="absolute inset-0 m-auto size-3 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  <Input
                    type="color"
                    value={editing.couleur ?? "#888888"}
                    onChange={(e) => setEditing((v) => ({ ...v, couleur: e.target.value }))}
                    className="size-6 cursor-pointer rounded-full border-0 p-0"
                  />
                </div>
              </div>

              {/* Niveau */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px]">Niveau hiérarchique</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={editing.niveau ?? 0}
                  onChange={(e) => setEditing((v) => ({ ...v, niveau: Number(e.target.value) }))}
                  className="h-8 w-24 text-[12px]"
                />
              </div>

              {/* Prévisualisation */}
              <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
                <span
                  className="flex size-7 items-center justify-center rounded-md text-base"
                  style={{ backgroundColor: `${editing.couleur}20` }}
                >
                  {editing.icone || "📁"}
                </span>
                <span className="text-[12px] font-semibold text-foreground">{editing.nom || "Nom du type"}</span>
                <Badge
                  variant="secondary"
                  className="ml-auto px-1.5 py-0 text-[9px] border-0"
                  style={{ backgroundColor: `${editing.couleur}18`, color: editing.couleur }}
                >
                  Niveau {editing.niveau ?? 0}
                </Badge>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={cancel}>
                  <X className="size-3.5" />
                  Annuler
                </Button>
                <Button size="sm" onClick={save} disabled={!editing.nom?.trim()}>
                  <Check className="size-3.5" />
                  {editing.isNew ? "Créer" : "Enregistrer"}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full gap-2" onClick={startNew}>
              <Plus className="size-4" />
              Créer un nouveau type
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
