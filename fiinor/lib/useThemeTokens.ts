import { useTheme } from "@/providers/ThemeProvider"
import tokens from "@/lib/tokens"

/**
 * useT — retourne les tokens de couleur du thème actif.
 * Usage : const t = useT()
 *         style={{ background: t.surface1, border: `1px solid ${t.border}` }}
 */
export function useT() {
  const { theme } = useTheme()
  return tokens[theme]
}
