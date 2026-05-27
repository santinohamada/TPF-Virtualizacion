import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import MiFoto from "@/public/mi-foto.jpeg"

interface ProfileHeaderProps {
  nombre: string
  dni: string
  carrera: string
}

export function ProfileHeader({ nombre, dni, carrera }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-4 py-8 text-center md:flex-row md:text-left">
      <div className="flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-secondary">
        <Image src={MiFoto} alt="Imagen de Santino Hamada" className="h-full w-full object-cover" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{nombre}</h1>
        <p className="text-muted-foreground">
          <span className="font-medium">DNI:</span> {dni}
        </p>
        <p className="text-sm text-muted-foreground">{carrera}</p>
        <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary">
          Trabajo Práctico Final - Junio 2026
        </Badge>
      </div>
    </header>
  )
}
