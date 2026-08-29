"use client";

import { useCallback, useEffect, useState } from "react";

import ProductCategoryRepositoryImpl from "@/data/repositories/ProductCategoryRepositoryImpl";
import {
  mapApiCategoryGroups,
  type ProductLanguage,
  type UiCategoryGroup,
} from "@/config/productCategories";
import { useAppSelector } from "@/presentation/state/hooks";
import type { ProductCategoryGroup as ApiProductCategoryGroup } from "@/types";

export function useProductCategories(
  businessId: number,
  language: ProductLanguage
) {
  const { translations, accessToken } = useAppSelector((state) => state.user);
  const [groups, setGroups] = useState<UiCategoryGroup[]>([]);
  const [apiGroups, setApiGroups] = useState<ApiProductCategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!accessToken || !businessId) {
      setGroups(mapApiCategoryGroups([], language));
      setApiGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const repository = new ProductCategoryRepositoryImpl(
        translations,
        accessToken
      );
      const data = await repository.getCategoriesByBusiness(businessId);
      setApiGroups(data);
      setGroups(mapApiCategoryGroups(data, language));
    } catch (err) {
      setError((err as Error).message);
      setApiGroups([]);
      setGroups(mapApiCategoryGroups([], language));
    } finally {
      setLoading(false);
    }
  }, [accessToken, businessId, language, translations]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createCustomCategory = useCallback(
    async (label: string) => {
      if (!accessToken || !businessId || !label.trim()) return null;
      const repository = new ProductCategoryRepositoryImpl(
        translations,
        accessToken
      );
      await repository.createCustomCategory(businessId, label.trim());
      await loadCategories();
      return label.trim();
    },
    [accessToken, businessId, loadCategories, translations]
  );

  return {
    groups,
    apiGroups,
    loading,
    error,
    reload: loadCategories,
    createCustomCategory,
  };
}
