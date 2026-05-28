"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductLanguage } from "@/config/productCategories";
import type { ProductMaterial, StockMaterial } from "@/types";
import {
  areUnitsCompatible,
  getCompatibleUnits,
  getUnitLabel,
} from "@/utils/measurementUnits";

interface ProductMaterialSelectorProps {
  materials: StockMaterial[];
  selectedMaterials: ProductMaterial[];
  onChange: (materials: ProductMaterial[]) => void;
  translations: Record<string, string>;
  language: ProductLanguage;
  businessId: number;
  disabled?: boolean;
}

export function ProductMaterialSelector({
  materials,
  selectedMaterials,
  onChange,
  translations,
  language,
  businessId,
  disabled = false,
}: ProductMaterialSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<StockMaterial | null>(null);
  const [quantity, setQuantity] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("GRAM");

  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) =>
        material.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [materials, searchQuery]
  );

  const compatibleUnits = useMemo(
    () => getCompatibleUnits(selectedMaterial?.unit),
    [selectedMaterial?.unit]
  );

  const resetDialog = () => {
    setSearchQuery("");
    setSelectedMaterial(null);
    setQuantity("");
    setSelectedUnit("GRAM");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetDialog();
  };

  const handleSelectMaterial = (material: StockMaterial) => {
    setSelectedMaterial(material);
    if (material.unit) {
      setSelectedUnit(material.unit);
    }
  };

  const handleAddMaterial = () => {
    if (!selectedMaterial || !quantity.trim()) return;

    if (!areUnitsCompatible(selectedMaterial.unit, selectedUnit)) {
      toast.error(
        translations.incompatibleMeasurementUnit
      );
      return;
    }

    if (selectedMaterials.some((item) => item.material_id === selectedMaterial.id)) {
      return;
    }

    onChange([
      ...selectedMaterials,
      {
        material_id: selectedMaterial.id,
        material_name: selectedMaterial.name,
        quantity: parseFloat(quantity.replace(",", ".")),
        unit: selectedUnit,
      },
    ]);

    handleOpenChange(false);
  };

  const handleRemove = (materialId: number) => {
    onChange(selectedMaterials.filter((item) => item.material_id !== materialId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label>{translations.materials}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-1 size-4" />
          {translations.addMaterial}
        </Button>
      </div>

      {selectedMaterials.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {translations.noMaterialsAdded}
        </p>
      ) : (
        <ul className="space-y-2">
          {selectedMaterials.map((item) => (
            <li
              key={item.material_id}
              className="flex items-center justify-between rounded-lg border border-border/70 bg-card/50 px-3 py-2 text-sm"
            >
              <span>
                {item.material_name || `#${item.material_id}`} — {item.quantity}{" "}
                {getUnitLabel(item.unit, language)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                disabled={disabled}
                onClick={() => handleRemove(item.material_id)}
                aria-label={translations.remove}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{translations.selectMaterial}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.searchMaterial}
            />

            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border/70 p-2">
              {filteredMaterials.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  {translations.noMaterialsFound}
                </p>
              ) : (
                filteredMaterials.map((material) => (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => handleSelectMaterial(material)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      selectedMaterial?.id === material.id ? "bg-muted font-medium" : ""
                    }`}
                  >
                    {material.name}
                    {material.unit ? (
                      <span className="ml-2 text-muted-foreground">
                        ({getUnitLabel(material.unit, language)})
                      </span>
                    ) : null}
                  </button>
                ))
              )}
            </div>

            {selectedMaterial && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="material-quantity">
                    {translations.quantity}
                  </Label>
                  <Input
                    id="material-quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    inputMode="decimal"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.stockUnit}</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {compatibleUnits.map((unit) => (
                        <SelectItem key={unit.key} value={unit.key}>
                          {language === "en" ? unit.labelEn : unit.labelTr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {translations.createMaterialHint}{" "}
              <Link
                href={`/business/${businessId}/stock/create`}
                className="font-medium text-primary hover:underline"
                onClick={() => handleOpenChange(false)}
              >
                {translations.createMaterial}
              </Link>
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {translations.cancel}
            </Button>
            <Button
              type="button"
              onClick={handleAddMaterial}
              disabled={!selectedMaterial || !quantity.trim()}
            >
              {translations.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
