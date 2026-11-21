import { HEROES } from "@/lib/heroes"
import { Home } from "./home"

// Plain visits. Visitors from an ad get /h/<ad> instead (rewritten in src/proxy.ts, same URL in the address bar).
export default function Page() {
  return <Home hero={HEROES.default} />
}
