import { Server, Cpu, HardDrive, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InfrastructureCardProps {
  contenedor: string
  ip: string
  recursos: string

}

export function InfrastructureCard({
  contenedor,
  ip,
  recursos,

}: InfrastructureCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server className="h-5 w-5 text-primary" />
          Estado de Infraestructura
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            Contenedor
          </span>
          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs">
            {contenedor}
          </code>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="h-4 w-4" />
            Dirección IP
          </span>
          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs">
            {ip}
          </code>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4" />
            Recursos
          </span>
          <span className="text-xs text-foreground">{recursos}</span>
        </div>

      </CardContent>
    </Card>
  )
}
