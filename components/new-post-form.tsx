"use client"

import { useState } from "react"
import { PenLine } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { BlogPost } from "./blog-post-card"

interface NewPostFormProps {
  onPublish: (titulo: string, contenido: string) => Promise<boolean>
}

export function NewPostForm({ onPublish }: NewPostFormProps) {
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !contenido.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const success = await onPublish(titulo.trim(), contenido.trim())
      if (success) {
        setTitulo("")
        setContenido("")
      }
    } catch (error) {
      console.error("Error al publicar el post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PenLine className="h-5 w-5 text-primary" />
          Nueva Publicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Post</Label>
            <Input
              id="titulo"
              placeholder="Escribe el título de tu publicación..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido</Label>
            <Textarea
              id="contenido"
              placeholder="Escribe el contenido de tu publicación..."
              rows={4}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
