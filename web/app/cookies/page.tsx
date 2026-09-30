import { CookiePolicyView } from "@/components/CookiePolicyView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/cookies");

export default function Page() {
  return <CookiePolicyView locale="th" route="/cookies" />;
}
