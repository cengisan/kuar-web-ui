import { useAppSelector } from "@/presentation/state/hooks";

export function useRepoContext() {
  const { translations, accessToken, subscriberId, isEmployee, employeeData } =
    useAppSelector((s) => s.user);

  return {
    translations,
    token: accessToken ?? undefined,
    subscriberId,
    isEmployee,
    employeeData,
  };
}
