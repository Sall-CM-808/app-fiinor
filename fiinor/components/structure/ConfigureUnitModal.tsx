"use client"

import { useState, useEffect } from "react"
import { Check, Trash2 } from "lucide-react"
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useStructureStore } from "@/lib/structure/useStructureStore"
import type { UniteStructurelle } from "@/lib/structure/types"

interface ConfigureUnitModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  unit: UniteStructurelle | null
  onDeleted?: () => void
}

export function ConfigureUnitModal({ open, onOpenChange, unit, onDeleted }: ConfigureUnitModalProps) {
  const { unitTypes, racines, addUnit, deleteUnit } = useStructureStore()

  const [form, setForm] = useState({
    nom: unit?.nom ?? "",
    typeId: unit?.typeId ?? "",
    ville: unit?.ville ?? "",
    pays: unit?.pays ?? "",
    flag: unit?.flag ?? "",
    effectif: unit?.effectif ?? 0,
    score: unit?.score ?? 85,
    trend: unit?.trend ?? "+0%",
  })

  useEffect(() => {
    if (unit) {
      setForm({
        nom: unit.nom,
        typeId: unit.typeId,
        ville: unit.ville ?? "",
        pays: unit.pays ?? "",
        flag: unit.flag ?? "",
        effectif: unit.effectif,
        score: unit.score,
        trend: unit.trend,
      })
    }
  }, [unit])

  const selectedType = unitTypes.find((t) => t.id === form.typeId)

  const handleSave = () => {
    if (!unit || !form.nom.trim()) return
    const updated: UniteStructurelle = {
      ...unit,
      nom: form.nom.trim(),
      typeId: form.typeId,
      ville: form.ville || undefined,
      pays: form.pays || undefined,
      flag: form.flag || undefined,
      effectif: form.effectif,
      score: form.score,
      trend: form.trend,
    }
    deleteUnit(unit.id)
    addUnit(findParentId(racines, unit.id), updated)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!unit) return
    deleteUnit(unit.id)
    onDeleted?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{selectedType?.icone ?? "📁"}</span>
            Configurer l'unité
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de cette unité structurelle.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px]">Type d'unité</Label>
            <Select
              value={form.typeId}
              onValueChange={(v) => { if (v) setForm((f) => ({ ...f, typeId: v })) }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
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
          </div>

          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px]">Nom *</Label>
            <Input
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              className="h-9"
            />
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Drapeau</Label>
              <Input
                value={form.flag}
                onChange={(e) => setForm((f) => ({ ...f, flag: e.target.value }))}
                className="h-9 text-center text-base"
                maxLength={4}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Ville</Label>
              <Input
                value={form.ville}
                onChange={(e) => setForm((f) => ({ ...f, ville: e.target.value }))}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Pays</Label>
              <Input
                value={form.pays}
                onChange={(e) => setForm((f) => ({ ...f, pays: e.target.value }))}
                className="h-9"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Effectif</Label>
              <Input
                type="number"
                min={0}
                value={form.effectif}
                onChange={(e) => setForm((f) => ({ ...f, effectif: Number(e.target.value) }))}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px]">Score</Label>
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

          <Separator />

          <div className="flex items-center justify-between">
            {/* Supprimer */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-3.5" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer "{unit?.nom}" ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera l'unité et toutes ses sous-unités de manière irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!form.nom.trim()}>
                <Check className="size-3.5" />
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function findParentId(nodes: UniteStructurelle[], targetId: string): string | null {
  for (const node of nodes) {
    if (node.children.some((c) => c.id === targetId)) return node.id
    const found = findParentId(node.children, targetId)
    if (found !== null) return found
  }
  return null
}
