"use client"

import { useState, useEffect } from "react"
import { FileDown, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileHeader } from "@/components/profile-header"
import { InfrastructureCard } from "@/components/infrastructure-card"
import { BlogPostCard, type BlogPost } from "@/components/blog-post-card"
import { NewPostForm } from "@/components/new-post-form"

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carga inicial de publicaciones desde PostgreSQL
  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(`/api/posts?t=${Date.now()}`, { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        } else {
          console.error("Error al cargar posts desde el servidor")
        }
      } catch (error) {
        console.error("Error de red al cargar posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [])

  // Publicar un nuevo post vía POST /api/posts
  const handlePublish = async (titulo: string, contenido: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: titulo, content: contenido }),
      })

      if (response.ok) {
        const nuevoPost = await response.json()
        setPosts((prevPosts) => [nuevoPost, ...prevPosts])
        return true
      } else {
        console.error("Error al publicar en la base de datos")
        return false
      }
    } catch (error) {
      console.error("Error de red al publicar:", error)
      return false
    }
  }

  // Eliminar un post vía DELETE /api/posts?id=...
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
      } else {
        console.error("Error al eliminar el post de la base de datos")
      }
    } catch (error) {
      console.error("Error de red al eliminar:", error)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header con perfil */}
        <ProfileHeader
          nombre="Hamada, Santino"
          dni="45.275.660"
          carrera="Ingeniería en Sistemas de Información - UTN FRT"
        />

        {/* Botón de descarga */}
        <div className="mb-8">
          <Button size="lg" className="w-full gap-2 text-base md:w-auto">
            <FileDown className="h-5 w-5" />
            <a
              href="/informe-tpf.pdf"
              download="Informe_TPF_Hamada.pdf"
            >
              Descargar Informe de Desarrollo (PDF)
            </a>
          </Button>
        </div>

        {/* Card de Infraestructura */}
        <div className="mb-8">
          <InfrastructureCard
            contenedor="43432432A"
            ip="172.16.90.ID"
            recursos="128MB RAM / 1 CPU Core"
            estado="online"
          />
        </div>

        {/* Formulario de nueva publicación */}
        <div className="mb-8">
          <NewPostForm onPublish={handlePublish} />
        </div>

        {/* Feed del Blog */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Publicaciones del Blog
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground animate-pulse">
                Cargando publicaciones desde PostgreSQL...
              </div>
            ) : posts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay publicaciones todavía. ¡Sé el primero en escribir una!
              </div>
            ) : (
              posts.map((post) => (
                <BlogPostCard key={post.id} post={post} onDelete={handleDelete} />
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026 - Trabajo Práctico Final | UTN FRT - Ingeniería en Sistemas de Información
          </p>
        </footer>
      </div>
    </div>
  )
}
